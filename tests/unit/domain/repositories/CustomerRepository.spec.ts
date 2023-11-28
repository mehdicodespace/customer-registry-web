import { ref } from 'vue';
import { Customer } from '@/domain/entities/Customer';
import { customerRepository } from '@/domain/repositories/CustomerRepository';

describe('CustomerRepository', () => {
  beforeEach(() => {
    // Reset the customers list before each test
    customerRepository['customers'] = ref([]);
  });

  it('addCustomer adds a customer to the repository', () => {
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      phoneNumber: '123456789',
      email: 'john@example.com',
      bankAccountNumber: '987654321',
    });

    customerRepository.addCustomer(customer);

    expect(customerRepository.getAllCustomers().value).toContain(customer);
  });

  it('removeCustomer removes a customer from the repository', () => {
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      phoneNumber: '123456789',
      email: 'john@example.com',
      bankAccountNumber: '987654321',
    });

    customerRepository.addCustomer(customer);
    customerRepository.removeCustomer(customer);

    expect(customerRepository.getAllCustomers().value).not.toContain(customer);
  });

  it('updateCustomer updates an existing customer in the repository', () => {
    const initialCustomer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      phoneNumber: '123456789',
      email: 'john@example.com',
      bankAccountNumber: '987654321',
    });

    const updatedCustomer = new Customer({
      firstName: 'Updated',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      phoneNumber: '987654321',
      email: 'updated@example.com',
      bankAccountNumber: '123456789',
    });

    customerRepository.addCustomer(initialCustomer);
    customerRepository.updateCustomer(updatedCustomer);

    expect(customerRepository.getAllCustomers().value).toContainEqual(updatedCustomer);
  });

  it('getAllCustomers returns all customers in the repository', () => {
    const customer1 = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      phoneNumber: '123456789',
      email: 'john@example.com',
      bankAccountNumber: '987654321',
    });

    const customer2 = new Customer({
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      phoneNumber: '987654321',
      email: 'jane@example.com',
      bankAccountNumber: '123456789',
    });

    customerRepository.addCustomer(customer1);
    customerRepository.addCustomer(customer2);

    const allCustomers = customerRepository.getAllCustomers().value;

    expect(allCustomers).toContainEqual(customer1);
    expect(allCustomers).toContainEqual(customer2);
  });
});
