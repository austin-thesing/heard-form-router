import { FormRouterConfig } from "./form-config.js";

// Function to determine which calendar to show based on business type
function determineCalendarType(formData) {
  const practiceSetup = (formData[FormRouterConfig.FORM_FIELDS.practiceSetup] || "").toLowerCase();
  const employeeCount = (formData[FormRouterConfig.FORM_FIELDS.employeeCount] || "").toLowerCase();

  // Check if it's an S-Corp or meets the employee criteria for S-Corp routing
  if (practiceSetup.includes("s corp") || ((practiceSetup.includes("llc") || practiceSetup.includes("pllc") || practiceSetup.includes("sole prop")) && (employeeCount.includes("less than 5") || employeeCount.includes("5-10")))) {
    return "S_CORP";
  }

  // Route to Sole Prop if it's a sole prop with no employees
  if (practiceSetup.includes("sole prop") && employeeCount.includes("no")) {
    return "SOLE_PROP";
  }

  // Default to Sole Proprietor for all other cases
  return "SOLE_PROP";
}

// Function to create the iframe modal
function createSchedulerModal(calendarType) {
  const calendar = FormRouterConfig.HUBSPOT_CALENDARS[calendarType];

  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.id = "scheduler-modal";
  modalContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 95%;
    max-width: 800px;
    height: 90vh;
    position: relative;
  `;

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
    padding: 5px 10px;
  `;
  closeButton.onclick = () => modalContainer.remove();

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = calendar.url;
  iframe.style.cssText = `
    width: 100%;
    height: calc(100% - 40px);
    border: none;
    margin-top: 20px;
  `;

  // Assemble modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(iframe);
  modalContainer.appendChild(modalContent);

  return modalContainer;
}

// Main initialization function
function initScheduler() {
  try {
    // Get form data from localStorage
    const formData = JSON.parse(localStorage.getItem("hubspot_form_data") || "{}");

    // Determine which calendar to show
    const calendarType = determineCalendarType(formData);

    // Create and show the modal
    const modal = createSchedulerModal(calendarType);
    document.body.appendChild(modal);

    // Clean up form data after successful scheduling
    window.addEventListener("message", (event) => {
      // Check if the message is from HubSpot and indicates a successful scheduling
      if (event.data.type === "CALENDAR_EVENT_SCHEDULED") {
        localStorage.removeItem("hubspot_form_data");
        modal.remove();
      }
    });
  } catch (error) {
    console.error("Error initializing scheduler:", error);
    // Redirect to homepage if there's an error
    window.location.href = "https://joinheard.com";
  }
}

// Guard and initialization logic
function initializeSchedulerWithGuard() {
  // Check if we're on the scheduler page
  if (window.location.pathname === "/thank-you/schedule") {
    try {
      const formData = localStorage.getItem("hubspot_form_data");

      // If no form data exists or it's invalid JSON, redirect
      if (!formData) {
        console.log("No form data found in localStorage, redirecting to homepage");
        window.location.href = "https://joinheard.com";
        throw new Error("No form data found");
      }

      // Try to parse the JSON to ensure it's valid
      try {
        JSON.parse(formData);
        // Initialize the scheduler if form data is valid
        initScheduler();
      } catch (e) {
        console.error("Invalid form data in localStorage:", e);
        window.location.href = "https://joinheard.com";
        throw new Error("Invalid form data");
      }

      console.log("Valid form data found, initializing scheduler");
    } catch (error) {
      console.error("Error checking form data:", error);
      // Redirect will have already happened if needed
    }
  }
}

// Initialize when the page loads
if (document.readyState === "complete") {
  initializeSchedulerWithGuard();
} else {
  window.addEventListener("load", initializeSchedulerWithGuard);
}

// Export for use in other files if needed
export { initScheduler, determineCalendarType, initializeSchedulerWithGuard };
