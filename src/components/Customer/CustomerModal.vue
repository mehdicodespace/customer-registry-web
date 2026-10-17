<template>
  <section class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" @keydown.esc.stop.prevent="close">
    <button type="button" aria-label="Close customer form" class="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-[2px]" @click="close"></button>
    <div
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      class="relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-950/20 sm:max-h-[calc(100vh-3rem)]"
    >
      <header class="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Customer details</p>
          <h2 :id="titleId" class="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            {{ type === "create" ? "Add a customer" : "Edit customer" }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">Fields marked with * are required.</p>
        </div>
        <button type="button" aria-label="Close" class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200" @click="close">
          <svg aria-hidden="true" class="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" />
          </svg>
        </button>
      </header>

      <form class="overflow-y-auto" novalidate @submit.prevent="save">
        <div class="grid gap-x-5 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
          <InputField
            v-for="field in fields"
            :key="field.name"
            :name="field.name"
            :label="field.label"
            :type="field.type"
            :inputmode="field.inputmode"
            :autocomplete="field.autocomplete"
            :placeholder="field.placeholder"
            :hint="field.hint"
            :model-value="customer[field.name]"
            :error-message="errors[field.name]"
            @update:model-value="updateCustomerValue(field.name, $event)"
            @blur="validateField(field.name)"
          />
        </div>

        <p v-if="formMessage" :class="success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'" class="mx-5 mb-5 rounded-lg border px-4 py-3 text-sm sm:mx-7" :role="success ? 'status' : 'alert'">
          {{ formMessage }}
        </p>

        <footer class="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button type="button" class="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200" @click="close">
            Cancel
          </button>
          <button type="submit" :disabled="modalLoading || success" class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-wait disabled:opacity-60">
            <span v-if="modalLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-white" aria-hidden="true"></span>
            {{ modalLoading ? "Saving…" : type === "create" ? "Add customer" : "Save changes" }}
          </button>
        </footer>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from "vue";
import InputField from "@/components/Shared/InputField.vue";
import { Customer } from "@/domain/entities/Customer";
import { customerRepository } from "@/domain/repositories/CustomerRepository";
import { isValidBankAccountNumber, isValidEmail, isValidPhoneNumber } from "@/utils/validators";

type CustomerField = "firstName" | "lastName" | "dateOfBirth" | "phoneNumber" | "email" | "bankAccountNumber";
type FieldConfig = { name: CustomerField; label: string; type?: string; inputmode?: "text" | "numeric" | "tel" | "email"; autocomplete?: string; placeholder?: string; hint?: string };

const props = defineProps<{ customer: Customer; type: "create" | "edit" }>();
const emit = defineEmits<{
  (event: "updateCustomer", payload: { key: CustomerField; value: string }): void;
  (event: "updateShowModal", status: boolean): void;
}>();

const titleId = "customer-form-title";
const modalLoading = customerRepository.modalLoading;
const errors = reactive<Partial<Record<CustomerField, string>>>({});
const formMessage = ref("");
const success = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | undefined;

const fields: FieldConfig[] = [
  { name: "firstName", label: "First name", autocomplete: "given-name" },
  { name: "lastName", label: "Last name", autocomplete: "family-name" },
  { name: "dateOfBirth", label: "Date of birth", type: "date", autocomplete: "bday" },
  { name: "phoneNumber", label: "Phone number", type: "tel", inputmode: "tel", autocomplete: "tel", placeholder: "+1 555 123 4567", hint: "Include the country code." },
  { name: "email", label: "Email address", type: "email", inputmode: "email", autocomplete: "email", placeholder: "name@example.com" },
  { name: "bankAccountNumber", label: "Bank account number", inputmode: "numeric", autocomplete: "off", hint: "Use 8–20 digits. Only the last four digits appear in the list." },
];

const close = () => emit("updateShowModal", false);

const updateCustomerValue = (key: CustomerField, value: string) => {
  formMessage.value = "";
  emit("updateCustomer", { key, value });
};

const validateField = (field: CustomerField): string => {
  const value = String(props.customer[field] || "").trim();
  let message = "";
  if (field === "firstName" || field === "lastName") {
    if (!value) message = "Enter a name.";
    else if (value.length > 100) message = "Use 100 characters or fewer.";
  } else if (field === "dateOfBirth") {
    const date = new Date(`${value}T00:00:00Z`);
    if (!value || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) message = "Enter a valid date.";
  } else if (field === "phoneNumber" && !isValidPhoneNumber(value)) {
    message = "Enter a valid phone number with country code.";
  } else if (field === "email" && !isValidEmail(value)) {
    message = "Enter a valid email address.";
  } else if (field === "bankAccountNumber" && !isValidBankAccountNumber(value)) {
    message = "Enter 8–20 digits.";
  }
  if (message) errors[field] = message;
  else delete errors[field];
  return message;
};

const save = async () => {
  const invalid = fields.map((field) => validateField(field.name)).find(Boolean);
  if (invalid) {
    formMessage.value = "Check the highlighted fields and try again.";
    return;
  }

  formMessage.value = "";
  try {
    if (props.type === "create") await customerRepository.addCustomer(props.customer);
    else await customerRepository.updateCustomer(props.customer);
    success.value = true;
    formMessage.value = props.type === "create" ? "Customer added." : "Changes saved.";
    closeTimer = setTimeout(close, 700);
  } catch (error) {
    formMessage.value = error instanceof Error ? error.message : "Could not save this customer.";
  }
};

onBeforeUnmount(() => {
  if (closeTimer) clearTimeout(closeTimer);
});
</script>
