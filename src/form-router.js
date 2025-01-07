// Initialize HubSpot form handler
function initializeForm() {
  // Create the form immediately, but verify config before handling submissions
  window.hbspt.forms.create({
    region: "na1",
    portalId: "7507639",
    formId: "0d9c387a-9c8b-40c4-8d46-3135f754f077",
    target: "#hubspot-form-container",
    onFormReady: function ($form) {
      console.log("Form Ready - Config loaded:", !!window.FormRouterConfig);
      const formElements = $form.querySelectorAll("input, select, textarea");
      formElements.forEach((element) => {
        element.addEventListener("change", function () {
          console.log("Field Changed:", {
            name: this.name,
            value: this.value,
          });
        });
      });
    },
    onFormSubmit: function ($form) {
      // Verify config is available before proceeding
      if (!window.FormRouterConfig) {
        console.error("FormRouterConfig not found - ensure form-config.js is loaded");
        return false;
      }

      console.log("Form Submit - Starting submission process");
      const formData = new FormData($form);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formDataObj));
        console.log("Form Submit - Stored form data:", formDataObj);
      } catch (error) {
        console.error("Form Submit - Storage failed:", error);
        Sentry.captureException(error, {
          extra: {
            context: "Form submission storage failed",
            formData: formDataObj,
          },
          tags: {
            type: "local_storage",
            form: "hubspot_contact",
          },
        });
      }

      return true;
    },
    onFormSubmitted: function ($form) {
      // Verify config is available before proceeding
      if (!window.FormRouterConfig) {
        console.error("FormRouterConfig not found during submission - ensure form-config.js is loaded");
        return false;
      }

      console.log("Form Submitted - Processing submission");
      handleRedirect();
      return false;
    },
    onFormSubmitError: function ($form, error) {
      Sentry.captureException(error, {
        extra: {
          context: "HubSpot form submission error",
          formData: Object.fromEntries(new FormData($form)),
        },
        tags: {
          type: "hubspot_submission_error",
          form: "hubspot_contact",
        },
      });
    },
  });
}

// Form routing logic
function determineRoute(formData) {
  // Use the form fields from config
  const multiOwner = (formData[window.FormRouterConfig.FORM_FIELDS.multiOwner] || "").toLowerCase();
  const state = (formData[window.FormRouterConfig.FORM_FIELDS.state] || "").toLowerCase();
  const practiceSetup = (formData[window.FormRouterConfig.FORM_FIELDS.practiceSetup] || "").toLowerCase();
  const income = (formData[window.FormRouterConfig.FORM_FIELDS.income] || "").toLowerCase();
  const practiceRunning = (formData[window.FormRouterConfig.FORM_FIELDS.practiceRunning] || "").toLowerCase();
  const profession = (formData[window.FormRouterConfig.FORM_FIELDS.profession] || "").toLowerCase();

  return window.FormRouterConfig.determineRoute(formData);
}

// Initialize when HubSpot script is loaded
if (window.hbspt) {
  initializeForm();
} else {
  // Wait for HubSpot script to load
  window.addEventListener("load", function () {
    if (window.hbspt) {
      initializeForm();
    }
  });
}

// Helper function to handle redirect logic
function handleRedirect() {
  try {
    const formData = JSON.parse(localStorage.getItem("hubspot_form_data") || "{}");
    console.log("Redirect Debug - Form Data:", formData);

    const route = determineRoute(formData);
    console.log("Redirect Debug - Determined Route:", route);

    const finalUrl = window.FormRouterConfig.LANDING_PAGES[route] || window.FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
    console.log("Redirect Debug - Final URL:", finalUrl);

    // Ensure window.FormRouterConfig exists
    if (!window.FormRouterConfig) {
      console.error("FormRouterConfig not found - form-config.js may not be loaded");
      return;
    }

    setTimeout(() => {
      console.log("Redirect Debug - Executing redirect to:", finalUrl);
      window.location.href = finalUrl;
    }, 700);
  } catch (error) {
    console.error("Redirect Debug - Error:", error);
    Sentry.captureException(error, {
      extra: {
        context: "Post-submission redirect failed",
      },
      tags: {
        type: "redirect",
        form: "hubspot_contact",
      },
    });
    // Fallback to NOT_QUALIFIED if something goes wrong
    window.location.href = window.FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
  }
}
