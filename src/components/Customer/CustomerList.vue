<template>
  <div
    class="relative overflow-x-auto w-11/12 bg-gray-200 mx-auto mt-12 sm:rounded-lg py-12 px-12"
  >
    <div class="flex items-center gap-8 mb-12 justify-center">
      <h2 class="text-gray-700 font-bold text-4xl">Customers List</h2>
      <button
        @click="updateShowModal(true)"
        type="button"
        class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-6 py-3.5 text-center"
      >
        Create new customer
      </button>
    </div>
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
          :key="customer.fullName()"
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
                {{ customer.fullName() }}
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
              @click.prevent="editCustomer(customer)"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit user</a
            >
          </td>
        </tr>
      </tbody>
    </table>

    <customer-modal
      :title="modalTitle"
      :show-modal="showModal"
      :customer="modalCustomer"
      @updateCustomer="updateModalCustomer"
      @updateShowModal="updateShowModal"
    ></customer-modal>
  </div>
</template>

<script setup lang="ts">
import CustomerModal from "@/components/Customer/CustomerModal.vue";

import { reactive, ref } from "vue";
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

let modalCustomer = reactive(new Customer({}));
const showModal = ref(false);
const modalTitle = ref("Create new customer");

const updateModalCustomer = ({ key, value }) => {
  modalCustomer[key] = value;
};

const updateShowModal = (status) => {
  showModal.value = status;
  if (status === false) {
    modalCustomer = reactive(new Customer({}));
    modalTitle.value = "Create new customer";
  }
};

const editCustomer = (customer) => {
  modalCustomer = { ...customer };
  modalTitle.value = "Edit customer details";
  showModal.value = true;
};

addCustomer(customer1);
addCustomer(customer2);

const allCustomers = customerRepository.getAllCustomers();
</script>

<style lang="scss" scoped></style>
