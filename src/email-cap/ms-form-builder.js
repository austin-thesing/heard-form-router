(() => {
  // Styles
  const styles = `
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
  }`;

  // Add styles to document
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  // Constants
  const RETRY_DELAY = 100;
  const MAX_RETRIES = 50;
  let retryCount = 0;

  // Main form initialization
  function initializeForm() {
    const form = document.querySelector(".hbspt-form form");
    if (!form) {
      if ((console.warn("HubSpot form not found, retrying..."), retryCount < MAX_RETRIES)) {
        retryCount++;
        setTimeout(initializeForm, RETRY_DELAY);
      }
      return;
    }

    let isSubmitted = false;
    let emailValue = null;
    let isPartialSubmitted = false;

    // Email capture logic
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener("change", function (event) {
        const value = event.target.value;
        if (value && value.includes("@")) {
          emailValue = value;
          const hiddenEmailInput = document.querySelector('.hidden-form input[type="email"]');
          if (hiddenEmailInput) hiddenEmailInput.value = value;
        }
      });
    }

    form.addEventListener("submit", function () {
      isSubmitted = true;
    });

    function submitPartialForm() {
      if (!isSubmitted && !isPartialSubmitted && emailValue) {
        const hiddenForm = document.querySelector(".hidden-form");
        if (hiddenForm) {
          const formData = new FormData(hiddenForm);
          const action = hiddenForm.getAttribute("action");
          fetch(action, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" },
          })
            .then((response) => {
              if (response.ok) {
                isPartialSubmitted = true;
                console.log("Submitted partial email:", emailValue);
              }
            })
            .catch((error) => {
              console.error("Error submitting partial email:", error);
            });
        }
      }
    }

    // Partial form submission triggers
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") submitPartialForm();
    });

    window.addEventListener("beforeunload", function () {
      submitPartialForm();
    });

    // Form setup
    const formFields = Array.from(form.querySelectorAll(".hs-form-field:not(.hs_submit):not(.hs_recaptcha):not(.hs_error_rollup)"));
    const titleElement = form.querySelector(".hs-richtext h3");
    if (titleElement) titleElement.remove();

    const consentContainer = form.querySelector(".legal-consent-container");
    const richText = form.querySelector(".hs-richtext:not(:has(h3))");
    if (richText) richText.remove();
    if (consentContainer) consentContainer.remove();

    // Remove existing navigation elements
    form.querySelectorAll(".step-nav, .form-step, .form-navigation, .error-message").forEach((el) => el.remove());

    // Create form header
    const formHeader = document.createElement("div");
    formHeader.className = "form-header";
    const stepNav = document.createElement("div");
    stepNav.className = "step-nav";

    [1, 2, 3, 4].forEach((num) => {
      const step = document.createElement("span");
      step.className = num === 1 ? "step-number active" : "step-number";
      step.dataset.step = (num - 1).toString();
      step.textContent = num.toString();
      stepNav.appendChild(step);
    });

    formHeader.appendChild(stepNav);

    if (titleElement) {
      const titleWrapper = document.createElement("div");
      titleWrapper.className = "hubspot-title-wrapper";
      titleWrapper.appendChild(titleElement);
      formHeader.appendChild(titleWrapper);
    }

    form.insertBefore(formHeader, form.firstChild);

    // Create form steps
    const step1Fields = formFields.slice(0, 2);
    const step2Fields = formFields.slice(2, 5);
    const step3Fields = formFields.slice(5, 8);
    const step4Fields = formFields.slice(8);

    const formSteps = [
      { fields: step1Fields, num: 1 },
      { fields: step2Fields, num: 2 },
      { fields: step3Fields, num: 3 },
      { fields: step4Fields, num: 4 },
    ].map(({ fields, num }) => {
      if (!fields.length) {
        console.warn(`No fields for step ${num}`);
        return null;
      }

      const stepElement = document.createElement("div");
      stepElement.className = num === 1 ? "form-step active" : "form-step";
      stepElement.dataset.step = num.toString();

      fields.forEach((field) => {
        if (field && field.parentNode) stepElement.appendChild(field);
      });

      if (num === 4 && consentContainer) {
        const consentWrapper = document.createElement("div");
        consentWrapper.className = "consent-wrapper";
        if (consentContainer) consentWrapper.appendChild(consentContainer);

        const privacyText = document.createElement("div");
        privacyText.className = "privacy-text";
        privacyText.textContent =
          "Heard is committed to protecting and respecting your privacy, and we'll only use your personal information to administer your account and to provide the services you requested from us. By clicking submit on the form below, you consent to allow Heard to send SMS meeting reminders as well as store and process the personal information submitted above to provide you with the content requested.";
        consentWrapper.appendChild(privacyText);
        stepElement.appendChild(consentWrapper);
      }

      const submitButton = form.querySelector(".hs_submit");
      form.insertBefore(stepElement, submitButton);
      return stepElement;
    });

    if (formSteps.some((step) => !step)) {
      console.error("Failed to create all form steps");
      return;
    }

    // Create navigation
    const navigation = document.createElement("div");
    navigation.className = "form-navigation";
    navigation.innerHTML = `
      <button type="button" class="previous button-secondary">Previous</button>
      <button type="button" class="next button-primary">Next</button>
      <button type="submit" class="submit button-primary">Submit</button>
    `;

    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.style.display = "none";
    errorMessage.textContent = "Please fill out all required fields.";

    form.appendChild(navigation);
    form.appendChild(errorMessage);

    // Navigation state
    let currentStep = 0;
    const stepNumbers = document.querySelectorAll(".step-nav .step-number");

    function updateStep(step) {
      document.querySelectorAll(".form-step").forEach((el, index) => {
        el.classList.toggle("active", index === step);
      });
      stepNumbers.forEach((el, index) => {
        el.classList.toggle("active", index <= step);
      });
      updateNavigation(step);
    }

    function updateNavigation(step) {
      const prevButton = document.querySelector(".previous");
      const nextButton = document.querySelector(".next");
      const submitButton = document.querySelector(".submit");

      prevButton.style.display = step === 0 ? "none" : "block";
      nextButton.style.display = step === formSteps.length - 1 ? "none" : "block";
      submitButton.style.display = step === formSteps.length - 1 ? "block" : "none";
    }

    function validateStep(step) {
      const stepElement = formSteps[step];
      let isValid = true;

      stepElement.querySelectorAll("select").forEach((select) => {
        if (select.closest("[required]") && !select.value) isValid = false;
      });

      stepElement.querySelectorAll("input").forEach((input) => {
        if (input.closest("[required]") && !input.value) isValid = false;
        if (input.getAttribute("data-gtm-form-interact-field-id")) isValid = true;
      });

      stepElement.querySelectorAll("ul.multi-container").forEach((container) => {
        if (container.querySelector('input[type="radio"]')) {
          if (!container.querySelector('input[type="radio"]:checked')) isValid = false;
        }
      });

      stepElement.querySelectorAll("ul.multi-container").forEach((container) => {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        if (Array.from(checkboxes).some((cb) => cb.required)) {
          if (!container.querySelector('input[type="checkbox"]:checked')) isValid = false;
        }
      });

      return isValid;
    }

    function toggleError(show) {
      errorMessage.style.display = show ? "block" : "none";
    }

    // Event listeners
    document.querySelector(".next").addEventListener("click", () => {
      if (validateStep(currentStep)) {
        toggleError(false);
        if (currentStep < formSteps.length - 1) {
          currentStep++;
          updateStep(currentStep);
        }
      } else {
        toggleError(true);
      }
    });

    document.querySelector(".previous").addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        updateStep(currentStep);
      }
    });

    // Form submission
    form.addEventListener("submit", function (event) {
      if (!validateStep(currentStep)) {
        event.preventDefault();
        toggleError(true);
        return;
      }

      const formData = {};
      form.querySelectorAll("input, select").forEach((input) => {
        if (input.name) {
          if (input.type === "radio") {
            if (input.checked) formData[input.name] = input.value;
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

    updateStep(currentStep);

    const formContainer = document.querySelector(".hbspt-form");
    if (formContainer) formContainer.style.display = "block";

    const savedEmail = localStorage.getItem("my_email");
    const emailField = document.querySelector('input[type="email"]');
    if (emailField && savedEmail) emailField.value = savedEmail;
  }

  // Add select image
  function addSelectImage(container) {
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";
    const image = document.createElement("img");
    image.className = "select-image";
    image.src = "https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg";
    image.alt = "Image";
    imageContainer.appendChild(image);
    container.appendChild(imageContainer);
  }

  // Initialize on DOM load
  document.addEventListener("DOMContentLoaded", () => {
    initializeFormWithLoader();
  });

  function initializeFormWithLoader() {
    const formContainer = document.querySelector(".hbspt-form");
    const formWrapper = document.querySelector(".right_step_form");

    if (formWrapper && !formWrapper.querySelector(".loader")) {
      formWrapper.classList.add("form-loading");
      const loader = document.createElement("span");
      if (((loader.className = "loader"), formWrapper.appendChild(loader), formContainer)) {
        formContainer.style.display = "none";
      }
    }

    if (!formContainer || !formContainer.querySelector("form")) {
      if ((retryCount++, retryCount < MAX_RETRIES)) {
        requestAnimationFrame(initializeFormWithLoader);
        return;
      }
      if ((console.warn("HubSpot form not found or not fully loaded after maximum retries"), formWrapper)) {
        formWrapper.classList.remove("form-loading");
        const loader = formWrapper.querySelector(".loader");
        if (loader) loader.remove();
      }
      return;
    }

    retryCount = 0;
    initializeForm();

    const loader = formWrapper?.querySelector(".loader");
    if (loader) {
      loader.remove();
      formWrapper.classList.remove("form-loading");
    }

    if (formContainer) formContainer.style.display = "block";

    const selects = document.querySelectorAll(".form-step .input select");
    if (selects.length) {
      selects.forEach((select) => {
        if (select && select.parentElement) {
          addSelectImage(select.parentElement);
          select.addEventListener("change", (event) => {
            const image = select.parentElement.querySelector(".select-image");
            if (!image) return;
            const value = event.target.value;
            image.src =
              value === "default" || value === "" ? "https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg" : "https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd131c9a0a6e9c7f805c3_Vector%202533.svg";
          });
        }
      });
    }
  }

  // Global initialization function
  window.initializeMultiStepFormOnReady = function () {
    console.log("MS Form - HubSpot form ready callback received");
    initializeFormWithLoader();
  };
})();
