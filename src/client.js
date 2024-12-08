// Configuration
const LANDING_PAGES = {
  FREE_TRIAL: "thanks/free-trial.html",
  SCHEDULER: "thanks/success-schedule.html",
  NOT_QUALIFIED: "thanks/denied.html",
};

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

// Form routing logic
function determineRoute(formData) {
  // Extract relevant fields
  const multiOwner = formData.is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_.toLowerCase();
  const state = formData.state.toLowerCase();
  const practiceSetup = formData.how_is_your_business_setup__v2.toLowerCase();
  const income = formData.what_is_your_expected_annual_income_for_2024___1099__private_practice_.toLowerCase();
  const practiceRunning = formData.how_long_have_you_been_running_your_private_practice_.toLowerCase();
  const profession = formData.what_best_describes_your_practice_.toLowerCase();

  // Check for DQ conditions first
  const isDQ =
    multiOwner === "yes" ||
    state === "international" ||
    practiceSetup === "c corp" ||
    income === "none" ||
    income === "less than $20,000" ||
    practiceRunning === "opening practice in 1+ month" ||
    profession === "dietician" ||
    profession === "nutritionist" ||
    profession === "massage therapist" ||
    profession === "physical therapist";

  if (isDQ) {
    return "NOT_QUALIFIED";
  }

  // Check for qualified booking (income >= $50k)
  if (income.includes("$50,000") || income.includes("$100,000") || income.includes("$150,000")) {
    return "SCHEDULER";
  }

  // Check for free trial ($20k-$50k)
  if (income.includes("$20,000")) {
    return "FREE_TRIAL";
  }

  // Default fallback
  return "NOT_QUALIFIED";
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
