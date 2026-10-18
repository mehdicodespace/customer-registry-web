<template>
  <section class="mx-auto w-11/12 max-w-7xl">
    <div class="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Workspace</p>
        <h1 class="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Customers</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">A clear view of the people you work with.</p>
      </div>
      <button
        type="button"
        class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
        @click="openCreateModal"
      >
        <span aria-hidden="true" class="text-lg leading-none">+</span>
        Add customer
      </button>
    </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
        <div>
          <h2 class="font-semibold text-slate-900 dark:text-slate-100">Customer list</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ allCustomers.length }} {{ allCustomers.length === 1 ? "record" : "records" }}
          </p>
        </div>
        <label class="relative block w-full sm:w-[22rem] sm:flex-none">
          <span class="sr-only">Search customers</span>
          <svg aria-hidden="true" class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 dark:text-slate-500" viewBox="0 0 20 20" fill="none">
            <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" stroke-width="1.6" />
            <path d="m13 13 4 4" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" />
          </svg>
          <input
            v-model.trim="searchQuery"
            type="search"
            placeholder="Search by name or email"
            class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-11 pr-11 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:hover:bg-slate-950 dark:focus:border-blue-400 dark:focus:bg-slate-950 dark:focus:ring-blue-950"
          />
          <button v-if="searchQuery" type="button" class="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Clear search" @click="searchQuery = ''">
            <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 20 20" fill="none"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" /></svg>
          </button>
        </label>
      </div>

      <div v-if="getCustomersLoading" class="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center" role="status">
        <span class="h-8 w-8 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-700" aria-hidden="true"></span>
        <p class="text-sm text-slate-500 dark:text-slate-400">Loading customer records…</p>
      </div>

      <div v-else-if="allCustomers.length === 0" class="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <span class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">＋</span>
        <h3 class="font-semibold text-slate-900 dark:text-slate-100">Your list is ready for its first entry</h3>
        <p class="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">Add a customer to keep their contact details together in one place.</p>
        <button type="button" class="mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus:ring-blue-950" @click="openCreateModal">
          Add your first customer
        </button>
      </div>

      <div v-else-if="filteredCustomers.length === 0" class="px-6 py-16 text-center">
        <h3 class="font-semibold text-slate-900 dark:text-slate-100">No matching customers</h3>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Try a different name or email address.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[760px] text-left text-sm">
          <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
            <tr>
              <th scope="col" class="px-6 py-3.5">Customer</th>
              <th scope="col" class="px-6 py-3.5">Contact</th>
              <th scope="col" class="px-6 py-3.5">Date of birth</th>
              <th scope="col" class="px-6 py-3.5">Account</th>
              <th scope="col" class="px-6 py-3.5"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="customer in filteredCustomers" :key="customer._uuid" class="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-900 dark:text-slate-100">{{ customer.fullName() }}</p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ customer.phoneNumber }}</p>
              </td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ customer.email }}</td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ formatDate(customer.dateOfBirth) }}</td>
              <td class="px-6 py-4 font-mono text-slate-600 dark:text-slate-300" :aria-label="`Account ending in ${lastFour(customer.bankAccountNumber)}`">
                {{ maskAccount(customer.bankAccountNumber) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-1">
                  <button type="button" class="rounded-md px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-blue-300 dark:hover:bg-blue-950" @click="openEditModal(customer)">
                    Edit
                  </button>
                  <button type="button" :disabled="deletingId === customer._uuid" class="rounded-md px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-wait disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-950/60" @click="removeCustomer(customer)">
                    {{ deletingId === customer._uuid ? "Deleting…" : "Delete" }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="deleteError" role="alert" class="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-200">
      {{ deleteError }}
    </p>

    <customer-modal
      v-if="showModal"
      :type="modalType"
      :customer="modalCustomer"
      @updateCustomer="updateModalCustomer"
      @updateShowModal="updateShowModal"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CustomerModal from "@/components/Customer/CustomerModal.vue";
import { Customer } from "@/domain/entities/Customer";
import { customerRepository } from "@/domain/repositories/CustomerRepository";

const showModal = ref(false);
const modalType = ref<"create" | "edit">("create");
const modalCustomer = ref(new Customer());
const searchQuery = ref("");
const deleteError = ref("");
const deletingId = ref("");

const getCustomersLoading = customerRepository.getCustomersLoading;
const allCustomers = customerRepository.getAllCustomers();
const filteredCustomers = computed(() => {
  const query = searchQuery.value.toLocaleLowerCase();
  if (!query) return allCustomers.value;
  return allCustomers.value.filter((customer) =>
    `${customer.fullName()} ${customer.email}`.toLocaleLowerCase().includes(query)
  );
});

const openCreateModal = () => {
  modalCustomer.value = new Customer();
  modalType.value = "create";
  showModal.value = true;
};

const openEditModal = (customer: Customer) => {
  modalCustomer.value = new Customer(customer);
  modalType.value = "edit";
  showModal.value = true;
};

const updateModalCustomer = (payload: { key: CustomerField; value: string }) => {
  modalCustomer.value = new Customer({ ...modalCustomer.value, [payload.key]: payload.value });
};

const updateShowModal = (status: boolean) => {
  showModal.value = status;
};

const removeCustomer = async (customer: Customer) => {
  if (!window.confirm(`Delete ${customer.fullName()} from your customer list?`)) return;
  deletingId.value = customer._uuid;
  deleteError.value = "";
  try {
    await customerRepository.removeCustomer(customer);
  } catch (error) {
    deleteError.value = error instanceof Error ? error.message : "Could not delete this customer.";
  } finally {
    deletingId.value = "";
  }
};

const lastFour = (accountNumber: string) => accountNumber.slice(-4);
const maskAccount = (accountNumber: string) => `${"•".repeat(Math.max(4, accountNumber.length - 4))} ${lastFour(accountNumber)}`;
const formatDate = (date: string) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
};

type CustomerField = "firstName" | "lastName" | "dateOfBirth" | "phoneNumber" | "email" | "bankAccountNumber";
</script>
