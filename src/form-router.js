// Import shared routing logic
import { determineRoute, LANDING_PAGES } from "./routing-logic.js";

// Initialize HubSpot form handler
function initializeForm() {
  window.hbspt.forms.create({
    region: "na1",
    portalId: "7507639",
    formId: "0d9c387a-9c8b-40c4-8d46-3135f754f077",
    target: "#hubspot-form-container",
    onFormReady: function ($form) {
      console.log("Form Ready");

      // Add change listeners to all fields
      $form.find("input, select, textarea").on("change", function () {
        console.log("Field Changed:", {
          name: this.name,
          value: this.value,
        });
      });
    },
    onFormSubmit: function ($form) {
      // Get form data using HubSpot's API
      const formData = $form.serializeArray();
      const formDataObj = formData.reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
      }, {});

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

      window.location.href = LANDING_PAGES[route] || LANDING_PAGES.NOT_QUALIFIED;
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
