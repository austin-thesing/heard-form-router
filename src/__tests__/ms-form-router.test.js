import { handleFormSubmission } from "../ms-form-router";
import { FormRouterConfig } from "../form-config";

describe("Multi-Step Form Router", () => {
  let mockEventData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    localStorage.clear();
    window.location.href = "";

    // Setup mock event data
    mockEventData = {
      type: "hsFormCallback",
      eventName: "onFormSubmit",
      data: {
        practiceSetup: { name: FormRouterConfig.FORM_FIELDS.practiceSetup, value: "sole prop" },
        income: { name: FormRouterConfig.FORM_FIELDS.income, value: "$50,000 - $99,999" },
        state: { name: FormRouterConfig.FORM_FIELDS.state, value: "california" },
        profession: { name: FormRouterConfig.FORM_FIELDS.profession, value: "therapist" },
        practiceRunning: { name: FormRouterConfig.FORM_FIELDS.practiceRunning, value: "less than 6 months" },
        multiOwner: { name: FormRouterConfig.FORM_FIELDS.multiOwner, value: "no" },
        employeeCount: { name: FormRouterConfig.FORM_FIELDS.employeeCount, value: "no" },
      },
    };
  });

  describe("Form submission handling", () => {
    test("should handle form ready event", () => {
      const readyEvent = {
        type: "hsFormCallback",
        eventName: "onFormReady",
      };
      window.dispatchEvent(new MessageEvent("message", { data: readyEvent }));
      // Add assertions based on your form ready handling
    });

    test("should handle form submission and store data", () => {
      window.dispatchEvent(new MessageEvent("message", { data: mockEventData }));

      // Verify data was processed and stored
      const storedData = JSON.parse(localStorage.getItem("hubspot_form_data"));
      expect(storedData).toBeTruthy();
      expect(storedData[FormRouterConfig.FORM_FIELDS.practiceSetup]).toBe("sole prop");
    });

    test("should handle array values in form data", () => {
      const arrayEventData = {
        ...mockEventData,
        data: {
          ...mockEventData.data,
          someArray: { name: "some_array", value: ["value1", "value2"] },
        },
      };
      window.dispatchEvent(new MessageEvent("message", { data: arrayEventData }));

      const storedData = JSON.parse(localStorage.getItem("hubspot_form_data"));
      expect(storedData.some_array).toBe("value1;value2");
    });
  });

  describe("Routing logic", () => {
    test("should route qualified submissions to scheduler", (done) => {
      window.dispatchEvent(new MessageEvent("message", { data: mockEventData }));

      // Allow time for redirect
      setTimeout(() => {
        expect(window.location.href).toBe(FormRouterConfig.LANDING_PAGES.SCHEDULER);
        done();
      }, 800);
    });

    test("should route disqualified submissions to not qualified", (done) => {
      const disqualifiedEvent = {
        ...mockEventData,
        data: {
          ...mockEventData.data,
          practiceSetup: { name: FormRouterConfig.FORM_FIELDS.practiceSetup, value: "c corp" },
        },
      };
      window.dispatchEvent(new MessageEvent("message", { data: disqualifiedEvent }));

      setTimeout(() => {
        expect(window.location.href).toBe(FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED);
        done();
      }, 800);
    });

    test("should handle missing form data gracefully", (done) => {
      const emptyEvent = {
        type: "hsFormCallback",
        eventName: "onFormSubmit",
        data: {},
      };
      window.dispatchEvent(new MessageEvent("message", { data: emptyEvent }));

      setTimeout(() => {
        expect(window.location.href).toBe(FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED);
        done();
      }, 800);
    });
  });

  describe("Error handling", () => {
    test("should capture errors with Sentry", () => {
      const errorEvent = {
        type: "hsFormCallback",
        eventName: "onFormSubmit",
        data: "invalid data",
      };
      window.dispatchEvent(new MessageEvent("message", { data: errorEvent }));

      expect(Sentry.captureException).toHaveBeenCalled();
      expect(window.location.href).toBe(FormRouterConfig.LANDING_PAGES.NOT_QUALIFIED);
    });
  });
});
