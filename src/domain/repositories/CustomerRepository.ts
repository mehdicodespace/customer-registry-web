import { ref, Ref, unref } from "vue";
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
      this.customers.value = [...uniqueApiCustomers];
      this.localStorageService.updateLocalStorage(this.customers.value); // Update local storage
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
        throw new Error();
      }
    } catch (error) {
      throw new Error("Error adding customer: Duplicate customer found");
    } finally {
      this.modalLoading.value = false;
    }
  }

  async removeCustomer(customer: Customer): Promise<void> {
    try {
      await this.restApiService.deleteCustomer(unref(customer._uuid));
      this.customers.value = this.customers.value.filter(
        (c) => c._uuid !== customer._uuid
      );
      this.localStorageService.updateLocalStorage(this.customers.value); // Update local storage
    } catch (error) {
      throw new Error("Error removing customer");
      throw error;
    }
  }

  async updateCustomer(updatedCustomer: Customer): Promise<void> {
    this.modalLoading.value = true;

    try {
      const index = this.customers.value.findIndex(
        (c) => unref(c._uuid) === unref(updatedCustomer._uuid)
      );

      if (index !== -1) {
        Object.assign(this.customers.value[index], updatedCustomer);
        this.localStorageService.updateLocalStorage(this.customers.value); // Update local storage
      }

      await this.restApiService.updateCustomer(updatedCustomer);
    } catch (error) {
      throw new Error("Error updating customer");
      throw error;
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
          c.firstName === customer.firstName &&
          c.lastName === customer.lastName &&
          c.dateOfBirth === customer.dateOfBirth
      ) && !this.customers.value.some((c) => c.email === customer.email)
    );
  }
}

export const customerRepository = new CustomerRepository();
