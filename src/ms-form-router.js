import { LANDING_PAGES, determineRoute } from "./form-config.js";

// Track if we've already added the field tracking
let trackingInitialized = false;

// Add form field tracking
function addFieldTracking() {
  if (trackingInitialized) return;

  // Wait for the form to be fully rendered
  const form = document.querySelector(".right_step_form form");
  if (!form) {
    setTimeout(addFieldTracking, 500);
    return;
  }

  // Track all input and select elements
  form.querySelectorAll("input, select").forEach((element) => {
    element.addEventListener("change", function (event) {
      // Field change tracking if needed
    });
  });

  // Track radio buttons
  form.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", function (event) {
      // Field change tracking if needed
    });
  });

  trackingInitialized = true;
}

// Initialize form handling
window.addEventListener("message", function (event) {
  if (event.data.type === "hsFormCallback") {
    if (event.data.eventName === "onFormReady") {
      // Add field tracking once form is ready
      setTimeout(addFieldTracking, 1000);
    }

    // Track validation errors
    if (event.data.eventName === "onFormFailedValidation") {
      // Handle validation errors if needed
    }

    // Handle form submission
    if (event.data.eventName === "onFormSubmit") {
      // Check if we have a valid HubSpot submission
      const hsData = event.data.data;
      const submissionTime = new Date().toISOString();

      if (!hsData || !Array.isArray(hsData) || hsData.length === 0) {
        Sentry.captureMessage("MS Form: HubSpot submission data missing", {
          level: "error",
          tags: {
            type: "hubspot_submission",
            form: "ms_hubspot_contact",
          },
          extra: {
            eventData: event.data,
            submissionTime: submissionTime,
            formElement: document.querySelector(".right_step_form form")?.outerHTML,
          },
        });
      }

      // Prepare form data
      const formData = {};
      for (const key in event.data.data) {
        formData[event.data.data[key].name] = event.data.data[key].value;
      }

      // Store form data
      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formData));
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            context: "MS Form submission storage failed",
            formData: formData,
          },
          tags: {
            type: "local_storage",
            form: "ms_hubspot_contact",
          },
        });
        console.error("Error storing form data:", error);
      }

      // Determine route and redirect (always proceed regardless of errors)
      const route = window.FormRouterConfig.determineRoute(formData);
      setTimeout(() => {
        try {
          window.location.href = window.FormRouterConfig.LANDING_PAGES[route];
        } catch (error) {
          Sentry.captureException(error, {
            extra: {
              context: "MS Form redirect failed",
              route: route,
            },
            tags: {
              type: "redirect",
              form: "ms_hubspot_contact",
            },
          });
          console.error("Redirect failed:", error);
          window.location.href = window.FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
        }
      }, 700);
    }
  }
});
