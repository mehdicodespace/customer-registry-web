import { Customer } from '@/domain/entities/Customer';

describe('Customer Entity', () => {
  it('can be instantiated', () => {
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      bankAccountNumber: '1234567890123456',
    });

    expect(customer).toBeInstanceOf(Customer);
  });

  it('has accessible properties', () => {
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      bankAccountNumber: '1234567890123456',
    });

    expect(customer.firstName).toBe('John');
    expect(customer.lastName).toBe('Doe');
  });
});