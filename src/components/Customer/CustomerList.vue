<template>
  <div
    class="relative overflow-x-auto w-11/12 bg-gray-200 mx-auto mt-12 sm:rounded-lg py-12 px-12"
  >
    <h2 class="text-gray-700 font-bold text-4xl text-center mb-12">
      Customers List
    </h2>
    <table
      class="w-full shadow-md text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-gray-700 uppercase bg-gray-100 font-bold dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-4">Full Name</th>
          <th scope="col" class="px-6 py-4">Email</th>
          <th scope="col" class="px-6 py-4">Phone Number</th>
          <th scope="col" class="px-6 py-4">Date of Birth</th>
          <th scope="col" class="px-6 py-4">Bank Account Number</th>
          <th scope="col" class="px-6 py-4">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="customer in allCustomers"
          :key="`${customer.firstName} ${customer.lastName}`"
          class="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td
            scope="row"
            class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            <svg class="w-10 h-10 text-gray-400 select-none text-main-orange">
              <use :href="`/icons.svg#user`"></use>
            </svg>
            <div class="ps-3">
              <div class="text-base font-semibold">
                {{ `${customer.firstName} ${customer.lastName}` }}
              </div>
            </div>
          </td>
          <td class="px-6 py-4">{{ customer.email }}</td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ customer.phoneNumber }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ customer.dateOfBirth }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ customer.bankAccountNumber }}
            </div>
          </td>
          <td class="px-6 py-4">
            <!-- Modal toggle -->
            <a
              href="#"
              type="button"
              data-modal-target="editUserModal"
              data-modal-show="editUserModal"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit user</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Customer } from "@/domain/entities/Customer";
import { customerRepository } from "@/domain/repositories/CustomerRepository";

const customer1 = reactive(
  new Customer({ firstName: "Mehdi", lastName: "Rafiei" })
);

const customer2 = reactive(
  new Customer({ firstName: "Mason", lastName: "Chase" })
);

const addCustomer = (customer) => {
  customerRepository.addCustomer(customer);
};

addCustomer(customer1);
addCustomer(customer2);

const allCustomers = customerRepository.getAllCustomers();
</script>

<style lang="scss" scoped></style>
