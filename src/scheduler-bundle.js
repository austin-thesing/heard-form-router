import { FormRouterConfig } from "./form-config.js";

// Function to determine which calendar to show based on business type
function determineCalendarType(formData) {
  // Check if form data exists and has required fields
  if (!formData || typeof formData !== "object") {
    console.error("Form data is missing or invalid");
    window.location.href = "https://joinheard.com";
    return null;
  }

  const practiceSetup = (formData[FormRouterConfig.FORM_FIELDS.practiceSetup] || "").toLowerCase();
  const employeeCount = (formData[FormRouterConfig.FORM_FIELDS.employeeCount] || "").toLowerCase();

  // Validate required fields are present
  if (!practiceSetup || !employeeCount) {
    console.error("Required form fields are missing", { practiceSetup, employeeCount });
    window.location.href = "https://joinheard.com/welcome-form";
    return null;
  }

  // Check if it's an S-Corp or meets the employee criteria for S-Corp routing
  const isScorp = practiceSetup.includes("s corp");
  const isLLCorSoleProp = practiceSetup.includes("llc") || practiceSetup.includes("pllc") || practiceSetup.includes("sole prop");
  const hasSmallTeam = employeeCount.includes("less than 5") || employeeCount.includes("5-10");

  if (isScorp || (isLLCorSoleProp && hasSmallTeam)) {
    return "S_CORP";
  }

  // Route to Sole Prop if it's a sole prop with no employees
  const isSoleProp = practiceSetup.includes("sole prop");
  const hasNoEmployees = employeeCount.includes("no");

  if (isSoleProp && hasNoEmployees) {
    return "SOLE_PROP";
  }

  // Default to Sole Proprietor for all other cases
  return "SOLE_PROP";
}

// Function to create the calendar container
function createSchedulerModal(calendarType) {
  const calendar = FormRouterConfig.HUBSPOT_CALENDARS[calendarType];

  // Create container
  const container = document.createElement("div");
  container.id = "scheduler-container";
  container.style.cssText = `
    width: 100%;
    max-width: 800px;
    height: 90vh;
    margin: 20px auto;
    background: white;
    border-radius: 8px;
    padding: 20px;
  `;

  // Create title
  const title = document.createElement("h2");
  title.textContent = calendar.title;
  title.style.cssText = `
    margin-bottom: 20px;
    text-align: center;
    color: #226752;
    font-size: 24px;
  `;

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = calendar.url;
  iframe.style.cssText = `
    width: 100%;
    height: calc(100% - 60px);
    border: none;
  `;

  // Assemble container
  container.appendChild(title);
  container.appendChild(iframe);

  return container;
}

// Main initialization function
function initScheduler() {
  try {
    // Get form data from localStorage
    const formData = JSON.parse(localStorage.getItem("hubspot_form_data") || "{}");

    // Determine which calendar to show
    const calendarType = determineCalendarType(formData);

    // If calendarType is null, the determineCalendarType function will have already redirected
    if (calendarType === null) {
      return;
    }

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

// // Export for use in other files if needed
// export { initScheduler, determineCalendarType, initializeSchedulerWithGuard };
