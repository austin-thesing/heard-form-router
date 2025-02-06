// Form Router Configuration
const FormRouterConfig = {
  FORM_FIELDS: {
    multiOwner: "multi_owner",
    state: "state",
    practiceSetup: "practice_setup",
    income: "income",
    practiceRunning: "practice_running",
    profession: "profession",
  },

  LANDING_PAGES: {
    QUALIFIED: "/qualified",
    NOT_QUALIFIED: "/not-qualified",
    // Add other landing pages as needed
  },

  determineRoute(formData) {
    // Your existing route determination logic here
    const multiOwner = (formData[this.FORM_FIELDS.multiOwner] || "").toLowerCase();
    const state = (formData[this.FORM_FIELDS.state] || "").toLowerCase();
    const practiceSetup = (formData[this.FORM_FIELDS.practiceSetup] || "").toLowerCase();
    const income = (formData[this.FORM_FIELDS.income] || "").toLowerCase();
    const practiceRunning = (formData[this.FORM_FIELDS.practiceRunning] || "").toLowerCase();
    const profession = (formData[this.FORM_FIELDS.profession] || "").toLowerCase();

    // Your routing logic here
    // This is a placeholder - replace with your actual logic
    return "QUALIFIED";
  },
};

// Export for ES modules
export { FormRouterConfig };

// Expose globally for browser
if (typeof window !== "undefined") {
  window.FormRouterConfig = FormRouterConfig;
}
