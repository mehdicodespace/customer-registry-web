import { ref, Ref } from "vue";
import { Customer } from "@/domain/entities/Customer";
import { LocalStorageService } from "@/services/LocalStorageService";
import RestApiService from "@/services/RestApiService";

class CustomerRepository {
  private customers: Ref<Customer[]> = ref([]);
  private localStorageService: LocalStorageService;
  private restApiService: typeof RestApiService;
  public getCustomersLoading: Ref<boolean> = ref(false);
  public modalLoading: Ref<boolean> = ref(false);

  constructor() {
    this.localStorageService = new LocalStorageService();
    this.restApiService = RestApiService;
    this.init();
  }

  private async init(): Promise<void> {
    this.customers.value = this.localStorageService.getAllCustomers();
    this.getCustomersLoading.value = true;

    try {
      const apiCustomers = await this.restApiService.getAllCustomers();
      const uniqueApiCustomers = apiCustomers.filter(
        (apiCustomer: Customer) =>
          !this.customers.value.some(
            (localCustomer) => localCustomer._uuid === apiCustomer._uuid
          )
      );
      const mergedCustomers = [...uniqueApiCustomers, ...this.customers.value];
      this.customers.value = mergedCustomers;
      this.localStorageService.updateLocalStorage(mergedCustomers);
    } catch {
      // Keep the locally saved list available when the API cannot be reached.
    } finally {
      this.getCustomersLoading.value = false;
    }
  }

  async addCustomer(customer: Customer): Promise<void> {
    this.modalLoading.value = true;

    try {
      if (this.isUnique(customer)) {
        const createdCustomer =
          await this.restApiService.createCustomer(customer);
        this.customers.value.push(createdCustomer);
        this.localStorageService.updateLocalStorage(this.customers.value); // Update local storage
      } else {
        throw new Error("Duplicate customer found");
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Duplicate")) throw error;
      throw new Error(`Error adding customer: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      this.modalLoading.value = false;
    }
  }

  async removeCustomer(customer: Customer): Promise<void> {
    try {
      await this.restApiService.deleteCustomer(customer._uuid);
      this.customers.value = this.customers.value.filter(
        (c) => c._uuid !== customer._uuid
      );
      this.localStorageService.updateLocalStorage(this.customers.value); // Update local storage
    } catch (error) {
      throw new Error(`Error removing customer: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async updateCustomer(updatedCustomer: Customer): Promise<void> {
    this.modalLoading.value = true;

    try {
      const index = this.customers.value.findIndex(
        (c) => c._uuid === updatedCustomer._uuid
      );

      if (!this.isUnique(updatedCustomer)) {
        throw new Error("Duplicate customer found");
      }

      await this.restApiService.updateCustomer(updatedCustomer);
      if (index !== -1) {
        this.customers.value[index] = updatedCustomer;
        this.localStorageService.updateLocalStorage(this.customers.value);
      }
    } catch (error) {
      throw new Error(`Error updating customer: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      this.modalLoading.value = false;
    }
  }

  getAllCustomers(): Ref<Customer[]> {
    return this.customers;
  }

  private isUnique(customer: Customer): boolean {
    return (
      !this.customers.value.some(
        (c) =>
          c._uuid !== customer._uuid &&
          c.firstName.trim().toLowerCase() === customer.firstName.trim().toLowerCase() &&
          c.lastName.trim().toLowerCase() === customer.lastName.trim().toLowerCase() &&
          c.dateOfBirth === customer.dateOfBirth
      ) && !this.customers.value.some((c) => c._uuid !== customer._uuid && c.email.toLowerCase() === customer.email.toLowerCase())
    );
  }
}

export const customerRepository = new CustomerRepository();
