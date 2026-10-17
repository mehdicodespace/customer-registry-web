import { Customer } from "@/domain/entities/Customer";
import AuthService from "@/services/AuthService";

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL?.replace(/\/$/, "");

interface ApiCustomer {
  _uuid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  bankAccountNumber: string;
}

interface ApiResponse<T> {
  items: T[];
  error?: string;
}

type CustomerInput = Pick<
  Customer,
  "firstName" | "lastName" | "dateOfBirth" | "phoneNumber" | "email" | "bankAccountNumber"
>;

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error("Set VUE_APP_API_BASE_URL in the frontend .env file.");
  }
  const token = AuthService.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (response.status === 204) return undefined as unknown as T;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "The request could not be completed.");
  return data as T;
};

const mapApiToCustomer = (customer: ApiCustomer): Customer =>
  new Customer({
    _uuid: customer._uuid,
    firstName: customer.firstName,
    lastName: customer.lastName,
    dateOfBirth: customer.dateOfBirth,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    bankAccountNumber: customer.bankAccountNumber,
  });

const RestApiService = {
  async createCustomer(customer: Customer): Promise<Customer> {
    const data = await request<ApiResponse<ApiCustomer>>("/customers", {
      method: "POST",
      body: JSON.stringify(customerInput(customer)),
    });
    return mapApiToCustomer(data.items[0]);
  },

  async getAllCustomers(): Promise<Customer[]> {
    const data = await request<ApiResponse<ApiCustomer>>("/customers");
    return data.items.map(mapApiToCustomer);
  },

  async updateCustomer(customer: Customer): Promise<void> {
    await request<ApiResponse<ApiCustomer>>(`/customers/${customer._uuid}`, {
      method: "PUT",
      body: JSON.stringify(customerInput(customer)),
    });
  },

  async deleteCustomer(uuid: string): Promise<void> {
    await request<void>(`/customers/${uuid}`, { method: "DELETE" });
  },

  async getCustomerByUUID(uuid: string): Promise<Customer> {
    const data = await request<ApiCustomer>(`/customers/${uuid}`);
    return mapApiToCustomer(data);
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

export default RestApiService;
