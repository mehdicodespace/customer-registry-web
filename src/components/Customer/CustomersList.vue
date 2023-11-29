<template>
  <div
    class="relative overflow-x-auto w-11/12 bg-gray-200 mx-auto mt-12 sm:rounded-lg py-12 px-12"
  >
    <div class="flex items-center gap-8 mb-12 justify-between">
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
            <svg class="w-10 h-10 text-gray-400 select-none">
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
              @click.prevent="showEditCustomerModal(customer)"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit user</a
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div role="status" class="bg-gray-300 py-12 font-medium">
      <div
        class="flex flex-col gap-2 text-lg items-center justify-center"
        v-if="getCustomersLoading"
      >
        <svg
          aria-hidden="true"
          class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span>Loading customers...</span>
      </div>

      <div class="text-center text-xl" v-else-if="allCustomers.length === 0">
        No customers have been added yet.
      </div>
    </div>

    <customer-modal
      v-if="showModal"
      :type="modalType"
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

// const addCustomer = (customer) => {
//   customerRepository.addCustomer(customer);
// };

let modalCustomer = reactive(new Customer({}));
const showModal = ref(false);
const modalType = ref("create");

const updateModalCustomer = ({ key, value }) => {
  modalCustomer[key] = value;
};

const updateShowModal = (status) => {
  showModal.value = status;
  if (status === false) {
    modalCustomer = reactive(new Customer({}));
    modalType.value = "create";
  }
};

const showEditCustomerModal = (customer) => {
  modalCustomer = { ...customer };
  modalType.value = "edit";
  showModal.value = true;
};

const getCustomersLoading = ref(customerRepository.getCustomersLoading);
const allCustomers = customerRepository.getAllCustomers();
</script>

<style lang="scss" scoped></style>
