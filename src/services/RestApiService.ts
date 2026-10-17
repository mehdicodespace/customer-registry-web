import { Customer } from "@/domain/entities/Customer";

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
const API_KEY = process.env.VUE_APP_API_KEY;

const getHeaders = () => {
  if (!API_BASE_URL || !API_KEY) {
    throw new Error("API configuration is missing. Set the VUE_APP_API_* variables in .env.local.");
  }
  return {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
  };
};

type CreateCustomerRequest = Pick<
  Customer,
  "firstName" | "lastName" | "dateOfBirth" | "phoneNumber" | "email" | "bankAccountNumber"
>;

const handleError = (error: Error): never => {
  throw error;
};

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

const mapApiToCustomer = (data: ApiCustomer): Customer => {
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
        headers: getHeaders(),
        body: JSON.stringify([requestData]),
      });

      const data = (await response.json()) as ApiResponse<ApiCustomer>;

      if (!response.ok) {
        throw new Error(data.error || "Could not create customer.");
      }

      return mapApiToCustomer(data.items[0]);
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },

  getAllCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer`, { headers: getHeaders() });
      const data = (await response.json()) as ApiResponse<ApiCustomer>;

      if (!response.ok) {
        throw new Error(data.error || "Could not load customers.");
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
        headers: getHeaders(),
        body: JSON.stringify([customer]),
      });

      const data = (await response.json()) as ApiResponse<ApiCustomer>;

      if (!response.ok) {
        throw new Error(data.error || "Could not update customer.");
      }
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },

  deleteCustomer: async (uuid: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/${uuid}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = (await response.json()) as ApiResponse<ApiCustomer>;

      if (!response.ok) {
        throw new Error(data.error || "Could not delete customer.");
      }
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },

  getCustomerByUUID: async (uuid: string): Promise<Customer> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/${uuid}`, {
        headers: getHeaders(),
      });
      const data = (await response.json()) as ApiCustomer;

      if (!response.ok) {
        throw new Error("Could not load customer.");
      }

      return mapApiToCustomer(data);
    } catch (error: unknown) {
      return handleError(error as Error);
    }
  },
};

export default RestApiService;
