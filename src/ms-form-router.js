// Configuration
const LANDING_PAGES = {
  FREE_TRIAL: "thank-you/free-trial.html",
  SCHEDULER: "thank-you/success-schedule.html",
  NOT_QUALIFIED: "thank-you/denied.html",
};

// Form routing logic
function determineRoute(formData) {
  // Extract relevant fields
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

// Setup multi-step form functionality
function setupMultiStepForm($form) {
  const $fieldsets = $form.find("> div");

  // Create step containers
  const $firstTwo = $fieldsets.slice(1, 3);
  $firstTwo.wrapAll('<div class="form-step" data-step="1"></div>');

  const $nextThree = $fieldsets.slice(3, 6);
  $nextThree.wrapAll('<div class="form-step" data-step="2"></div>');

  const $nextTwo = $fieldsets.slice(6, 8);
  $nextTwo.wrapAll('<div class="form-step" data-step="3"></div>');

  const $lastSix = $fieldsets.slice(8, 14);
  $lastSix.wrapAll('<div class="form-step" data-step="4"></div>');

  // Add step navigation
  let stepNav = '<div class="step-nav">';
  $(".form-step").each((index) => {
    stepNav += `<span class="step-number" data-step="${index}">${index + 1}</span>`;
  });
  stepNav += "</div>";
  $form.prepend(stepNav);

  // Add navigation buttons
  $form.append(`
    <div class="form-navigation">
      <button type="button" class="previous button-secondary">Previous</button>
      <button type="button" class="next button-primary">Next</button>
      <button type="submit" class="submit button-primary">Submit</button>
    </div>
    <div class="error-message" style="color: red; display: none;">Please fill out all required fields.</div>
  `);

  setupStepNavigation($form);
}

function setupStepNavigation($form) {
  const $steps = $form.find(".form-step");
  const $stepNumbers = $form.find(".step-number");
  let currentStep = 0;

  function showStep(index) {
    $steps.removeClass("active").eq(index).addClass("active");
    $stepNumbers.eq(index).addClass("active");
    updateButtons(index);
  }

  function updateButtons(index) {
    const $navigation = $(".form-navigation");
    $navigation.find(".previous")[index === 0 ? "hide" : "show"]();

    if (index === $steps.length - 1) {
      $navigation.find(".next").hide();
      $navigation.find(".submit").show();
    } else {
      $navigation.find(".next").show();
      $navigation.find(".submit").hide();
    }
  }

  function validateStep(index) {
    let isValid = true;
    const $currentStep = $steps.eq(index);

    // Validate select elements
    $currentStep.find("select").each(function () {
      if ($(this).closest("[required]").length && !$(this).val()) {
        isValid = false;
      }
    });

    // Validate input elements
    $currentStep.find("input").each(function () {
      const $parent = $(this).closest("[required]");
      if ($parent.length && !$(this).val()) {
        isValid = false;
      }
      if ($(this).attr("data-gtm-form-interact-field-id")) {
        isValid = true;
      }
    });

    // Validate radio buttons
    $currentStep.find("ul.multi-container").each(function () {
      if (!$(this).find('input[type="radio"]:checked').length) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Event handlers
  $(".next").click(() => {
    if (validateStep(currentStep)) {
      $(".error-message").hide();
      if (currentStep < $steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    } else {
      $(".error-message").show();
    }
  });

  $(".previous").click(() => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // Initialize first step
  showStep(currentStep);
}

// Initialize HubSpot form handler
function initializeForm() {
  window.hbspt.forms.create({
    region: "na1",
    portalId: "7507639",
    formId: "807fd7b2-0593-475d-a6e9-4a3a08520238",
    target: "#hubspot-form-container",
    onFormReady: function ($form) {
      console.log("Form Ready");
      setupMultiStepForm($form);

      // Add change listeners to all fields
      $form.find("input, select, textarea").on("change", function () {
        console.log("Field Changed:", {
          name: this.name,
          value: this.value,
        });
      });
    },
    onFormSubmit: function ($form) {
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
      } catch (error) {
        console.error("Error storing form data:", error);
      }

      // Trigger ChiliPiper if it's a qualified lead
      if (route === "SCHEDULER") {
        ChiliPiper.submit("joinheard", "inbound-router", {
          title: "Thanks! What time works best for a quick call?",
          map: true,
          lead: formDataObj,
        });
      } else {
        window.location.href = LANDING_PAGES[route] || LANDING_PAGES.NOT_QUALIFIED;
      }
    },
  });
}

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", () => {
  if (window.hbspt) {
    initializeForm();
  } else {
    // Wait for HubSpot script to load
    window.addEventListener("load", () => {
      if (window.hbspt) {
        initializeForm();
      }
    });
  }
});

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    determineRoute,
    LANDING_PAGES,
    initializeForm,
    setupMultiStepForm,
    setupStepNavigation,
  };
}
