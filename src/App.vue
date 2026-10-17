<template>
  <main class="min-h-screen py-8 sm:py-12">
    <section v-if="checkingSession" class="mx-auto mt-12 w-11/12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-xl shadow-slate-900/5">
      Checking your session…
    </section>

    <template v-else-if="currentUser">
      <header class="mx-auto mb-4 flex w-11/12 max-w-7xl items-center justify-between">
        <p class="text-sm text-slate-500">Signed in as <span class="font-medium text-slate-700">{{ currentUser.email }}</span></p>
        <button type="button" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="signOut">Sign out</button>
      </header>
      <p v-if="pageError" role="alert" class="mx-auto mb-4 flex w-11/12 max-w-7xl items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        <span>{{ pageError }}</span>
        <button class="ml-4 font-semibold underline" type="button" @click="retryLoad">Try again</button>
      </p>
      <customers-list></customers-list>
    </template>

    <auth-panel v-else @authenticated="handleAuthenticated"></auth-panel>
    <p v-if="!checkingSession && pageError && !currentUser" role="alert" class="mx-auto mt-4 w-11/12 max-w-md rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ pageError }}</p>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AuthPanel from "@/components/Auth/AuthPanel.vue";
import CustomersList from "@/components/Customer/CustomersList.vue";
import AuthService, { AuthUser } from "@/services/AuthService";
import { customerRepository } from "@/domain/repositories/CustomerRepository";

const currentUser = ref<AuthUser | null>(null);
const checkingSession = ref(true);
const pageError = ref("");

const loadCustomers = async () => {
  pageError.value = "";
  try {
    await customerRepository.loadCustomers();
  } catch (error) {
    pageError.value = error instanceof Error ? error.message : "Could not load customer records.";
  }
};

const handleAuthenticated = async (user: AuthUser) => {
  currentUser.value = user;
  await loadCustomers();
};

const retryLoad = () => loadCustomers();

const signOut = () => {
  AuthService.signOut();
  customerRepository.clear();
  currentUser.value = null;
  pageError.value = "";
};

onMounted(async () => {
  if (!AuthService.getToken()) {
    checkingSession.value = false;
    return;
  }
  try {
    currentUser.value = await AuthService.getCurrentUser();
    await loadCustomers();
  } catch (error) {
    pageError.value = error instanceof Error ? error.message : "Could not restore your session.";
  } finally {
    checkingSession.value = false;
  }
});
</script>
