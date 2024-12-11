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
      console.log("Field Changed:", {
        name: this.name,
        value: this.value,
      });
    });
  });

  // Track radio buttons
  form.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", function (event) {
      console.log("Field Changed:", {
        name: this.name,
        value: this.value,
      });
    });
  });

  trackingInitialized = true;
  console.log("Field tracking successfully initialized");
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
      console.log("Form Validation Failed:", event.data.data);
    }

    // Handle form submission
    if (event.data.eventName === "onFormSubmit") {
      // Prepare form data
      const formData = {};
      for (const key in event.data.data) {
        formData[event.data.data[key].name] = event.data.data[key].value;
      }

      console.log("Form submitted with data:", formData);

      // Store form data
      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formData));
        console.log("Successfully stored form data in localStorage");
        console.log("Stored data:", localStorage.getItem("hubspot_form_data"));
      } catch (error) {
        console.error("Error storing form data:", error);
      }

      // Determine route
      const route = determineRoute(formData);
      console.log("Determined route:", route);

      // Handle redirect
      setTimeout(() => {
        window.location.href = LANDING_PAGES[route];
      }, 500);
    }
  }
});
