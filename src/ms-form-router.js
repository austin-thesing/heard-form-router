// Import shared routing logic
import { determineRoute, LANDING_PAGES } from "./routing-logic.js";

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

// Initialize when HubSpot script is loaded
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
