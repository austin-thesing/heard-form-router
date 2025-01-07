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
      // Add field tracking once form is ready
      setTimeout(addFieldTracking, 1000);
    }

    // Handle form submission
    if (event.data.eventName === "onFormSubmit") {
      console.log("MS Form - Form Submitted");

      // Check if we have a valid HubSpot submission
      const hsData = event.data.data;
      const submissionTime = new Date().toISOString();

      if (!hsData || !Array.isArray(hsData) || hsData.length === 0) {
        console.error("MS Form - HubSpot submission data missing");
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

      console.log("MS Form - Prepared form data:", formData);

      // Store form data
      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formData));
        console.log("MS Form - Stored form data in localStorage");
      } catch (error) {
        console.error("MS Form - Storage failed:", error);
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
      }

      // Determine route and redirect
      const route = window.FormRouterConfig.determineRoute(formData);
      console.log("MS Form - Determined route:", route);

      setTimeout(() => {
        try {
          const redirectUrl = window.FormRouterConfig.LANDING_PAGES[route];
          console.log("MS Form - Redirecting to:", redirectUrl);
          window.location.href = redirectUrl;
        } catch (error) {
          console.error("MS Form - Redirect failed:", error);
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
          window.location.href = window.FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
        }
      }, 700);
    }
  }
});
