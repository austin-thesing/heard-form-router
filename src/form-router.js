// Initialize HubSpot form handler
function initializeForm() {
  window.hbspt.forms.create({
    region: "na1",
    portalId: "7507639",
    formId: "0d9c387a-9c8b-40c4-8d46-3135f754f077",
    target: "#hubspot-form-container",
    onFormReady: function ($form) {
      const formElements = $form.querySelectorAll("input, select, textarea");
      formElements.forEach((element) => {
        element.addEventListener("change", function () {
          // Field change tracking if needed
        });
      });
    },
    onFormSubmit: function ($form) {
      const formData = new FormData($form);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formDataObj));
      } catch (error) {
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
        console.error("Form submission storage failed:", error);
      }

      return true;
    },
    onFormSubmitted: function ($form) {
      // Get the form submission data from HubSpot's callback
      const submissionValues = $form?.dataset?.submissionValues;
      if (!submissionValues) {
        Sentry.captureMessage("HubSpot submission context missing", {
          level: "error",
          tags: {
            type: "hubspot_submission",
            form: "hubspot_contact",
          },
          extra: {
            formId: $form?.id,
            formData: Object.fromEntries(new FormData($form)),
            timestamp: new Date().toISOString(),
          },
        });
      }

      try {
        // Check if the form was actually submitted to HubSpot
        const formEl = $form.querySelector("form");
        const submittedToHubSpot = formEl?.getAttribute("data-hubspot-submitted") === "true";

        if (!submittedToHubSpot) {
          Sentry.captureMessage("HubSpot submission values missing", {
            level: "error",
            tags: {
              type: "hubspot_submission",
              form: "hubspot_contact",
            },
            extra: {
              formElement: $form?.outerHTML,
              submissionTime: new Date().toISOString(),
              timestamp: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            context: "HubSpot context parsing failed",
            formElement: $form?.outerHTML,
          },
          tags: {
            type: "hubspot_submission",
            form: "hubspot_contact",
          },
        });
      }

      // Always proceed with redirect regardless of any errors
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

// Helper function to handle redirect logic
function handleRedirect() {
  try {
    const formData = JSON.parse(localStorage.getItem("hubspot_form_data") || "{}");
    const route = window.FormRouterConfig.determineRoute(formData);
    const finalUrl = window.FormRouterConfig.LANDING_PAGES[route] || window.FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;

    setTimeout(() => {
      window.location.href = finalUrl;
    }, 700);
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        context: "Post-submission redirect failed",
      },
      tags: {
        type: "redirect",
        form: "hubspot_contact",
      },
    });
    console.error("Post-submission redirect failed:", error);
    // Fallback to NOT_QUALIFIED if something goes wrong
    window.location.href = window.FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
  }
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
