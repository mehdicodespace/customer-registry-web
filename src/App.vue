<template>
  <section class="bg-dark-500">
    <customer-list></customer-list>
  </section>

  <customer-modal></customer-modal>

  <teleport to="body">
    <div
      class="bg-gray-800/90 fixed w-full h-full top-0 left-0 z-10 cursor-pointer hidden"
    ></div>
  </teleport>
</template>

<script setup lang="ts">
import CustomerList from "@/components/Customer/CustomerList.vue";
import CustomerModal from "@/components/Customer/CustomerModal.vue";
</script>

<style></style>
