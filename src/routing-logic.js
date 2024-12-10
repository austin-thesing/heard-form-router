// Configuration
const LANDING_PAGES = {
  FREE_TRIAL: "thank-you/free-trial.html",
  SCHEDULER: "thank-you/success-schedule.html",
  NOT_QUALIFIED: "thank-you/denied.html",
};

/**
 * Determines the routing destination based on form data
 * @param {Object} formData - The form data object containing user responses
 * @returns {string} The routing destination (FREE_TRIAL, SCHEDULER, or NOT_QUALIFIED)
 */
function determineRoute(formData) {
  // Extract relevant fields with optional chaining for safety
  const multiOwner = formData.is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_?.toLowerCase();
  const state = formData.state?.toLowerCase();
  const practiceSetup = formData.how_is_your_business_setup__v2?.toLowerCase();
  const income = formData.what_is_your_expected_annual_income_for_2024___1099__private_practice_?.toLowerCase();
  const practiceRunning = formData.how_long_have_you_been_running_your_private_practice_?.toLowerCase();
  const profession = formData.what_best_describes_your_practice_?.toLowerCase();

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
  if (income?.includes("$50,000") || income?.includes("$100,000") || income?.includes("$150,000")) {
    return "SCHEDULER";
  }

  // Check for free trial ($20k-$50k)
  if (income?.includes("$20,000")) {
    return "FREE_TRIAL";
  }

  // Default fallback
  return "NOT_QUALIFIED";
}

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    determineRoute,
    LANDING_PAGES,
  };
} else {
  // For browser usage
  window.HeardRouting = {
    determineRoute,
    LANDING_PAGES,
  };
}
