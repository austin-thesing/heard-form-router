// Add these configurations directly in ms-form-router.js
const DISQUALIFYING_CONDITIONS = {
  multiOwner: ["yes"],
  state: ["international"],
  practiceSetup: ["c corp"],
  income: ["none", "less than $20,000"],
  profession: ["dietician", "nutritionist", "massage therapist", "physical therapist", "dietician or nutritionist", "dietetics or nutrition counseling"],
  practiceRunning: ["opening practice in 1+ month", "opening in 1+ months"],
};

const INCOME_TIERS = {
  HIGH_INCOME: ["$50,000 - $99,999", "more than $100,000"],
  MID_INCOME: ["$20,000 - $49,999"],
};

// Update the determineRoute function
function determineRoute(formData) {
  // Extract relevant fields (with null checks)
  const multiOwner = (formData.is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_ || "").toLowerCase();
  const state = (formData.state || "").toLowerCase();
  const practiceSetup = (formData.how_is_your_business_setup__v2 || "").toLowerCase();
  const income = (formData.what_is_your_expected_annual_income_for_2024___1099__private_practice_ || "").toLowerCase();
  const practiceRunning = (formData.how_long_have_you_been_running_your_private_practice_ || "").toLowerCase();
  const profession = (formData.what_best_describes_your_practice_ || "").toLowerCase();

  // Check DQ conditions
  const isDQ =
    DISQUALIFYING_CONDITIONS.multiOwner.includes(multiOwner) ||
    DISQUALIFYING_CONDITIONS.state.includes(state) ||
    DISQUALIFYING_CONDITIONS.practiceSetup.includes(practiceSetup) ||
    DISQUALIFYING_CONDITIONS.income.includes(income) ||
    DISQUALIFYING_CONDITIONS.profession.some((p) => profession.includes(p)) ||
    DISQUALIFYING_CONDITIONS.practiceRunning.includes(practiceRunning);

  if (isDQ) {
    return "NOT_QUALIFIED";
  }

  // Check for qualified booking (income >= $50k)
  if (INCOME_TIERS.HIGH_INCOME.some((tier) => income.includes(tier))) {
    return "SCHEDULER";
  }

  // Check for free trial ($20k-$50k)
  if (INCOME_TIERS.MID_INCOME.some((tier) => income.includes(tier))) {
    return "FREE_TRIAL";
  }

  return "NOT_QUALIFIED";
}

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
      // console.log("Field Changed:", {
      //   name: this.name,
      //   value: this.value,
      // });
    });
  });

  // Track radio buttons
  form.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", function (event) {
      // console.log("Field Changed:", {
      //   name: this.name,
      //   value: this.value,
      // });
    });
  });

  trackingInitialized = true;
  // console.log("Field tracking successfully initialized");
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
      // console.log("Form Validation Failed:", event.data.data);
    }

    // Handle form submission
    if (event.data.eventName === "onFormSubmit") {
      // Check if we have a valid HubSpot submission
      const hsData = event.data.data;
      if (!hsData || !Array.isArray(hsData) || hsData.length === 0) {
        Sentry.captureMessage("MS Form: HubSpot submission data missing", {
          level: "error",
          tags: {
            type: "hubspot_submission",
            form: "ms_hubspot_contact",
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

      // Determine route
      const route = determineRoute(formData);

      // Shorter delay that should still ensure HubSpot processing
      setTimeout(() => {
        try {
          window.location.href = LANDING_PAGES[route];
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
          window.location.href = LANDING_PAGES.NOT_QUALIFIED;
        }
      }, 500);
    }
  }
});
