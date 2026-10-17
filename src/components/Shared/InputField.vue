<template>
  <div class="space-y-1.5">
    <label :for="props.name" class="block text-sm font-medium text-slate-700">
      {{ props.label }}
      <span class="text-rose-600" aria-hidden="true">*</span>
    </label>
    <input
      :id="props.name"
      :name="props.name"
      :type="props.type || 'text'"
      :value="props.modelValue"
      :required="props.required !== false"
      :inputmode="props.inputmode || 'text'"
      :autocomplete="props.autocomplete || 'off'"
      :aria-invalid="Boolean(props.errorMessage)"
      :aria-describedby="props.errorMessage ? `${props.name}-error` : props.hint ? `${props.name}-hint` : undefined"
      :placeholder="props.placeholder"
      class="min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:bg-slate-50"
      :class="props.errorMessage ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-100' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <p v-if="props.errorMessage" :id="`${props.name}-error`" class="text-xs text-rose-700" role="alert">{{ props.errorMessage }}</p>
    <p v-else-if="props.hint" :id="`${props.name}-hint`" class="text-xs text-slate-500">{{ props.hint }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  label: string;
  modelValue: string;
  type?: string;
  required?: boolean;
  inputmode?: "text" | "numeric" | "tel" | "email";
  autocomplete?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "blur"): void;
}>();
</script>
