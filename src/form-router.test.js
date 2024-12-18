// Import configs and routers
require("./form-config.js");

// Store FormRouterConfig in the window mock
window.FormRouterConfig = window.FormRouterConfig;

// Test cases for routing logic
const routingTestCases = [
  {
    name: "Should route to NOT_QUALIFIED when multiOwner is 'yes'",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "yes",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "therapist",
    },
    expectedRoute: "NOT_QUALIFIED",
  },
  {
    name: "Should route to NOT_QUALIFIED when state is 'international'",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "international",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "therapist",
    },
    expectedRoute: "NOT_QUALIFIED",
  },
  // Test each disqualified profession
  {
    name: "Should route to NOT_QUALIFIED when profession is 'dietician'",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "dietician",
    },
    expectedRoute: "NOT_QUALIFIED",
  },
  {
    name: "Should route to NOT_QUALIFIED when profession is 'nutritionist'",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "nutritionist",
    },
    expectedRoute: "NOT_QUALIFIED",
  },
  {
    name: "Should route to NOT_QUALIFIED when profession is 'massage therapist'",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "massage therapist",
    },
    expectedRoute: "NOT_QUALIFIED",
  },
  {
    name: "Should route to NOT_QUALIFIED when profession is 'physical therapist'",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "physical therapist",
    },
    expectedRoute: "NOT_QUALIFIED",
  },
  {
    name: "Should route to NOT_QUALIFIED when profession is 'dietician or nutritionist'",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "dietician or nutritionist",
    },
    expectedRoute: "NOT_QUALIFIED",
  },
  {
    name: "Should route to NOT_QUALIFIED when profession is 'dietetics or nutrition counseling'",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "dietetics or nutrition counseling",
    },
    expectedRoute: "NOT_QUALIFIED",
  },
  {
    name: "Should route to SCHEDULER for high income ($50,000 - $99,999) with valid profession",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "therapist",
    },
    expectedRoute: "SCHEDULER",
  },
  {
    name: "Should route to FREE_TRIAL for mid income ($20,000 - $49,999) with valid profession",
    formData: {
      is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
      state: "california",
      how_is_your_business_setup__v2: "llc",
      what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$20,000 - $49,999",
      how_long_have_you_been_running_your_private_practice_: "1-3 years",
      what_best_describes_your_practice_: "therapist",
    },
    expectedRoute: "FREE_TRIAL",
  },
];

describe("Form Router Tests", () => {
  beforeEach(() => {
    // Clear mocks and storage before each test
    localStorage.clear();
    window.location.href = "";
    jest.clearAllMocks();
  });

  describe("Routing Logic", () => {
    test.each(routingTestCases)("$name", ({ formData, expectedRoute }) => {
      const actualRoute = window.FormRouterConfig.determineRoute(formData);
      expect(actualRoute).toBe(expectedRoute);
    });
  });

  describe("Form Data Processing", () => {
    test("Standard form should process data and determine correct route", () => {
      const formData = {
        is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "no",
        state: "california",
        how_is_your_business_setup__v2: "llc",
        what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
        how_long_have_you_been_running_your_private_practice_: "1-3 years",
        what_best_describes_your_practice_: "therapist",
      };

      // Store form data
      localStorage.setItem("hubspot_form_data", JSON.stringify(formData));

      // Get the route that would be used
      const route = window.FormRouterConfig.determineRoute(formData);
      expect(route).toBe("SCHEDULER");
    });

    test("Multi-step form should process data and determine correct route", () => {
      const formData = {
        is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_: "yes",
        state: "california",
        how_is_your_business_setup__v2: "llc",
        what_is_your_expected_annual_income_for_2024___1099__private_practice_: "$50,000 - $99,999",
        how_long_have_you_been_running_your_private_practice_: "1-3 years",
        what_best_describes_your_practice_: "therapist",
      };

      // Mock the form data processing that would happen in the event handler
      const processedData = Object.entries(formData).map(([name, value]) => ({ name, value }));
      const formDataObj = {};
      processedData.forEach(({ name, value }) => {
        formDataObj[name] = value;
      });
      localStorage.setItem("hubspot_form_data", JSON.stringify(formDataObj));

      // Verify the stored data would route correctly
      const storedData = JSON.parse(localStorage.getItem("hubspot_form_data") || "{}");
      const route = window.FormRouterConfig.determineRoute(storedData);
      expect(route).toBe("NOT_QUALIFIED");
    });

    test("Should handle missing or invalid form data", () => {
      localStorage.clear();
      const route = window.FormRouterConfig.determineRoute({});
      expect(route).toBe("NOT_QUALIFIED");
    });
  });
});
