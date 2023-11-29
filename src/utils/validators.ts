// validators.ts
import { isValidNumber } from "libphonenumber-js";

export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Check phone number is valid using libphonenumber-js
  return isValidNumber(phoneNumber);
}

export function isValidEmail(email: string): boolean {
  // Basic email validation using a regular expression
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

export function isValidBankAccountNumber(bankAccountNumber: string): boolean {
  // Basic validation for a bank account number
  const digitRegex = /\d/;

  // Check if the string contains at least one digit
  if (!digitRegex.test(bankAccountNumber)) {
    return false;
  }

  // ensure a specific length range
  const minLength = 8;
  const maxLength = 20;

  const length = bankAccountNumber.length;

  return length >= minLength && length <= maxLength;
}
