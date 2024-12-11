import { LANDING_PAGES, determineRoute } from "./form-config.js";

// Initialize HubSpot form handler
function initializeForm() {
  window.hbspt.forms.create({
    region: "na1",
    portalId: "7507639",
    formId: "0d9c387a-9c8b-40c4-8d46-3135f754f077",
    target: "#hubspot-form-container",
    onFormReady: function ($form) {
      console.log("Form Ready");

      // Use native JS selectors instead of jQuery
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
      // Get form data using native FormData API instead of jQuery's serializeArray
      const formData = new FormData($form);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      console.log("Form submitted with data:", formDataObj);

      const route = determineRoute(formDataObj);
      console.log("Determined route:", route);

      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formDataObj));
        console.log("Successfully stored form data in localStorage");
        console.log("Stored data:", localStorage.getItem("hubspot_form_data"));
      } catch (error) {
        console.error("Error storing form data:", error);
      }

      const finalUrl = LANDING_PAGES[route] || LANDING_PAGES.NOT_QUALIFIED;
      console.log("Redirecting to:", finalUrl);
      window.location.href = finalUrl;
    },
  });
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
