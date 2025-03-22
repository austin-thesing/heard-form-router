import { determineCalendarType } from "../scheduler-bundle";
import { FormRouterConfig } from "../form-config";

describe("Scheduler Bundle", () => {
  describe("determineCalendarType", () => {
    beforeEach(() => {
      // Reset window.location before each test
      window.location.href = "";
    });

    test("should redirect to homepage if form data is missing", () => {
      determineCalendarType(null);
      expect(window.location.href).toBe("https://joinheard.com");
    });

    test("should redirect to welcome form if required fields are missing", () => {
      determineCalendarType({});
      expect(window.location.href).toBe("https://joinheard.com/welcome-form");
    });

    describe("S_CORP calendar routing", () => {
      test("should return S_CORP for S Corp practice setup", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "s corp",
          [FormRouterConfig.FORM_FIELDS.employeeCount]: "no",
        };
        expect(determineCalendarType(formData)).toBe("S_CORP");
      });

      test("should return S_CORP for LLC with small team", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "llc",
          [FormRouterConfig.FORM_FIELDS.employeeCount]: "less than 5",
        };
        expect(determineCalendarType(formData)).toBe("S_CORP");
      });

      test("should return S_CORP for PLLC with small team", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "pllc",
          [FormRouterConfig.FORM_FIELDS.employeeCount]: "5-10",
        };
        expect(determineCalendarType(formData)).toBe("S_CORP");
      });
    });

    describe("SOLE_PROP calendar routing", () => {
      test("should return SOLE_PROP for sole proprietorship with no employees", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "sole prop",
          [FormRouterConfig.FORM_FIELDS.employeeCount]: "no",
        };
        expect(determineCalendarType(formData)).toBe("SOLE_PROP");
      });

      test("should return SOLE_PROP as default for unmatched cases", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "other",
          [FormRouterConfig.FORM_FIELDS.employeeCount]: "other",
        };
        expect(determineCalendarType(formData)).toBe("SOLE_PROP");
      });
    });

    describe("Case sensitivity handling", () => {
      test("should handle uppercase practice setup", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "S CORP",
          [FormRouterConfig.FORM_FIELDS.employeeCount]: "no",
        };
        expect(determineCalendarType(formData)).toBe("S_CORP");
      });

      test("should handle mixed case employee count", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "llc",
          [FormRouterConfig.FORM_FIELDS.employeeCount]: "Less Than 5",
        };
        expect(determineCalendarType(formData)).toBe("S_CORP");
      });
    });
  });
});
