<template>
  <div v-for="customer in allCustomers" :key="`${customer.firstName}-${customer.lastName}`">
  {{ customer.firstName }} {{ customer.lastName }}
  </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import { Customer } from '@/domain/entities/Customer';
import { customerRepository } from '@/domain/repositories/CustomerRepository';

const customer1 = reactive(new Customer({}));
customer1.firstName = 'Mehdi'
customer1.lastName = 'Rafiei'

const customer2 = reactive(new Customer({}))
customer2.firstName = "Mason"
customer2.lastName = "Chase"

const addCustomer = () => {
  customerRepository.addCustomer(customer1);
  customerRepository.addCustomer(customer2);
};

addCustomer()
const allCustomers = customerRepository.getAllCustomers();
</script>

<style lang="scss" scoped></style>
