<template>
  <div class="col-span-6 sm:col-span-3">
    <label
      for="first-name"
      class="flex items-center justify-between mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      <span>{{ label }}</span>
      <svg
        v-if="hasError !== null"
        :class="[
          'w-5 h-5 select-none mr-1',
          hasError ? 'text-red-500' : 'text-green-500',
        ]"
      >
        <use :href="`/icons.svg#${hasError ? 'warning' : 'check'}`"></use>
      </svg>
    </label>
    <input
      type="text"
      class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('update:blurValidate', label)"
      :placeholder="label === 'phoneNumber' ? 'Enter with country code' : ''"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    required: true,
  },
  hasError: {
    type: Boolean,
    default: null,
  },
});
</script>

<style scoped></style>
