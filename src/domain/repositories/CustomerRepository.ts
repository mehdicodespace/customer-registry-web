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
    this.getCustomersLoading.value = true;

    try {
      // Fetch customers from API
      const apiCustomers = await this.restApiService.getAllCustomers();

      // Filter out customers that already exist in local storage
      const uniqueApiCustomers = apiCustomers.filter(
        (apiCustomer: Customer) => {
          return !this.isUnique(apiCustomer);
        }
      );

      // Update the local storage with unique customers
      this.customers.value = [...this.customers.value, ...uniqueApiCustomers];
      this.localStorageService.updateLocalStorage(this.customers.value);
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
        this.localStorageService.updateLocalStorage(this.customers.value);
      } else {
        console.error("Error adding customer: Duplicate customer found");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      throw error;
    } finally {
      this.modalLoading.value = false;
    }
  }

  async removeCustomer(customer: Customer): Promise<void> {
    this.modalLoading.value = true;

    try {
      await this.restApiService.deleteCustomer(customer._uuid.value);
      this.customers.value = this.customers.value.filter(
        (c) => c._uuid.value !== customer._uuid.value
      );
      this.localStorageService.updateLocalStorage(this.customers.value);
    } catch (error) {
      console.error("Error removing customer:", error);
      throw error;
    } finally {
      this.modalLoading.value = false;
    }
  }

  async updateCustomer(updatedCustomer: Customer): Promise<void> {
    this.modalLoading.value = true;

    try {
      const returnedCustomer =
        await this.restApiService.updateCustomer(updatedCustomer);
      const index = this.customers.value.findIndex(
        (c) => c._uuid.value === returnedCustomer._uuid.value
      );
      if (index !== -1) {
        Object.assign(this.customers.value[index], returnedCustomer);
        this.localStorageService.updateLocalStorage(this.customers.value);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    } finally {
      this.modalLoading.value = false;
    }
  }

  getAllCustomers(): Ref<Customer[]> {
    return this.customers;
  }

  private isUnique(customer: Customer): boolean {
    return !this.customers.value.some(
      (c) =>
        c.firstName.value === customer.firstName.value &&
        c.lastName.value === customer.lastName.value &&
        c.dateOfBirth.value === customer.dateOfBirth.value &&
        c.email.value === customer.email.value
    );
  }
}

export const customerRepository = new CustomerRepository();
