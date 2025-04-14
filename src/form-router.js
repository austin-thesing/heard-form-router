import { FormRouterConfig } from "./form-config.js";

// Initialize HubSpot form handler
function initializeForm() {
  console.log("Form Router - Initializing form handler");
  // Create the form immediately, but verify config before handling submissions
  window.hbspt.forms.create({
    region: "na1",
    portalId: "7507639",
    formId: "0d9c387a-9c8b-40c4-8d46-3135f754f077",
    target: "#hubspot-form-container",
    onFormReady: function ($form) {
      console.log("Form Router - Form Ready");
      console.log("Form Router - Config loaded:", !!FormRouterConfig);

      // Add change event listeners to form fields
      console.log("Form Router - Adding field tracking");
      $form.find("input, select, textarea").each(function () {
        $(this).on("change", function () {
          console.log("Form Router - Field Changed:", {
            name: this.name,
            value: this.value,
            type: this.type || "textarea",
          });
        });
      });
    },
    onFormSubmit: function ($form, data) {
      // Verify config is available before proceeding
      if (!FormRouterConfig) {
        console.error("Form Router - FormRouterConfig not found - ensure form-config.js is loaded");
        return false;
      }

      console.log("Form Router - Starting submission process");
      console.log("Form Router - Raw HubSpot data:", data);
      const formDataObj = {};

      // Use the HubSpot data directly
      if (data && Array.isArray(data)) {
        console.log(
          "Form Router - Income field in raw data:",
          data.find((field) => field.name === FormRouterConfig.FORM_FIELDS.income)
        );
        data.forEach((field) => {
          const value = field.value;
          const key = field.name;
          console.log("Form Router - Processing field:", { key, value });
          // Ensure consistent field value handling
          if (key === FormRouterConfig.FORM_FIELDS.employeeCount || key === FormRouterConfig.FORM_FIELDS.practiceRunning) {
            formDataObj[key] = value.toLowerCase().trim();
          } else {
            formDataObj[key] = value;
          }
        });
      } else {
        console.error("Form Router - No data received from HubSpot or invalid format:", data);
      }

      try {
        console.log("Form Router - Final form data object before storage:", formDataObj);
        localStorage.setItem("hubspot_form_data", JSON.stringify(formDataObj));
        console.log("Form Router - Stored form data:", formDataObj);
      } catch (error) {
        console.error("Form Router - Storage failed:", error);
      }

      return true;
    },
    onFormSubmitted: function ($form) {
      // Verify config is available before proceeding
      if (!FormRouterConfig) {
        console.error("Form Router - FormRouterConfig not found during submission - ensure form-config.js is loaded");
        return false;
      }

      console.log("Form Router - Processing submission");
      handleRedirect();
      return false;
    },
    onFormSubmitError: function ($form, error) {
      console.error("Form Router - HubSpot form submission error:", error, Object.fromEntries(new FormData($form)));
    },
  });
}

// Helper function to get cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null; // Return null if cookie not found
}

// Form routing logic
function determineRoute(formData) {
  return FormRouterConfig.determineRoute(formData);
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
    console.log("Form Router - Retrieved form data:", formData);
    console.log("Form Router - Income field value:", formData.income);
    console.log("Form Router - Income field type:", typeof formData.income);

    // Log each DQ condition check
    const multiOwner = (formData[FormRouterConfig.FORM_FIELDS.multiOwner] || "").toLowerCase();
    const state = (formData[FormRouterConfig.FORM_FIELDS.state] || "").toLowerCase();
    const practiceSetup = (formData[FormRouterConfig.FORM_FIELDS.practiceSetup] || "").toLowerCase();
    const income = (formData[FormRouterConfig.FORM_FIELDS.income] || "").toLowerCase();
    const practiceRunning = (formData[FormRouterConfig.FORM_FIELDS.practiceRunning] || "").toLowerCase();
    const profession = (formData[FormRouterConfig.FORM_FIELDS.profession] || "").toLowerCase();
    const employeeCount = (formData[FormRouterConfig.FORM_FIELDS.employeeCount] || "").toLowerCase();

    console.log("Form Router - DQ Condition Checks:", {
      multiOwner: {
        value: multiOwner,
        isDQ: FormRouterConfig.DISQUALIFYING_CONDITIONS.multiOwner.includes(multiOwner),
        dqValues: FormRouterConfig.DISQUALIFYING_CONDITIONS.multiOwner,
      },
      state: {
        value: state,
        isDQ: FormRouterConfig.DISQUALIFYING_CONDITIONS.state.includes(state),
        dqValues: FormRouterConfig.DISQUALIFYING_CONDITIONS.state,
      },
      practiceSetup: {
        value: practiceSetup,
        isDQ: FormRouterConfig.DISQUALIFYING_CONDITIONS.practiceSetup.includes(practiceSetup),
        dqValues: FormRouterConfig.DISQUALIFYING_CONDITIONS.practiceSetup,
      },
      income: {
        value: income,
        isDQ: FormRouterConfig.DISQUALIFYING_CONDITIONS.income.includes(income),
        dqValues: FormRouterConfig.DISQUALIFYING_CONDITIONS.income,
      },
      profession: {
        value: profession,
        isDQ: FormRouterConfig.DISQUALIFYING_CONDITIONS.profession.some((p) => profession.includes(p)),
        dqValues: FormRouterConfig.DISQUALIFYING_CONDITIONS.profession,
      },
      practiceRunning: {
        value: practiceRunning,
        isDQ: FormRouterConfig.DISQUALIFYING_CONDITIONS.practiceRunning.includes(practiceRunning),
        dqValues: FormRouterConfig.DISQUALIFYING_CONDITIONS.practiceRunning,
      },
      employeeCount: {
        value: employeeCount,
        isDQ: FormRouterConfig.DISQUALIFYING_CONDITIONS.employeeCount.includes(employeeCount),
        dqValues: FormRouterConfig.DISQUALIFYING_CONDITIONS.employeeCount,
      },
    });

    const route = determineRoute(formData);
    console.log("Form Router - Determined route:", route);

    let finalUrl = FormRouterConfig.LANDING_PAGES[route] || FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
    console.log("Form Router - Base URL:", finalUrl);

    // Get the HubSpot User Token (hutk)
    const hutk = getCookie("hubspotutk");
    console.log("Form Router - Retrieved hutk:", hutk);

    if (hutk) {
      // Append hutk to the final URL
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl += `${separator}hubspotUtk=${hutk}`;
      console.log("Form Router - Appended hutk to URL:", finalUrl);
    } else {
      console.warn("Form Router - hubspotutk cookie not found. Cannot append to URL.");
    }

    // Ensure window.FormRouterConfig exists
    if (!FormRouterConfig) {
      console.error("Form Router - FormRouterConfig not found - form-config.js may not be loaded");
      return;
    }

    setTimeout(() => {
      console.log("Form Router - Executing redirect to:", finalUrl);
      window.location.href = finalUrl;
    }, 700);
  } catch (error) {
    console.error("Form Router - Redirect failed:", error);
    // Fallback to NOT_QUALIFIED if something goes wrong
    let fallbackUrl = FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED;
    const hutkFallback = getCookie("hubspotutk"); // Use a different variable name to avoid conflict
    if (hutkFallback) {
      const separator = fallbackUrl.includes("?") ? "&" : "?";
      fallbackUrl += `${separator}hubspotUtk=${hutkFallback}`;
      console.log("Form Router - Appended hutk to fallback URL:", fallbackUrl);
    }
    window.location.href = fallbackUrl;
  }
}
