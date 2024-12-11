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
    } catch (e) {
      console.error("Invalid form data in localStorage:", e);
      window.location.href = "https://joinheard.com";
      throw new Error("Invalid form data");
    }

    console.log("Valid form data found, allowing access to scheduler");
  } catch (error) {
    console.error("Error checking form data:", error);
    // Redirect will have already happened if needed
  }
}
