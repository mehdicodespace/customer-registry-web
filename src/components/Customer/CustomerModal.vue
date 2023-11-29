<template>
  <!-- Create/Edit user modal -->
  <!-- open = flex class -->
  <aside
    :class="[
      'fixed items-center justify-center z-50 top-0 left-0 h-screen w-full',
      showModal ? 'flex' : 'hidden',
    ]"
  >
    <div
      @click="showModalStatusChange(false)"
      class="fixed w-full h-full bg-gray-900/90 top-0 left-0 cursor-pointer"
    ></div>
    <div
      id="editUserModal"
      tabindex="-1"
      aria-hidden="true"
      class="w-full max-w-2xl max-h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0"
    >
      <div class="relative">
        <!-- Modal content -->
        <form class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <button
              @click="showModalStatusChange(false)"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="editUserModal"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-6 gap-6">
              <template v-for="(value, key) in customer" :key="key">
                <input-field
                  :modelValue="customer[key]"
                  :label="key"
                  @update:modelValue="updateCustomerValue(key, $event)"
                />
              </template>
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save all
            </button>
          </div>
        </form>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import InputField from "@/components/Shared/InputField.vue";

const emit = defineEmits(["updateCustomer", "updateShowModal"]);

defineProps({
  customer: {
    type: Object,
    required: true,
  },
  title: String,
  showModal: {
    type: Boolean,
    default: false,
  },
});

const updateCustomerValue = (key: string, value: string) => {
  emit("updateCustomer", { key, value });
};

const showModalStatusChange = (status: boolean) => {
  emit("updateShowModal", status);
};
</script>

<style scoped></style>
