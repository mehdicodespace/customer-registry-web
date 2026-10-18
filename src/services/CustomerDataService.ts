import { child, get, push, ref, remove, set, update } from "firebase/database";
import { Customer } from "@/domain/entities/Customer";
import AuthService from "@/services/AuthService";
import { database } from "@/services/firebase";

type CustomerInput = Pick<
  Customer,
  "firstName" | "lastName" | "dateOfBirth" | "phoneNumber" | "email" | "bankAccountNumber"
>;

const customerPath = async (): Promise<string> => {
  const user = await AuthService.getCurrentUser();
  if (!user) throw new Error("Sign in to manage customer records.");
  return `customers/${user.id}`;
};

const toCustomer = (id: string, data: CustomerInput): Customer =>
  new Customer({ _uuid: id, ...data });

const CustomerDataService = {
  async createCustomer(customer: Customer): Promise<Customer> {
    const listRef = ref(database, await customerPath());
    const customerRef = push(listRef);
    if (!customerRef.key) throw new Error("Could not create a customer record.");
    await set(customerRef, customerInput(customer));
    return toCustomer(customerRef.key, customerInput(customer));
  },

  async getAllCustomers(): Promise<Customer[]> {
    const snapshot = await get(ref(database, await customerPath()));
    if (!snapshot.exists()) return [];
    return Object.entries(snapshot.val() as Record<string, CustomerInput>).map(([id, data]) =>
      toCustomer(id, data)
    );
  },

  async updateCustomer(customer: Customer): Promise<void> {
    const path = await customerPath();
    await update(child(ref(database), `${path}/${customer._uuid}`), customerInput(customer));
  },

  async deleteCustomer(id: string): Promise<void> {
    const path = await customerPath();
    await remove(child(ref(database), `${path}/${id}`));
  },

  async getCustomerByUUID(id: string): Promise<Customer> {
    const path = await customerPath();
    const snapshot = await get(child(ref(database), `${path}/${id}`));
    if (!snapshot.exists()) throw new Error("Customer record not found.");
    return toCustomer(id, snapshot.val() as CustomerInput);
  },
};

function customerInput(customer: Customer): CustomerInput {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    dateOfBirth: customer.dateOfBirth,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    bankAccountNumber: customer.bankAccountNumber,
  };
}

export default CustomerDataService;
