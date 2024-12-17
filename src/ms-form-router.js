// Configuration
const LANDING_PAGES = {
  FREE_TRIAL: "/thank-you/free-trial",
  SCHEDULER: "/thank-you/schedule",
  NOT_QUALIFIED: "/thank-you/success",
};

// Form routing logic
function determineRoute(formData) {
  // Extract relevant fields (with null checks)
  const multiOwner = (formData.is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_ || "").toLowerCase();
  const state = (formData.state || "").toLowerCase();
  const practiceSetup = (formData.how_is_your_business_setup__v2 || "").toLowerCase();
  const income = (formData.what_is_your_expected_annual_income_for_2024___1099__private_practice_ || "").toLowerCase();
  const practiceRunning = (formData.how_long_have_you_been_running_your_private_practice_ || "").toLowerCase();
  const profession = (formData.what_best_describes_your_practice_ || "").toLowerCase();

  // Check for DQ conditions first
  const isDQ =
    multiOwner === "yes" ||
    state === "international" ||
    practiceSetup === "c corp" ||
    practiceRunning === "opening in 1+ months" ||
    income === "none" ||
    income === "less than $20,000" ||
    profession === "dietician or nutritionist" ||
    profession === "dietetics or nutrition counseling" ||
    profession === "massage therapist" ||
    profession === "physical therapist";

  if (isDQ) {
    return "NOT_QUALIFIED";
  }

  // Check for qualified booking (income >= $50k)
  if (income.includes("$50,000 - $99,999") || income === "more than $100,000") {
    return "SCHEDULER";
  }

  // Check for free trial ($20k-$50k)
  if (income === "$20,000 - $49,999") {
    return "FREE_TRIAL";
  }

  // Default fallback
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
      // Prepare form data
      const formData = {};
      for (const key in event.data.data) {
        formData[event.data.data[key].name] = event.data.data[key].value;
      }

      // console.log("Form submitted with data:", formData);

      // Store form data
      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formData));
        // console.log("Successfully stored form data in localStorage");
        // console.log("Stored data:", localStorage.getItem("hubspot_form_data"));
      } catch (error) {
        // console.error("Error storing form data:", error);
      }

      // Determine route
      const route = determineRoute(formData);
      // console.log("Determined route:", route);

      // Shorter delay that should still ensure HubSpot processing
      setTimeout(() => {
        window.location.href = LANDING_PAGES[route];
      }, 500);
    }
  }
});
