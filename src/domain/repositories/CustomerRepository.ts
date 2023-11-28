import { ref, Ref } from 'vue';
import { Customer } from '@/domain/entities/Customer';

class CustomerRepository {
  private customers: Ref<Customer[]> = ref([]);

  addCustomer(customer: Customer): void {
    this.customers.value.push(customer);
  }

  getAllCustomers(): Ref<Customer[]> {
    return this.customers;
  }
}

export const customerRepository = new CustomerRepository();