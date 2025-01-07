// Form Router Configuration
(function () {
  // Landing page routes
  const LANDING_PAGES = {
    FREE_TRIAL: "/thank-you/free-trial",
    SCHEDULER: "/thank-you/schedule",
    NOT_QUALIFIED: "/thank-you/success",
  };

  // Qualification criteria
  const DISQUALIFYING_CONDITIONS = {
    multiOwner: ["yes"],
    state: ["international"],
    practiceSetup: ["c corp"],
    income: ["none", "less than $20,000"],
    profession: ["dietician", "nutritionist", "massage therapist", "physical therapist", "dietician or nutritionist", "dietetics or nutrition counseling"],
    practiceRunning: ["opening practice in 1+ month", "opening in 1+ months"],
  };

  const INCOME_TIERS = {
    QUALIFIED_INCOME: ["$20,000 - $49,999", "$50,000 - $99,999", "more than $100,000"],
  };

  // Form field mappings
  const FORM_FIELDS = {
    multiOwner: "is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",
    state: "state",
    practiceSetup: "how_is_your_business_setup__v2",
    income: "what_is_your_expected_annual_income_for_2024___1099__private_practice_",
    practiceRunning: "how_long_have_you_been_running_your_private_practice_",
    profession: "what_best_describes_your_practice_",
  };

  // Shared routing logic
  function determineRoute(formData) {
    // Extract relevant fields (with null checks)
    const multiOwner = (formData[FORM_FIELDS.multiOwner] || "").toLowerCase();
    const state = (formData[FORM_FIELDS.state] || "").toLowerCase();
    const practiceSetup = (formData[FORM_FIELDS.practiceSetup] || "").toLowerCase();
    const income = (formData[FORM_FIELDS.income] || "").toLowerCase();
    const practiceRunning = (formData[FORM_FIELDS.practiceRunning] || "").toLowerCase();
    const profession = (formData[FORM_FIELDS.profession] || "").toLowerCase();

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

    // Check for qualified booking (income >= $20k)
    if (INCOME_TIERS.QUALIFIED_INCOME.some((tier) => income.includes(tier))) {
      return "SCHEDULER";
    }

    return "NOT_QUALIFIED";
  }

  // Attach to window object
  window.FormRouterConfig = {
    LANDING_PAGES,
    DISQUALIFYING_CONDITIONS,
    INCOME_TIERS,
    FORM_FIELDS,
    determineRoute,
  };
})();
