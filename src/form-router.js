import { FormRouterConfig } from "./form-config.js";

// Initialize HubSpot form handler
function initializeForm() {
  console.log("Form Router - Initializing form handler");
  // Create the form immediately, but verify config before handling submissions
  window.hbspt.forms.create({
    region: "na1",
    portalId: "7507639",
    formId: "0d9c387a-9c8b-40c4-8d46-3135f754f077",
    target: "#hubspot-form-container",
    onFormReady: function ($form) {
      console.log("Form Router - Form Ready");
      console.log("Form Router - Config loaded:", !!FormRouterConfig);

      // Add change event listeners to form fields
      console.log("Form Router - Adding field tracking");
      $form.find("input, select, textarea").each(function () {
        $(this).on("change", function () {
          console.log("Form Router - Field Changed:", {
            name: this.name,
            value: this.value,
            type: this.type || "textarea",
          });
        });
      });
    },
    onFormSubmit: function ($form) {
      // Verify config is available before proceeding
      if (!FormRouterConfig) {
        console.error("Form Router - FormRouterConfig not found - ensure form-config.js is loaded");
        return false;
      }

      console.log("Form Router - Starting submission process");
      const formData = new FormData($form);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formDataObj));
        console.log("Form Router - Stored form data:", formDataObj);
      } catch (error) {
        console.error("Form Router - Storage failed:", error);
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
      if (!FormRouterConfig) {
        console.error("Form Router - FormRouterConfig not found during submission - ensure form-config.js is loaded");
        return false;
      }

      console.log("Form Router - Processing submission");
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
  const multiOwner = (formData[FormRouterConfig.FORM_FIELDS.multiOwner] || "").toLowerCase();
  const state = (formData[FormRouterConfig.FORM_FIELDS.state] || "").toLowerCase();
  const practiceSetup = (formData[FormRouterConfig.FORM_FIELDS.practiceSetup] || "").toLowerCase();
  const income = (formData[FormRouterConfig.FORM_FIELDS.income] || "").toLowerCase();
  const practiceRunning = (formData[FormRouterConfig.FORM_FIELDS.practiceRunning] || "").toLowerCase();
  const profession = (formData[FormRouterConfig.FORM_FIELDS.profession] || "").toLowerCase();

  return FormRouterConfig.determineRoute(formData);
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
    console.log("Form Router - Retrieved form data:", formData);

    const route = determineRoute(formData);
    console.log("Form Router - Determined route:", route);

    const finalUrl = FormRouterConfig.LANDING_PAGES[route] || FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
    console.log("Form Router - Final URL:", finalUrl);

    // Ensure window.FormRouterConfig exists
    if (!FormRouterConfig) {
      console.error("Form Router - FormRouterConfig not found - form-config.js may not be loaded");
      return;
    }

    setTimeout(() => {
      console.log("Form Router - Executing redirect to:", finalUrl);
      window.location.href = finalUrl;
    }, 700);
  } catch (error) {
    console.error("Form Router - Redirect failed:", error);
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
    window.location.href = FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
  }
}
