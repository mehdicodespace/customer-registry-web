import { Customer } from "@/domain/entities/Customer";

describe("Customer Entity", () => {
  it("Can be instantiated", () => {
    const customer = new Customer({
      _uuid: "",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phoneNumber: "1234567890",
      email: "john.doe@example.com",
      bankAccountNumber: "1234567890123456",
    });

    expect(customer).toBeInstanceOf(Customer);
  });

  it("Keeps customer data as plain values", () => {
    const customer = new Customer({
      _uuid: "",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phoneNumber: "1234567890",
      email: "john.doe@example.com",
      bankAccountNumber: "1234567890123456",
    });

    expect(customer.firstName).toBe("John");
    expect(customer.lastName).toBe("Doe");
  });
});
