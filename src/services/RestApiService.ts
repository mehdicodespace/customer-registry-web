import { Ref } from "vue";
import { API_BASE_URL } from "@/configs/config.public";
import { API_KEY } from "@/configs/config.private";
import { Customer } from "@/domain/entities/Customer";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

interface CreateCustomerRequest {
  firstName: Ref<string>;
  lastName: Ref<string>;
  dateOfBirth: Ref<string>;
  phoneNumber: Ref<string>;
  email: Ref<string>;
  bankAccountNumber: Ref<string>;
}

const handleError = (error: Error): never => {
  console.error("API Error:", error);
  throw error;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapApiToCustomer = (data: any): Customer => {
  return new Customer({
    _uuid: data._uuid,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    phoneNumber: data.phoneNumber,
    email: data.email,
    bankAccountNumber: data.bankAccountNumber,
  });
};

const RestApiService = {
  createCustomer: async (customer: Customer): Promise<Customer> => {
    try {
      const requestData: CreateCustomerRequest = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        dateOfBirth: customer.dateOfBirth,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
        bankAccountNumber: customer.bankAccountNumber,
      };

      const response = await fetch(`${API_BASE_URL}/customer`, {
        method: "POST",
        headers,
        body: JSON.stringify([requestData]),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return mapApiToCustomer(data.items[0]);
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },

  getAllCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer`, { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data.items.map(mapApiToCustomer);
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },

  updateCustomer: async (customer: Customer) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer`, {
        method: "PUT",
        headers,
        body: JSON.stringify([customer]),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },

  deleteCustomer: async (uuid: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/${uuid}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },

  getCustomerByUUID: async (uuid: string): Promise<Customer> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/${uuid}`, {
        headers,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return mapApiToCustomer(data);
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },
};

export default RestApiService;
