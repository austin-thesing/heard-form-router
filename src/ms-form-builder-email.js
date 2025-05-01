// Loader CSS
const spinnerCSS = `
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: #226752;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes rotation {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .form-loading {
    min-height: 200px;
    position: relative;
  }

  .hs-form-field input[type="checkbox"] {
    vertical-align: middle;
    accent-color: #226752;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .hs-form-field.hs-fieldtype-checkbox label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.2;
  }

  .hs-form-field.hs-fieldtype-checkbox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .hs-form-field > label > span {
    font-weight: bold;
    line-height: 174%;
  }
`;

// Initialize loader
const styleSheet = document.createElement("style");
styleSheet.textContent = spinnerCSS;
document.head.appendChild(styleSheet);

// Constants
const CHECK_INTERVAL = 100;
const MAX_RETRIES = 50;
let retryCount = 0;

function initializeMultiStepForm() {
  const hubspotForm = document.querySelector(".hbspt-form form");

  // Early return if no form found
  if (!hubspotForm) {
    console.warn("HubSpot form not found, retrying...");
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(initializeMultiStepForm, CHECK_INTERVAL);
    }
    return;
  }

  let hasSubmittedMainForm = false;
  let partialEmail = null;
  let hasSubmittedPartialEmail = false;

  // Add email field tracking
  const emailField = hubspotForm.querySelector('input[type="email"]');
  if (emailField) {
    emailField.addEventListener("change", function (e) {
      const email = e.target.value;
      if (email && email.includes("@")) {
        partialEmail = email;
        // Find and update the hidden Webflow email input
        const webflowEmailInput = document.querySelector('.hidden-form input[type="email"]');
        if (webflowEmailInput) {
          webflowEmailInput.value = email;
        }
      }
    });
  }

  // Track main form submission
  hubspotForm.addEventListener("submit", function () {
    hasSubmittedMainForm = true;
  });

  // Function to submit partial email
  function submitPartialEmail() {
    if (!hasSubmittedMainForm && !hasSubmittedPartialEmail && partialEmail) {
      // Find the hidden Webflow form
      const webflowForm = document.querySelector(".hidden-form");
      if (webflowForm) {
        // Prevent default form submission
        const formData = new FormData(webflowForm);
        const action = webflowForm.getAttribute("action");

        // Use fetch to submit the form data
        fetch(action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              hasSubmittedPartialEmail = true;
              console.log("Submitted partial email:", partialEmail);
            }
          })
          .catch((error) => {
            console.error("Error submitting partial email:", error);
          });
      }
    }
  }

  // Handle tab visibility change
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      submitPartialEmail();
    }
  });

  // Handle page unload/close
  window.addEventListener("beforeunload", function () {
    submitPartialEmail();
  });

  // Get all form fields using HubSpot's specific class structure
  const formFields = Array.from(hubspotForm.querySelectorAll(".hs-form-field:not(.hs_submit):not(.hs_recaptcha):not(.hs_error_rollup)"));

  // Find and preserve the HubSpot title
  const hubspotTitle = hubspotForm.querySelector(".hs-richtext h3");
  if (hubspotTitle) {
    hubspotTitle.remove(); // Remove it temporarily to reposition it
  }

  // Move the legal consent container to be handled separately
  const legalConsentContainer = hubspotForm.querySelector(".legal-consent-container");
  const disclaimerText = hubspotForm.querySelector(".hs-richtext:not(:has(h3))"); // Don't select the title container

  // Remove disclaimer and consent from their current location
  if (disclaimerText) disclaimerText.remove();
  if (legalConsentContainer) legalConsentContainer.remove();

  // Clean up any existing multi-step elements
  const existingElements = hubspotForm.querySelectorAll(".step-nav, .form-step, .form-navigation, .error-message");
  existingElements.forEach((el) => el.remove());

  // Create step navigation and title section
  const headerSection = document.createElement("div");
  headerSection.className = "form-header";

  const stepNav = document.createElement("div");
  stepNav.className = "step-nav";
  [1, 2, 3, 4].forEach((num) => {
    const span = document.createElement("span");
    span.className = num === 1 ? "step-number active" : "step-number";
    span.dataset.step = (num - 1).toString();
    span.textContent = num.toString();
    stepNav.appendChild(span);
  });

  headerSection.appendChild(stepNav);
  if (hubspotTitle) {
    const titleWrapper = document.createElement("div");
    titleWrapper.className = "hubspot-title-wrapper";
    titleWrapper.appendChild(hubspotTitle);
    headerSection.appendChild(titleWrapper);
  }

  // Add header section to form
  hubspotForm.insertBefore(headerSection, hubspotForm.firstChild);

  // Create form steps with proper field distribution
  const step1Fields = formFields.slice(0, 2);
  const step2Fields = formFields.slice(2, 5);
  const step3Fields = formFields.slice(5, 8);
  const step4Fields = formFields.slice(8);

  // Create step wrappers
  const steps = [
    { fields: step1Fields, num: 1 },
    { fields: step2Fields, num: 2 },
    { fields: step3Fields, num: 3 },
    { fields: step4Fields, num: 4 },
  ].map(({ fields, num }) => {
    if (!fields.length) {
      console.warn(`No fields for step ${num}`);
      return null;
    }

    const wrapper = document.createElement("div");
    wrapper.className = num === 1 ? "form-step active" : "form-step";
    wrapper.dataset.step = num.toString();

    // Move fields into wrapper
    fields.forEach((field) => {
      if (field && field.parentNode) {
        wrapper.appendChild(field);
      }
    });

    // Add disclaimer and consent to the last step
    if (num === 4 && legalConsentContainer) {
      // Create a wrapper for the consent section
      const consentWrapper = document.createElement("div");
      consentWrapper.className = "consent-wrapper";

      // Add the legal consent container with the checkbox first
      if (legalConsentContainer) {
        consentWrapper.appendChild(legalConsentContainer);
      }

      // Create and add the privacy text below the checkbox
      const privacyText = document.createElement("div");
      privacyText.className = "privacy-text";
      privacyText.textContent =
        "Heard is committed to protecting and respecting your privacy, and we'll only use your personal information to administer your account and to provide the services you requested from us. By clicking submit on the form below, you consent to allow Heard to send SMS meeting reminders as well as store and process the personal information submitted above to provide you with the content requested.";

      // Add the privacy text after the checkbox
      consentWrapper.appendChild(privacyText);

      wrapper.appendChild(consentWrapper);
    }

    // Insert wrapper before submit button
    const submitDiv = hubspotForm.querySelector(".hs_submit");
    hubspotForm.insertBefore(wrapper, submitDiv);

    return wrapper;
  });

  // Verify all steps were created
  if (steps.some((step) => !step)) {
    console.error("Failed to create all form steps");
    return;
  }

  // Add navigation buttons
  const formNavigation = document.createElement("div");
  formNavigation.className = "form-navigation";
  formNavigation.innerHTML = `
    <button type="button" class="previous button-secondary">Previous</button>
    <button type="button" class="next button-primary">Next</button>
    <button type="submit" class="submit button-primary">Submit</button>
  `;

  // Add error message
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.style.display = "none";
  errorMessage.textContent = "Please fill out all required fields.";

  // Add navigation and error message to form
  hubspotForm.appendChild(formNavigation);
  hubspotForm.appendChild(errorMessage);

  // Setup step functionality
  let currentStep = 0;
  const stepNumbers = document.querySelectorAll(".step-nav .step-number");

  function showStep(index) {
    document.querySelectorAll(".form-step").forEach((step, i) => {
      step.classList.toggle("active", i === index);
    });
    stepNumbers.forEach((num, i) => {
      num.classList.toggle("active", i <= index);
    });
    updateButtons(index);
  }

  function updateButtons(index) {
    const prevButton = document.querySelector(".previous");
    const nextButton = document.querySelector(".next");
    const submitButton = document.querySelector(".submit");

    prevButton.style.display = index === 0 ? "none" : "block";
    nextButton.style.display = index === steps.length - 1 ? "none" : "block";
    submitButton.style.display = index === steps.length - 1 ? "block" : "none";
  }

  function validateStep(index) {
    const currentStep = steps[index];
    let isValid = true;

    // Validate select elements
    currentStep.querySelectorAll("select").forEach((select) => {
      if (select.closest("[required]") && !select.value) {
        isValid = false;
      }
    });

    // Validate input elements
    currentStep.querySelectorAll("input").forEach((input) => {
      const parent = input.closest("[required]");
      if (parent && !input.value) {
        isValid = false;
      }
      if (input.getAttribute("data-gtm-form-interact-field-id")) {
        isValid = true;
      }
    });

    // Validate radio buttons
    currentStep.querySelectorAll("ul.multi-container").forEach((ul) => {
      if (ul.querySelector('input[type="radio"]')) {
        if (!ul.querySelector('input[type="radio"]:checked')) {
          isValid = false;
        }
      }
    });

    // Validate required checkbox groups
    currentStep.querySelectorAll("ul.multi-container").forEach((ul) => {
      const checkboxes = ul.querySelectorAll('input[type="checkbox"]');
      // If any checkbox in the group is required
      if (Array.from(checkboxes).some((cb) => cb.required)) {
        // At least one must be checked
        if (!ul.querySelector('input[type="checkbox"]:checked')) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  function displayError(show) {
    errorMessage.style.display = show ? "block" : "none";
  }

  // Event listeners
  document.querySelector(".next").addEventListener("click", () => {
    if (validateStep(currentStep)) {
      displayError(false);
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    } else {
      displayError(true);
    }
  });

  document.querySelector(".previous").addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // Handle form submission
  hubspotForm.addEventListener("submit", function (e) {
    if (!validateStep(currentStep)) {
      e.preventDefault();
      displayError(true);
      return;
    }

    // Store form data in localStorage
    const formData = {};
    hubspotForm.querySelectorAll("input, select").forEach((input) => {
      if (input.name) {
        if (input.type === "radio") {
          if (input.checked) {
            formData[input.name] = input.value;
          }
        } else {
          formData[input.name] = input.value;
        }
      }
    });

    try {
      localStorage.setItem("hubspot_form_data", JSON.stringify(formData));
      console.log("MS Form - Stored form data in localStorage");
    } catch (error) {
      console.error("MS Form - Storage failed:", error);
    }
  });

  showStep(currentStep);

  // Show form and set email if available
  const hubspotFormContainer = document.querySelector(".hbspt-form");
  if (hubspotFormContainer) hubspotFormContainer.style.display = "block";

  const myEmail = localStorage.getItem("my_email");
  const emailInput = document.querySelector('input[type="email"]');
  if (emailInput && myEmail) emailInput.value = myEmail;
}

// Function to create and insert the image container
function addImageContainer(inputDiv) {
  const imageContainer = document.createElement("div");
  imageContainer.className = "image-container";

  const img = document.createElement("img");
  img.className = "select-image";
  img.src = "https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg";
  img.alt = "Image";

  imageContainer.appendChild(img);
  inputDiv.appendChild(imageContainer);
}

// Initialize form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Start checking for HubSpot form
  checkForHubSpotForm();
});

// Optimized form checker
function checkForHubSpotForm() {
  const hubspotForm = document.querySelector(".hbspt-form");
  const formContainer = document.querySelector(".right_step_form");

  // Show loader only once
  if (formContainer && !formContainer.querySelector(".loader")) {
    formContainer.classList.add("form-loading");
    const loader = document.createElement("span");
    loader.className = "loader";
    formContainer.appendChild(loader);

    // Hide the HubSpot form until it's ready
    if (hubspotForm) {
      hubspotForm.style.display = "none";
    }
  }

  if (!hubspotForm || !hubspotForm.querySelector("form")) {
    retryCount++;
    if (retryCount < MAX_RETRIES) {
      requestAnimationFrame(checkForHubSpotForm);
      return;
    }
    console.warn("HubSpot form not found or not fully loaded after maximum retries");
    if (formContainer) {
      formContainer.classList.remove("form-loading");
      const loader = formContainer.querySelector(".loader");
      if (loader) loader.remove();
    }
    return;
  }

  // Reset retry count for subsequent operations
  retryCount = 0;

  // Initialize form immediately when found
  initializeMultiStepForm();

  // Remove loader and show form once initialization is complete
  const loader = formContainer?.querySelector(".loader");
  if (loader) {
    loader.remove();
    formContainer.classList.remove("form-loading");
  }
  if (hubspotForm) {
    hubspotForm.style.display = "block";
  }

  // Add image containers to selects only if form is properly initialized
  const formSteps = document.querySelectorAll(".form-step .input select");
  if (formSteps.length) {
    formSteps.forEach((selectElement) => {
      if (selectElement && selectElement.parentElement) {
        addImageContainer(selectElement.parentElement);

        selectElement.addEventListener("change", (event) => {
          const img = selectElement.parentElement.querySelector(".select-image");
          if (!img) return;

          const selectedValue = event.target.value;
          img.src =
            selectedValue === "default" || selectedValue === ""
              ? "https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg"
              : "https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd131c9a0a6e9c7f805c3_Vector%202533.svg";
        });
      }
    });
  }
}

// Modify the window.initializeMultiStepFormOnReady function
window.initializeMultiStepFormOnReady = function () {
  console.log("MS Form - HubSpot form ready callback received");
  checkForHubSpotForm(); // Remove timeout and call directly
};
