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

// Helper function to get cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null; // Return null if cookie not found
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
        hsData.forEach((field) => {
          formData[field.name] = field.value;
        });
      }

      const submissionTime = new Date().toISOString();
      console.log("MS Form - Final form data:", formData);

      if (Object.keys(formData).length === 0) {
        console.error("MS Form - No form data available");
        // Sentry.captureMessage("MS Form: No form data available", {
        //   level: "error",
        //   tags: {
        //     type: "hubspot_submission",
        //     form: "ms_hubspot_contact",
        //   },
        //   extra: {
        //     eventData: event.data,
        //     submissionTime: submissionTime,
        //     formElement: document.querySelector(".right_step_form form")?.outerHTML,
        //   },
        // });
      }

      const route = FormRouterConfig.determineRoute(formData);
      console.log("MS Form - Determined route:", route);
      let redirectUrl = FormRouterConfig.LANDING_PAGES[route] || FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
      console.log("MS Form - Base URL:", redirectUrl);

      // No longer appending hubspotutk to the URL

      console.log("MS Form - Redirecting to:", redirectUrl);
      setTimeout(() => {
        try {
          window.location.href = redirectUrl;
        } catch (error) {
          console.error("MS Form - Redirect failed:", error);
          // Sentry.captureException(error, {
          //   extra: {
          //     context: "MS Form redirect failed",
          //     route: route,
          //     formData: formData,
          //   },
          //   tags: {
          //     type: "redirect",
          //     form: "ms_hubspot_contact",
          //   },
          // });
          let fallbackUrl = FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
          // No longer appending hubspotutk to the fallback URL
          window.location.href = fallbackUrl;
        }
      }, 700);
    }
  }
});
