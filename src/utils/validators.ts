// validators.ts
import { isValidNumber } from "libphonenumber-js";

export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Check phone number is valid using libphonenumber-js
  return isValidNumber(phoneNumber);
}

export function isValidEmail(email: string): boolean {
  // Basic email validation using a regular expression
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

export function isValidBankAccountNumber(bankAccountNumber: string): boolean {
  return /^\d{8,20}$/.test(bankAccountNumber);
}
