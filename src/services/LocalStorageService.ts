import { Customer } from "@/domain/entities/Customer";

interface CustomerData {
  _uuid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  bankAccountNumber: string;
}

export class LocalStorageService {
  private localStorageKey = "customers";

  getAllCustomers(): Customer[] {
    const storedData = localStorage.getItem(this.localStorageKey);
    return storedData
      ? JSON.parse(storedData).map(
          (customerData: CustomerData) => new Customer(customerData)
        )
      : [];
  }

  getCustomerByUUID(uuid: string): Customer | undefined {
    return this.getAllCustomers().find((customer) => customer._uuid === uuid);
  }

  updateCustomerInLocalStorage(updatedCustomer: Customer): void {
    const customers = this.getAllCustomers();
    const updatedCustomers = customers.map((customer) =>
      customer._uuid === updatedCustomer._uuid ? updatedCustomer : customer
    );
    this.updateLocalStorage(updatedCustomers);
  }

  removeCustomerFromLocalStorage(uuid: string): void {
    const customers = this.getAllCustomers();
    const updatedCustomers = customers.filter(
      (customer: CustomerData) => customer._uuid !== uuid
    );
    this.updateLocalStorage(updatedCustomers);
  }

  updateLocalStorage(customers: Customer[]): void {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(customers.map((customer) => ({ ...customer })))
    );
  }
}
