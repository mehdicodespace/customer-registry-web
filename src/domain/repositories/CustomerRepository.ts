import { ref, Ref } from "vue";
import { Customer } from "@/domain/entities/Customer";
import RestApiService from "@/services/RestApiService";

class CustomerRepository {
  private customers: Ref<Customer[]> = ref([]);
  public getCustomersLoading: Ref<boolean> = ref(false);
  public modalLoading: Ref<boolean> = ref(false);

  async loadCustomers(): Promise<void> {
    this.getCustomersLoading.value = true;
    try {
      this.customers.value = await RestApiService.getAllCustomers();
    } finally {
      this.getCustomersLoading.value = false;
    }
  }

  clear(): void {
    this.customers.value = [];
  }

  async addCustomer(customer: Customer): Promise<void> {
    this.modalLoading.value = true;
    try {
      if (!this.isUnique(customer)) throw new Error("Duplicate customer found.");
      const createdCustomer = await RestApiService.createCustomer(customer);
      this.customers.value.push(createdCustomer);
    } finally {
      this.modalLoading.value = false;
    }
  }

  async removeCustomer(customer: Customer): Promise<void> {
    await RestApiService.deleteCustomer(customer._uuid);
    this.customers.value = this.customers.value.filter(
      (existing) => existing._uuid !== customer._uuid
    );
  }

  async updateCustomer(updatedCustomer: Customer): Promise<void> {
    this.modalLoading.value = true;
    try {
      if (!this.isUnique(updatedCustomer)) throw new Error("Duplicate customer found.");
      await RestApiService.updateCustomer(updatedCustomer);
      const index = this.customers.value.findIndex(
        (existing) => existing._uuid === updatedCustomer._uuid
      );
      if (index !== -1) this.customers.value[index] = updatedCustomer;
    } finally {
      this.modalLoading.value = false;
    }
  }

  getAllCustomers(): Ref<Customer[]> {
    return this.customers;
  }

  private isUnique(customer: Customer): boolean {
    return !this.customers.value.some(
      (existing) =>
        existing._uuid !== customer._uuid &&
        (existing.firstName.trim().toLowerCase() === customer.firstName.trim().toLowerCase() &&
          existing.lastName.trim().toLowerCase() === customer.lastName.trim().toLowerCase() &&
          existing.dateOfBirth === customer.dateOfBirth ||
          existing.email.toLowerCase() === customer.email.toLowerCase())
    );
  }
}

export const customerRepository = new CustomerRepository();
