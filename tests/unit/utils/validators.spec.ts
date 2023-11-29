// validators.spec.ts
import {
  isValidPhoneNumber,
  isValidEmail,
  isValidBankAccountNumber,
} from "@/utils/validators";

describe("Validators", () => {
  describe("isValidPhoneNumber", () => {
    it("returns true for a valid phone number", () => {
      // Test valid phone number
      const result = isValidPhoneNumber("1234567890");
      expect(result).toBe(true);
    });

    it("returns false for an invalid phone number", () => {
      // Test invalid phone number
      const result = isValidPhoneNumber("invalid");
      expect(result).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("returns true for a valid email", () => {
      // Test valid email
      const result = isValidEmail("test@example.com");
      expect(result).toBe(true);
    });

    it("returns false for an invalid email", () => {
      // Test invalid email
      const result = isValidEmail("invalid");
      expect(result).toBe(false);
    });
  });

  describe("isValidBankAccountNumber", () => {
    it("returns true for a valid bank account number", () => {
      // Test valid bank account number
      const result = isValidBankAccountNumber("1234567890");
      expect(result).toBe(true);
    });

    it("returns false for an invalid bank account number", () => {
      // Test invalid bank account number
      const result = isValidBankAccountNumber("invalid");
      expect(result).toBe(false);
    });
  });
});
