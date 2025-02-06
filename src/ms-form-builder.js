// Constants
const CHECK_INTERVAL = 20; // Lowered to 20ms for faster response time
const MAX_RETRIES = 150; // Increased to 150 (3 second total maximum wait time)
let retryCount = 0;

function initializeMultiStepForm() {
  // Cache DOM queries
  const formContainer = document.querySelector(".right_step_form");
  const form = formContainer?.querySelector("form");
  const hubspotForm = document.querySelector(".hbspt-form");

  // Early return if core elements aren't ready
  if (!form || !formContainer || !hubspotForm) {
    retryCount++;
    if (retryCount < MAX_RETRIES) {
      setTimeout(initializeMultiStepForm, CHECK_INTERVAL);
    } else {
      console.error("Failed to initialize form after maximum retries");
    }
    return;
  }

  // Start showing loader immediately when we have the container
  let loader = formContainer.querySelector(".loader");
  if (!loader) {
    loader = document.createElement("span");
    loader.className = "loader";
    formContainer.appendChild(loader);
    formContainer.classList.add("form-loading");
  }

  const fieldsets = Array.from(form.querySelectorAll(":scope > div"));
  if (fieldsets.length < 14) {
    retryCount++;
    if (retryCount < MAX_RETRIES) {
      setTimeout(initializeMultiStepForm, CHECK_INTERVAL);
    } else {
      console.error("Failed to load all form fields after maximum retries");
    }
    return;
  }

  // Reset retry count since we succeeded
  retryCount = 0;

  // Now we can safely initialize the form
  const createStep = (elements, stepNumber) => {
    const wrapper = document.createElement("div");
    wrapper.className = "form-step";
    wrapper.dataset.step = stepNumber;
    elements.forEach((el) => wrapper.appendChild(el));
    return wrapper;
  };

  // Create title element that stays visible throughout
  const formTitle = document.createElement("div");
  formTitle.className = "hs-richtext hs-main-font-element";
  formTitle.innerHTML = '<h3 style="text-align: center;">Book a free consult</h3>';

  // Create navigation elements
  const stepNav = document.createElement("div");
  stepNav.className = "step-nav";
  const navHTML = [1, 2, 3, 4].map((num) => `<span class="step-number" data-step="${num - 1}">${num}</span>`).join("");
  stepNav.innerHTML = navHTML;

  // Build form navigation
  const formNavigation = document.createElement("div");
  formNavigation.className = "form-navigation";
  formNavigation.innerHTML = `
    <button type="button" class="previous button-secondary">Previous</button>
    <button type="button" class="next button-primary">Next</button>
    <button type="submit" class="submit button-primary">Submit</button>
  `;

  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.style.color = "red";
  errorMessage.style.display = "none";
  errorMessage.textContent = "Please fill out all required fields.";

  // Create all steps at once to minimize reflows
  const steps = [createStep(fieldsets.slice(1, 3), "1"), createStep(fieldsets.slice(3, 6), "2"), createStep(fieldsets.slice(6, 8), "3"), createStep(fieldsets.slice(8, 14), "4")];

  // Clear and rebuild form in one operation
  const fragment = document.createDocumentFragment();
  fragment.appendChild(stepNav); // Add step navigation first
  fragment.appendChild(formTitle); // Add title second
  steps.forEach((step) => fragment.appendChild(step));
  fragment.appendChild(formNavigation);
  fragment.appendChild(errorMessage);

  while (form.firstChild) {
    form.removeChild(form.firstChild);
  }
  form.appendChild(fragment);

  // Cache step elements after adding to DOM
  const stepElements = Array.from(document.querySelectorAll(".form-step"));
  const stepNumbers = Array.from(document.querySelectorAll(".step-number"));
  let currentStep = 0;

  function showStep(index) {
    stepElements.forEach((step) => step.classList.remove("active"));
    stepElements[index].classList.add("active");
    stepNumbers[index].classList.add("active");
    updateButtons(index);
  }

  function validateStep(index) {
    const currentStep = stepElements[index];
    const requiredSelects = currentStep.querySelectorAll("select:required");
    const requiredInputs = currentStep.querySelectorAll("input:required");
    const multiContainers = currentStep.querySelectorAll("ul.multi-container");

    // Check selects
    for (const select of requiredSelects) {
      if (!select.value) return false;
    }

    // Check inputs
    for (const input of requiredInputs) {
      if (!input.value && !input.getAttribute("data-gtm-form-interact-field-id")) {
        return false;
      }
    }

    // Check radio groups
    for (const container of multiContainers) {
      if (!container.querySelector('input[type="radio"]:checked')) {
        return false;
      }
    }

    return true;
  }

  // Cache navigation buttons
  const prevButton = document.querySelector(".previous");
  const nextButton = document.querySelector(".next");
  const submitButton = document.querySelector(".submit");
  const errorMessageElement = document.querySelector(".error-message");

  function displayError(show) {
    errorMessageElement.style.display = show ? "block" : "none";
  }

  function updateButtons(index) {
    prevButton.style.display = index === 0 ? "none" : "block";
    nextButton.style.display = index === stepElements.length - 1 ? "none" : "block";
    submitButton.style.display = index === stepElements.length - 1 ? "block" : "none";
  }

  // Event handlers
  nextButton.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      displayError(false);
      if (currentStep < stepElements.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    } else {
      displayError(true);
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
      displayError(false);
    }
  });

  // Initialize first step
  showStep(currentStep);

  // Set email if available
  const myEmail = localStorage.getItem("my_email");
  const emailInput = document.querySelector('input[type="email"]');
  if (emailInput && myEmail) emailInput.value = myEmail;

  // Now that everything is initialized, remove loader and show form
  loader.remove();
  formContainer.classList.remove("form-loading");
  hubspotForm.style.display = "block";
}

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

function checkForHubSpotForm() {
  const hubspotForm = document.querySelector(".hbspt-form");
  if (!hubspotForm) {
    setTimeout(checkForHubSpotForm, CHECK_INTERVAL);
    return;
  }

  const formContainer = document.querySelector(".right_step_form");
  if (formContainer && !formContainer.querySelector(".loader")) {
    formContainer.classList.add("form-loading");
    const loader = document.createElement("span");
    loader.className = "loader";
    formContainer.appendChild(loader);
  }

  initializeMultiStepForm();

  document.querySelectorAll(".form-step .input select").forEach((selectElement) => {
    addImageContainer(selectElement.parentElement);

    selectElement.addEventListener("change", (event) => {
      const img = selectElement.parentElement.querySelector(".select-image");
      const selectedValue = event.target.value;
      img.src =
        selectedValue === "default" || selectedValue === ""
          ? "https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd1273be99e0d3b8c9cde_%5E.svg"
          : "https://uploads-ssl.webflow.com/6661826b05a68c92d1e4be41/667dd131c9a0a6e9c7f805c3_Vector%202533.svg";
    });
  });
}

checkForHubSpotForm();
