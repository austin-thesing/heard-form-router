import { initializeForm, handleRedirect } from "../form-router";
import { FormRouterConfig } from "../form-config";

describe("Form Router", () => {
  let mockForm;
  let mockFormData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    localStorage.clear();
    window.location.href = "";

    // Setup mock form data
    mockFormData = {
      [FormRouterConfig.FORM_FIELDS.practiceSetup]: "sole prop",
      [FormRouterConfig.FORM_FIELDS.income]: "$50,000 - $99,999",
      [FormRouterConfig.FORM_FIELDS.state]: "california",
      [FormRouterConfig.FORM_FIELDS.profession]: "therapist",
      [FormRouterConfig.FORM_FIELDS.practiceRunning]: "less than 6 months",
      [FormRouterConfig.FORM_FIELDS.multiOwner]: "no",
      [FormRouterConfig.FORM_FIELDS.employeeCount]: "no",
    };

    // Setup mock form
    mockForm = document.createElement("form");
    Object.entries(mockFormData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.name = key;
      input.value = value;
      mockForm.appendChild(input);
    });
  });

  describe("initializeForm", () => {
    test("should create HubSpot form with correct configuration", () => {
      initializeForm();
      expect(window.hbspt.forms.create).toHaveBeenCalled();
      const createConfig = window.hbspt.forms.create.mock.calls[0][0];
      expect(createConfig).toHaveProperty("onFormSubmit");
      expect(createConfig).toHaveProperty("onFormSubmitted");
      expect(createConfig).toHaveProperty("onFormSubmitError");
    });

    test("should handle form submission and store data", () => {
      initializeForm();
      const createConfig = window.hbspt.forms.create.mock.calls[0][0];

      // Call onFormSubmit handler
      const result = createConfig.onFormSubmit(mockForm);
      expect(result).toBe(true);

      // Verify data was stored in localStorage
      const storedData = JSON.parse(localStorage.getItem("hubspot_form_data"));
      expect(storedData).toEqual(mockFormData);
    });

    test("should handle form submission error", () => {
      initializeForm();
      const createConfig = window.hbspt.forms.create.mock.calls[0][0];

      const error = new Error("Test error");
      createConfig.onFormSubmitError(mockForm, error);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, expect.any(Object));
    });
  });

  describe("handleRedirect", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("should redirect to scheduler for qualified submissions", () => {
      localStorage.setItem("hubspot_form_data", JSON.stringify(mockFormData));
      handleRedirect();
      jest.runAllTimers();
      expect(window.location.href).toBe(FormRouterConfig.LANDING_PAGES.SCHEDULER);
    });

    test("should redirect to not qualified for disqualified submissions", () => {
      const disqualifiedData = {
        ...mockFormData,
        [FormRouterConfig.FORM_FIELDS.practiceSetup]: "c corp",
      };
      localStorage.setItem("hubspot_form_data", JSON.stringify(disqualifiedData));
      handleRedirect();
      jest.runAllTimers();
      expect(window.location.href).toBe(FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED);
    });

    test("should handle missing form data", () => {
      handleRedirect();
      jest.runAllTimers();
      expect(window.location.href).toBe(FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED);
    });

    test("should handle invalid JSON in localStorage", () => {
      localStorage.setItem("hubspot_form_data", "invalid json");
      handleRedirect();
      jest.runAllTimers();
      expect(window.location.href).toBe(FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED);
      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });
});
