// Configuration
const LANDING_PAGES = {
  FREE_TRIAL: "/thank-you/free-trial",
  SCHEDULER: "/thank-you/schedule",
  NOT_QUALIFIED: "/thank-you/success",
};

// Add these configurations directly in form-router.js
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

// Initialize HubSpot form handler
function initializeForm() {
  window.hbspt.forms.create({
    region: "na1",
    portalId: "7507639",
    formId: "0d9c387a-9c8b-40c4-8d46-3135f754f077",
    target: "#hubspot-form-container",
    onFormReady: function ($form) {
      // console.log("Form Ready");

      const formElements = $form.querySelectorAll("input, select, textarea");
      formElements.forEach((element) => {
        element.addEventListener("change", function () {
          // console.log("Field Changed:", {
          //   name: this.name,
          //   value: this.value,
          // });
        });
      });
    },
    onFormSubmit: function ($form) {
      const formData = new FormData($form);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      try {
        localStorage.setItem("hubspot_form_data", JSON.stringify(formDataObj));
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            context: "Form submission storage failed",
            formData: formDataObj,
          },
          tags: {
            type: "local_storage",
            form: "hubspot_contact",
          },
        });
        console.error("Form submission storage failed:", error);
      }

      return true;
    },
    onFormSubmitted: function ($form) {
      // Track if HubSpot submission was successful
      const hsContext = $form.querySelector('input[name="hs_context"]');
      if (!hsContext) {
        Sentry.captureMessage("HubSpot submission context missing", {
          level: "error",
          tags: {
            type: "hubspot_submission",
            form: "hubspot_contact",
          },
          extra: {
            formElement: $form?.outerHTML,
            timestamp: new Date().toISOString(),
          },
        });
        handleRedirect();
        return false;
      }

      const contextValue = hsContext.value;
      if (!contextValue) {
        console.warn("HubSpot context value is empty");
        handleRedirect();
        return false;
      }

      const context = JSON.parse(contextValue);
      if (!context.submissionValues) {
        Sentry.captureMessage("HubSpot submission values missing", {
          level: "error",
          tags: {
            type: "hubspot_submission",
            form: "hubspot_contact",
          },
          extra: {
            context: contextValue,
            timestamp: new Date().toISOString(),
          },
        });
      }

      try {
        const formData = JSON.parse(localStorage.getItem("hubspot_form_data") || "{}");
        const route = determineRoute(formData);
        const finalUrl = LANDING_PAGES[route] || LANDING_PAGES.NOT_QUALIFIED;

        setTimeout(() => {
          window.location.href = finalUrl;
        }, 500);
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            context: "Post-submission redirect failed",
          },
          tags: {
            type: "redirect",
            form: "hubspot_contact",
          },
        });
        console.error("Post-submission redirect failed:", error);
        // Fallback to NOT_QUALIFIED if something goes wrong
        window.location.href = LANDING_PAGES.NOT_QUALIFIED;
      }

      return false;
    },
  });
}

// Form routing logic
function determineRoute(formData) {
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

// Helper function to handle redirect logic
function handleRedirect() {
  try {
    const formData = JSON.parse(localStorage.getItem("hubspot_form_data") || "{}");
    const route = determineRoute(formData);
    const finalUrl = LANDING_PAGES[route] || LANDING_PAGES.NOT_QUALIFIED;

    setTimeout(() => {
      window.location.href = finalUrl;
    }, 500);
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        context: "Post-submission redirect failed",
      },
      tags: {
        type: "redirect",
        form: "hubspot_contact",
      },
    });
    console.error("Post-submission redirect failed:", error);
    // Fallback to NOT_QUALIFIED if something goes wrong
    window.location.href = LANDING_PAGES.NOT_QUALIFIED;
  }
}
