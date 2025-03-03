// Form Router Configuration
const FormRouterConfig = {
  FORM_FIELDS: {
    multiOwner: "is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",
    state: "state",
    practiceSetup: "how_is_your_business_setup__v2",
    income: "what_is_your_expected_annual_income_for_2024___1099__private_practice_",
    practiceRunning: "how_long_have_you_been_running_your_private_practice_",
    profession: "what_best_describes_your_practice_",
    employeeCount: "does_your_practice_employ_any_w2_employees_or_1099_contractors_who_see_patients_-0d9c387a-9c8b-40c4-8d46-3135f754f077",
  },

  // Landing page routes
  LANDING_PAGES: {
    FREE_TRIAL: "/thank-you/free-trial",
    SCHEDULER: "/thank-you/schedule",
    NOT_QUALIFIED: "/thank-you/success",
  },

  // Qualification criteria
  DISQUALIFYING_CONDITIONS: {
    multiOwner: ["yes"],
    state: ["international"],
    practiceSetup: ["c corp"],
    income: ["none", "less than $20,000"],
    profession: ["dietician", "nutritionist", "massage therapist", "physical therapist", "dietician or nutritionist", "dietetics or nutrition counseling"],
    // practiceRunning: ["opening practice in 1+ month", "opening in 1+ months"],
    practiceRunning: ["no"],
    employeeCount: ["yes (more than 10 employees)"],
  },

  INCOME_TIERS: {
    QUALIFIED_INCOME: ["$20,000 - $49,999", "$50,000 - $99,999", "more than $100,000"],
  },

  determineRoute(formData) {
    // Extract relevant fields (with null checks)
    const multiOwner = (formData[this.FORM_FIELDS.multiOwner] || "").toLowerCase();
    const state = (formData[this.FORM_FIELDS.state] || "").toLowerCase();
    const practiceSetup = (formData[this.FORM_FIELDS.practiceSetup] || "").toLowerCase();
    const income = (formData[this.FORM_FIELDS.income] || "").toLowerCase();
    const practiceRunning = (formData[this.FORM_FIELDS.practiceRunning] || "").toLowerCase();
    const profession = (formData[this.FORM_FIELDS.profession] || "").toLowerCase();

    console.log("Form Router Debug:", {
      multiOwner,
      state,
      practiceSetup,
      income,
      practiceRunning,
      profession,
      formData,
    });

    // Check DQ conditions
    const isDQ =
      this.DISQUALIFYING_CONDITIONS.multiOwner.includes(multiOwner) ||
      this.DISQUALIFYING_CONDITIONS.state.includes(state) ||
      this.DISQUALIFYING_CONDITIONS.practiceSetup.includes(practiceSetup) ||
      this.DISQUALIFYING_CONDITIONS.income.includes(income) ||
      this.DISQUALIFYING_CONDITIONS.profession.some((p) => profession.includes(p)) ||
      this.DISQUALIFYING_CONDITIONS.practiceRunning.includes(practiceRunning) ||
      this.DISQUALIFYING_CONDITIONS.employeeCount.includes(employeeCount);

    if (isDQ) {
      console.log("Form Router: Not qualified due to DQ conditions");
      return "NOT_QUALIFIED";
    }

    // Check for qualified booking (income >= $20k)
    if (this.INCOME_TIERS.QUALIFIED_INCOME.some((tier) => income.includes(tier))) {
      console.log("Form Router: Qualified for scheduler");
      return "SCHEDULER";
    }

    console.log("Form Router: Not qualified (default)");
    return "NOT_QUALIFIED";
  },
};

// Export for ES modules
export { FormRouterConfig };

// Expose globally for browser
if (typeof window !== "undefined") {
  window.FormRouterConfig = FormRouterConfig;
}
