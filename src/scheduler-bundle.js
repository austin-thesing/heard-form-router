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

  console.log("Form data detected:", {
    practiceSetup,
    employeeCount,
  });

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

  console.log("Business type analysis:", {
    isScorp,
    isLLCorSoleProp,
    hasSmallTeam,
    practiceSetup,
    employeeCount,
  });

  if (isScorp || (isLLCorSoleProp && hasSmallTeam)) {
    console.log("Routing to S_CORP calendar due to:", {
      reason: isScorp ? "S Corp detected" : "LLC/Sole Prop with small team",
    });
    return "S_CORP";
  }

  // Route to Sole Prop if it's a sole prop with no employees
  const isSoleProp = practiceSetup.includes("sole prop");
  const hasNoEmployees = employeeCount.includes("no");

  if (isSoleProp && hasNoEmployees) {
    console.log("Routing to SOLE_PROP calendar due to sole proprietorship with no employees");
    return "SOLE_PROP";
  }

  // Default to Sole Proprietor for all other cases
  console.log("Routing to SOLE_PROP calendar as default case");
  return "SOLE_PROP";
}

// Helper function to get cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Function to create the calendar container
function createSchedulerModal(calendarType) {
  const calendar = FormRouterConfig.HUBSPOT_CALENDARS[calendarType];

  console.log("Creating scheduler modal:", {
    calendarType,
    calendarTitle: calendar.title,
    calendarUrl: calendar.url,
  });

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
  let iframeUrl = calendar.url;
  const hutk = getCookie("hubspotutk");
  if (hutk) {
    const separator = iframeUrl.includes("?") ? "&" : "?";
    iframeUrl += `${separator}hubspotutk=${encodeURIComponent(hutk)}`;
    console.log("Appended hubspotutk to iframe URL:", iframeUrl);
  }
  iframe.src = iframeUrl;
  iframe.style.cssText = `
    width: 100%;
    height: calc(100% - 60px);
    border: none;
  `;

  // Inject HubSpot Meetings script if not already present
  if (!document.querySelector('script[src*="MeetingsEmbedCode.js"]')) {
    const hubspotScript = document.createElement("script");
    hubspotScript.type = "text/javascript";
    hubspotScript.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    hubspotScript.async = true;
    console.log("Injecting HubSpot Meetings script");
    document.head.appendChild(hubspotScript);
  } else {
    console.log("HubSpot Meetings script already present");
  }

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

    console.log("Initializing scheduler with stored form data:", {
      hasFormData: !!localStorage.getItem("hubspot_form_data"),
      formDataKeys: Object.keys(formData),
    });

    // Determine which calendar to show
    const calendarType = determineCalendarType(formData);

    // If calendarType is null, the determineCalendarType function will have already redirected
    if (calendarType === null) {
      console.log("Calendar type is null, redirecting has occurred");
      return;
    }

    // Create and show the modal
    const modal = createSchedulerModal(calendarType);
    document.body.appendChild(modal);
    console.log("Scheduler modal successfully mounted to DOM");

    // Clean up form data after successful scheduling
    window.addEventListener("message", (event) => {
      // Check if the message is from HubSpot and indicates a successful scheduling
      if (event.data.type === "CALENDAR_EVENT_SCHEDULED") {
        console.log("Calendar event successfully scheduled, cleaning up form data");
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
  console.log("Starting scheduler initialization guard checks");

  // Check if we're on the scheduler page
  if (window.location.pathname === "/thank-you/schedule") {
    try {
      const formData = localStorage.getItem("hubspot_form_data");
      console.log("Checking localStorage for form data:", {
        formDataExists: !!formData,
        formDataLength: formData?.length || 0,
      });

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
