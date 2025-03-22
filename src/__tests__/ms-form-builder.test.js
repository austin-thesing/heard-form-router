import { initializeMultiStepForm } from "../ms-form-builder";

describe("Multi-Step Form Builder", () => {
  let container;

  beforeEach(() => {
    // Setup test container
    container = document.createElement("div");
    document.body.appendChild(container);

    // Create mock HubSpot form structure
    const hubspotForm = document.createElement("div");
    hubspotForm.className = "hbspt-form";
    const form = document.createElement("form");
    hubspotForm.appendChild(form);

    // Add form fields
    const fields = ["firstname", "email", "state", "profession", "practiceSetup", "income", "practiceRunning", "multiOwner", "employeeCount"];

    fields.forEach((fieldName) => {
      const field = document.createElement("div");
      field.className = `hs-form-field hs_${fieldName}`;
      form.appendChild(field);
    });

    // Add legal consent container
    const legalConsent = document.createElement("div");
    legalConsent.className = "legal-consent-container";
    form.appendChild(legalConsent);

    // Add submit button
    const submit = document.createElement("div");
    submit.className = "hs_submit";
    form.appendChild(submit);

    container.appendChild(hubspotForm);
  });

  afterEach(() => {
    if (container && container.parentNode === document.body) {
      document.body.removeChild(container);
    }
    container = null;
  });

  describe("Form initialization", () => {
    test("should create step navigation", () => {
      initializeMultiStepForm();
      const stepNav = document.querySelector(".step-nav");
      expect(stepNav).toBeTruthy();
      expect(stepNav.children.length).toBe(4); // 4 steps
    });

    test("should create form steps", () => {
      initializeMultiStepForm();
      const steps = document.querySelectorAll(".form-step");
      expect(steps.length).toBe(4); // 4 steps
      expect(steps[0].classList.contains("active")).toBe(true); // First step active
    });

    test("should add navigation buttons", () => {
      initializeMultiStepForm();
      const navigation = document.querySelector(".form-navigation");
      expect(navigation).toBeTruthy();
      expect(navigation.querySelector(".previous")).toBeTruthy();
      expect(navigation.querySelector(".next")).toBeTruthy();
    });

    test("should handle missing HubSpot form", () => {
      container.innerHTML = "";
      initializeMultiStepForm();
      // Should retry initialization
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
    });
  });

  describe("Navigation functionality", () => {
    beforeEach(() => {
      initializeMultiStepForm();
    });

    test("should move to next step when clicking next", () => {
      const nextButton = document.querySelector(".next");
      nextButton.click();

      const steps = document.querySelectorAll(".form-step");
      expect(steps[0].classList.contains("active")).toBe(false);
      expect(steps[1].classList.contains("active")).toBe(true);
    });

    test("should move to previous step when clicking previous", () => {
      // First move to second step
      const nextButton = document.querySelector(".next");
      nextButton.click();

      // Then go back
      const prevButton = document.querySelector(".previous");
      prevButton.click();

      const steps = document.querySelectorAll(".form-step");
      expect(steps[0].classList.contains("active")).toBe(true);
      expect(steps[1].classList.contains("active")).toBe(false);
    });

    test("should show submit button on last step", () => {
      const nextButton = document.querySelector(".next");
      // Move to last step
      for (let i = 0; i < 3; i++) {
        nextButton.click();
      }

      const submitButton = document.querySelector(".submit");
      expect(submitButton.style.display).not.toBe("none");
    });
  });

  describe("Form validation", () => {
    beforeEach(() => {
      initializeMultiStepForm();
    });

    test("should validate required fields before proceeding", () => {
      const nextButton = document.querySelector(".next");
      nextButton.click();

      const errorMessage = document.querySelector(".error-message");
      expect(errorMessage).toBeTruthy();
    });

    test("should allow proceeding when required fields are filled", () => {
      // Fill required fields in first step
      const inputs = document.querySelectorAll(".form-step.active input");
      inputs.forEach((input) => {
        input.value = "test value";
        input.dispatchEvent(new Event("change"));
      });

      const nextButton = document.querySelector(".next");
      nextButton.click();

      const steps = document.querySelectorAll(".form-step");
      expect(steps[1].classList.contains("active")).toBe(true);
    });
  });

  describe("Legal consent handling", () => {
    test("should move legal consent to last step", () => {
      initializeMultiStepForm();
      const lastStep = document.querySelector('.form-step[data-step="4"]');
      const consentContainer = lastStep.querySelector(".legal-consent-container");
      expect(consentContainer).toBeTruthy();
    });

    test("should add privacy text after consent checkbox", () => {
      initializeMultiStepForm();
      const lastStep = document.querySelector('.form-step[data-step="4"]');
      const privacyText = lastStep.querySelector(".privacy-text");
      expect(privacyText).toBeTruthy();
      expect(privacyText.textContent).toContain("Heard is committed to protecting");
    });
  });
});
