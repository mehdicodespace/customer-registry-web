import { ref } from 'vue';
import { Customer } from '@/domain/entities/Customer';
import { customerRepository } from '@/domain/repositories/CustomerRepository';

describe('CustomerRepository', () => {
  beforeEach(() => {
    // Reset the customers list before each test
    customerRepository['customers'] = ref([]);
  });

  describe('addCustomer', () => {
    it('adds a customer to the repository', () => {
      const customer = new Customer({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        phoneNumber: '123456789',
        email: 'john.doe@example.com',
        bankAccountNumber: '1234567890',
      });

      customerRepository.addCustomer(customer);

      // Check if the customer is added
      expect(customerRepository.getAllCustomers().value).toContainEqual(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-01-01'),
          phoneNumber: '123456789',
          email: 'john.doe@example.com',
          bankAccountNumber: '1234567890',
        })
      );
    });
  });

  describe('getAllCustomers', () => {
    it('returns all customers in the repository', () => {
      const customer1 = new Customer({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        phoneNumber: '123456789',
        email: 'john.doe@example.com',
        bankAccountNumber: '1234567890',
      });
  
      const customer2 = new Customer({
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: new Date('1995-01-01'),
        phoneNumber: '987654321',
        email: 'jane.doe@example.com',
        bankAccountNumber: '0987654321',
      });
  
      customerRepository.addCustomer(customer1);
      customerRepository.addCustomer(customer2);

      const allCustomers = customerRepository.getAllCustomers().value;

      // Check if all customers are returned
      expect(allCustomers).toContainEqual(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-01-01'),
          phoneNumber: '123456789',
          email: 'john.doe@example.com',
          bankAccountNumber: '1234567890',
        })
      );

      expect(allCustomers).toContainEqual(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: new Date('1995-01-01'),
          phoneNumber: '987654321',
          email: 'jane.doe@example.com',
          bankAccountNumber: '0987654321',
        })
      );
      expect(allCustomers.length).toBe(2);
    });

    it('returns an empty array if no customers are added', () => {
      const allCustomers = customerRepository.getAllCustomers().value;

      // Check if an empty array is returned
      expect(allCustomers).toEqual([]);
    });
  });
});
