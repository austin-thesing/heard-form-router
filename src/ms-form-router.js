import { FormRouterConfig } from "./form-config.js";

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

  console.log("MS Form - Adding field tracking");

  // Track all input and select elements
  form.querySelectorAll("input, select").forEach((element) => {
    element.addEventListener("change", function (event) {
      console.log("MS Form - Field Changed:", {
        name: event.target.name,
        value: event.target.value,
      });
    });
  });

  trackingInitialized = true;
}

// Initialize form handling
window.addEventListener("message", function (event) {
  if (event.data.type === "hsFormCallback") {
    if (event.data.eventName === "onFormReady") {
      console.log("MS Form - Form Ready");
      setTimeout(addFieldTracking, 1000);
    }

    if (event.data.eventName === "onFormSubmit") {
      console.log("MS Form - Form Submitted");

      // Get the stored form data
      let formData;
      try {
        formData = JSON.parse(localStorage.getItem("hubspot_form_data") || "{}");
        console.log("MS Form - Retrieved stored form data:", formData);
      } catch (error) {
        console.error("MS Form - Failed to retrieve stored form data:", error);
        formData = {};
      }

      // Merge with HubSpot data if available
      const hsData = event.data.data;
      if (hsData && Array.isArray(hsData)) {
        console.log("MS Form - Raw HubSpot form fields:", hsData);
        hsData.forEach((field) => {
          console.log(`MS Form - Field: "${field.name}" = "${field.value}"`);
          formData[field.name] = field.value;
        });
      }

      const submissionTime = new Date().toISOString();
      console.log("MS Form - Final form data:", formData);

      // Log the expected field names and check if they exist in the form data
      console.log("MS Form - Expected field names:", {
        multiOwner: FormRouterConfig.FORM_FIELDS.multiOwner,
        state: FormRouterConfig.FORM_FIELDS.state,
        practiceSetup: FormRouterConfig.FORM_FIELDS.practiceSetup,
        income: FormRouterConfig.FORM_FIELDS.income,
        practiceRunning: FormRouterConfig.FORM_FIELDS.practiceRunning,
        profession: FormRouterConfig.FORM_FIELDS.profession,
        employeeCount: FormRouterConfig.FORM_FIELDS.employeeCount,
      });

      console.log("MS Form - Field existence check:", {
        multiOwner: formData.hasOwnProperty(FormRouterConfig.FORM_FIELDS.multiOwner),
        state: formData.hasOwnProperty(FormRouterConfig.FORM_FIELDS.state),
        practiceSetup: formData.hasOwnProperty(FormRouterConfig.FORM_FIELDS.practiceSetup),
        income: formData.hasOwnProperty(FormRouterConfig.FORM_FIELDS.income),
        practiceRunning: formData.hasOwnProperty(FormRouterConfig.FORM_FIELDS.practiceRunning),
        profession: formData.hasOwnProperty(FormRouterConfig.FORM_FIELDS.profession),
        employeeCount: formData.hasOwnProperty(FormRouterConfig.FORM_FIELDS.employeeCount),
      });

      if (Object.keys(formData).length === 0) {
        console.error("MS Form - No form data available");
        Sentry.captureMessage("MS Form: No form data available", {
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

      const route = FormRouterConfig.determineRoute(formData);
      console.log("MS Form - Determined route:", route);

      setTimeout(() => {
        try {
          const redirectUrl = FormRouterConfig.LANDING_PAGES[route];
          console.log("MS Form - Redirecting to:", redirectUrl);
          // window.location.href = redirectUrl; // Commented out for debugging
        } catch (error) {
          console.error("MS Form - Redirect failed:", error);
          Sentry.captureException(error, {
            extra: {
              context: "MS Form redirect failed",
              route: route,
              formData: formData,
            },
            tags: {
              type: "redirect",
              form: "ms_hubspot_contact",
            },
          });
          // Fallback to NOT_QUALIFIED if something goes wrong
          // window.location.href = FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED; // Commented out for debugging
        }
      }, 700);
    }
  }
});
