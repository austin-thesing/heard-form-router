import { FormRouterConfig } from "../form-config";

describe("FormRouterConfig", () => {
  describe("determineRoute", () => {
    // Test disqualification conditions
    describe("disqualification routes", () => {
      test("should return NOT_QUALIFIED for C Corp", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "c corp",
        };
        expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
      });

      test("should return NOT_QUALIFIED for multiple owners", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.multiOwner]: "yes",
        };
        expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
      });

      test("should return NOT_QUALIFIED for international location", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.state]: "international",
        };
        expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
      });

      test("should return NOT_QUALIFIED for disqualified professions", () => {
        const disqualifiedProfessions = ["dietician", "nutritionist", "massage therapist", "dietician or nutritionist", "dietetics or nutrition counseling"];

        disqualifiedProfessions.forEach((profession) => {
          const formData = {
            [FormRouterConfig.FORM_FIELDS.profession]: profession,
          };
          expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
        });
      });

      test("should return NOT_QUALIFIED for low income", () => {
        const lowIncomes = ["none", "less than $20,000"];
        lowIncomes.forEach((income) => {
          const formData = {
            [FormRouterConfig.FORM_FIELDS.income]: income,
          };
          expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
        });
      });

      test("should return NOT_QUALIFIED for future practice", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceRunning]: "opening practice in 1+ month",
        };
        expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
      });

      test("should return NOT_QUALIFIED for too many employees", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.employeeCount]: "yes (more than 10 employees)",
        };
        expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
      });
    });

    // Test scheduler qualification
    describe("scheduler routes", () => {
      test("should return SCHEDULER for qualified income", () => {
        const qualifiedIncomes = ["$20,000 - $49,999", "$50,000 - $99,999", "more than $100,000"];

        qualifiedIncomes.forEach((income) => {
          const formData = {
            [FormRouterConfig.FORM_FIELDS.income]: income,
            [FormRouterConfig.FORM_FIELDS.practiceSetup]: "sole prop",
            [FormRouterConfig.FORM_FIELDS.state]: "california",
            [FormRouterConfig.FORM_FIELDS.profession]: "therapist",
            [FormRouterConfig.FORM_FIELDS.practiceRunning]: "less than 6 months",
            [FormRouterConfig.FORM_FIELDS.multiOwner]: "no",
            [FormRouterConfig.FORM_FIELDS.employeeCount]: "no",
          };
          expect(FormRouterConfig.determineRoute(formData)).toBe("SCHEDULER");
        });
      });
    });

    // Test edge cases
    describe("edge cases", () => {
      test("should handle empty form data", () => {
        expect(FormRouterConfig.determineRoute({})).toBe("NOT_QUALIFIED");
      });

      test("should handle null/undefined values", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.income]: null,
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: undefined,
        };
        expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
      });

      test("should handle case insensitive input", () => {
        const formData = {
          [FormRouterConfig.FORM_FIELDS.practiceSetup]: "C CORP",
          [FormRouterConfig.FORM_FIELDS.income]: "$50,000 - $99,999",
        };
        expect(FormRouterConfig.determineRoute(formData)).toBe("NOT_QUALIFIED");
      });
    });
  });
});
