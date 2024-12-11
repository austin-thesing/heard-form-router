// Landing page routes
export const LANDING_PAGES = {
  FREE_TRIAL: "/thank-you/free-trial",
  SCHEDULER: "/thank-you/schedule",
  NOT_QUALIFIED: "/thank-you/success",
};

// Qualification criteria
export const DISQUALIFYING_CONDITIONS = {
  multiOwner: ["yes"],
  state: ["international"],
  practiceSetup: ["c corp"],
  income: ["none", "less than $20,000"],
  profession: ["dietician", "nutritionist", "massage therapist", "physical therapist"],
  practiceRunning: ["opening practice in 1+ month"],
};

export const INCOME_TIERS = {
  HIGH_INCOME: ["$50,000", "$100,000", "$150,000"],
  MID_INCOME: ["$20,000"],
};

// Form field mappings
export const FORM_FIELDS = {
  multiOwner: "is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_",
  state: "state",
  practiceSetup: "how_is_your_business_setup__v2",
  income: "what_is_your_expected_annual_income_for_2024___1099__private_practice_",
  practiceRunning: "how_long_have_you_been_running_your_private_practice_",
  profession: "what_best_describes_your_practice_",
};

// Shared routing logic
export function determineRoute(formData) {
  // Normalize form data
  const normalizedData = {
    multiOwner: formData[FORM_FIELDS.multiOwner]?.toLowerCase(),
    state: formData[FORM_FIELDS.state]?.toLowerCase(),
    practiceSetup: formData[FORM_FIELDS.practiceSetup]?.toLowerCase(),
    income: formData[FORM_FIELDS.income]?.toLowerCase(),
    practiceRunning: formData[FORM_FIELDS.practiceRunning]?.toLowerCase(),
    profession: formData[FORM_FIELDS.profession]?.toLowerCase(),
  };

  // Check for DQ conditions
  const isDQ = Object.entries(DISQUALIFYING_CONDITIONS).some(([field, disqualifyingValues]) => {
    return disqualifyingValues.some((value) => normalizedData[field] === value.toLowerCase());
  });

  if (isDQ) {
    return "NOT_QUALIFIED";
  }

  // Check for qualified booking (income >= $50k)
  const isHighIncome = INCOME_TIERS.HIGH_INCOME.some((tier) => normalizedData.income.includes(tier.toLowerCase()));
  if (isHighIncome) {
    return "SCHEDULER";
  }

  // Check for free trial ($20k-$50k)
  const isMidIncome = INCOME_TIERS.MID_INCOME.some((tier) => normalizedData.income.includes(tier.toLowerCase()));
  if (isMidIncome) {
    return "FREE_TRIAL";
  }

  // Default fallback
  return "NOT_QUALIFIED";
}
