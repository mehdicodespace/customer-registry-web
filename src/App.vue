<template>
  <main class="min-h-screen py-6 sm:py-10">
    <header v-if="!checkingSession && currentUser" class="mx-auto mb-8 flex w-11/12 max-w-7xl items-center justify-between">
      <a href="/" class="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100" aria-label="Customer Registry home">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm" aria-hidden="true">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M4 7.5h16M6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4Z" stroke="currentColor" stroke-width="1.6" />
            <path d="M8 12h3m-3 3h8" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" />
          </svg>
        </span>
        <span>
          <span class="block text-sm font-bold tracking-tight text-slate-900">Customer Registry</span>
          <span class="mt-0.5 block text-xs text-slate-500">Private records workspace</span>
        </span>
      </a>
      <div class="flex items-center gap-3">
        <p class="hidden text-sm text-slate-500 sm:block"><span class="sr-only">Signed in as </span>{{ currentUser.email }}</p>
        <button type="button" class="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200" @click="signOut">Sign out</button>
      </div>
    </header>

    <section v-if="checkingSession" class="mx-auto mt-12 w-11/12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-xl shadow-slate-900/5" role="status">
      Checking your session…
    </section>

    <template v-else-if="currentUser">
      <p v-if="pageError" role="alert" class="mx-auto mb-5 flex w-11/12 max-w-7xl items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
        <span>{{ pageError }}</span>
        <button class="ml-4 shrink-0 rounded-md px-3 py-2 font-semibold text-rose-900 underline underline-offset-2 hover:bg-rose-100" type="button" @click="retryLoad">Try again</button>
      </p>
      <customers-list v-else></customers-list>
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
