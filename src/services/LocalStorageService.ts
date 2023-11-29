import { Customer } from "@/domain/entities/Customer";

export class LocalStorageService {
  private localStorageKey = "customers";

  getAllCustomers(): Customer[] {
    const storedData = localStorage.getItem(this.localStorageKey);
    return storedData ? JSON.parse(storedData) : [];
  }

  updateLocalStorage(customers: Customer[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(customers));
  }
}
