// Add this at the top of the file
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
`;

// Add this right after the CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = spinnerCSS;
document.head.appendChild(styleSheet);

// Function to initialize form
function initializeMultiStepForm() {
  const form = document.querySelector(".right_step_form form");
  if (!form) {
    // If form is not ready yet, show loading spinner if not already shown
    const formContainer = document.querySelector(".right_step_form");
    if (formContainer && !formContainer.querySelector(".loader")) {
      formContainer.classList.add("form-loading");
      const loader = document.createElement("span");
      loader.className = "loader";
      formContainer.appendChild(loader);
    }

    // Try again sooner (reduced from 100ms to 50ms)
    setTimeout(initializeMultiStepForm, 25);
    return;
  }

  // Remove loader when form is ready
  const formContainer = document.querySelector(".right_step_form");
  const loader = formContainer.querySelector(".loader");
  if (loader) {
    loader.remove();
    formContainer.classList.remove("form-loading");
  }

  // Show form immediately when found
  const hubspotForm = document.querySelector(".hbspt-form");
  if (hubspotForm) {
    hubspotForm.style.display = "block";
  }

  const fieldsets = Array.from(form.querySelectorAll(":scope > div"));

  // Create and wrap steps
  const createStep = (elements, stepNumber) => {
    const wrapper = document.createElement("div");
    wrapper.className = "form-step";
    wrapper.dataset.step = stepNumber;
    elements.forEach((el) => wrapper.appendChild(el));
    return wrapper;
  };

  // Group fieldsets into steps
  const firstTwo = createStep(fieldsets.slice(1, 3), "1");
  const nextThree = createStep(fieldsets.slice(3, 6), "2");
  const nextTwo = createStep(fieldsets.slice(6, 8), "3");
  const lastSix = createStep(fieldsets.slice(8, 14), "4");

  // Clear form and add wrapped steps
  while (form.firstChild) {
    form.removeChild(form.firstChild);
  }

  // Create step navigation
  const stepNav = document.createElement("div");
  stepNav.className = "step-nav";
  [1, 2, 3, 4].forEach((num) => {
    const span = document.createElement("span");
    span.className = "step-number";
    span.dataset.step = (num - 1).toString();
    span.textContent = num.toString();
    stepNav.appendChild(span);
  });

  // Add all elements to form
  form.appendChild(stepNav);
  form.appendChild(firstTwo);
  form.appendChild(nextThree);
  form.appendChild(nextTwo);
  form.appendChild(lastSix);

  // Create navigation buttons
  const formNavigation = document.createElement("div");
  formNavigation.className = "form-navigation";
  formNavigation.innerHTML = `
    <button type="button" class="previous button-secondary">Previous</button>
    <button type="button" class="next button-primary">Next</button>
    <button type="submit" class="submit button-primary">Submit</button>
  `;

  // Create error message
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.style.color = "red";
  errorMessage.style.display = "none";
  errorMessage.textContent = "Please fill out all required fields.";

  form.appendChild(formNavigation);
  form.appendChild(errorMessage);

  // Setup step functionality
  const steps = Array.from(document.querySelectorAll(".form-step"));
  const stepNumbers = Array.from(document.querySelectorAll(".step-number"));
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step) => step.classList.remove("active"));
    steps[index].classList.add("active");
    stepNumbers[index].classList.add("active");
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
      if (!ul.querySelector('input[type="radio"]:checked')) {
        isValid = false;
      }
    });

    return isValid;
  }

  function displayError(show) {
    const errorMessage = document.querySelector(".error-message");
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

  showStep(currentStep);

  // Show form and set email if available
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
  initializeMultiStepForm();

  // Add image containers to selects
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
});
