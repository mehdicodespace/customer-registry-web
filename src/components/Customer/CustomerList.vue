<template>
  <div class="bg-red-500">{{customer}}</div>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import { Customer } from '@/domain/entities/Customer';
const customer = reactive(new Customer({}));
customer.firstName = "Mehdi"
</script>

<style lang="scss" scoped></style>
