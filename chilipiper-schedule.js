var cpTenantDomain = "joinheard";
var cpRouterName = "inbound-router";
var lead;

// Get lead data from localStorage that was set during form submission
function getLeadData() {
  try {
    const storedData = localStorage.getItem("hubspot_form_data");
    if (!storedData) {
      console.warn("No lead data found in localStorage");
      return null;
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing lead data:", error);
    return null;
  }
}

// Initialize ChiliPiper when the page loads
function initChiliPiper() {
  lead = getLeadData();
  if (!lead) {
    console.error("No lead data available for ChiliPiper");
    return;
  }

  // Map the form data to ChiliPiper expected format using the actual field names
  const mappedLead = {
    firstName: lead.firstname || "",
    lastName: lead.lastname || "",
    email: lead.email || "",
    phone: lead.mobile_phone_number || "",
    state: lead.state || "",
    practiceType: lead.what_best_describes_your_practice_ || "",
    annualIncome: lead.what_is_your_expected_annual_income_for_2024___1099__private_practice_ || "",
    practiceSetup: lead.how_is_your_business_setup__v2 || "",
    practiceLength: lead.how_long_have_you_been_running_your_private_practice_ || "",
    multiOwner: lead.is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_ || "",
    businessEmail: lead.business_email_address || "",
    referralSource: lead.where_did_you_hear_about_heard_ || "",
  };

  console.log("Launching ChiliPiper with lead data:", mappedLead);

  // Launch ChiliPiper scheduler
  ChiliPiper.submit(cpTenantDomain, cpRouterName, {
    map: true,
    lead: mappedLead,
    injectRootCss: true,
    title: "Schedule a Call",
    onSuccess: function () {
      console.log("ChiliPiper scheduling succeeded");
      // Clear the stored form data after successful scheduling
      localStorage.removeItem("hubspot_form_data");
    },
    onError: function (error) {
      console.error("ChiliPiper scheduling failed:", error);
    },
  });
}

// Wait for ChiliPiper to be ready
function waitForChiliPiper() {
  if (window.ChiliPiper) {
    initChiliPiper();
  } else {
    console.log("Waiting for ChiliPiper to load...");
    setTimeout(waitForChiliPiper, 100);
  }
}

// Start the process when the page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded, initializing ChiliPiper...");
  waitForChiliPiper();
});
