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

  it("Has accessible reactive properties", () => {
    const customer = new Customer({
      _uuid: "",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phoneNumber: "1234567890",
      email: "john.doe@example.com",
      bankAccountNumber: "1234567890123456",
    });

    expect(customer.firstName.value).toBe("John");
    expect(customer.lastName.value).toBe("Doe");
  });
});
