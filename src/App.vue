<template>
  <main class="min-h-screen py-6 sm:py-10">
    <header v-if="!checkingSession" class="mx-auto mb-8 flex w-11/12 max-w-7xl items-center justify-between">
      <a v-if="currentUser" href="/" class="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100" aria-label="Customer Registry home">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm" aria-hidden="true">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M4 7.5h16M6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4Z" stroke="currentColor" stroke-width="1.6" />
            <path d="M8 12h3m-3 3h8" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" />
          </svg>
        </span>
        <span>
          <span class="block text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Customer Registry</span>
          <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Private records workspace</span>
        </span>
      </a>
      <div class="flex items-center gap-3">
        <p v-if="currentUser" class="hidden text-sm text-slate-500 dark:text-slate-400 sm:block"><span class="sr-only">Signed in as </span>{{ currentUser.email }}</p>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-slate-800 dark:focus:ring-slate-700"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" />
          </svg>
          <svg v-else aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
          </svg>
        </button>
        <button v-if="currentUser" type="button" class="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-700" @click="signOut">Sign out</button>
      </div>
    </header>

    <section v-if="checkingSession" class="mx-auto mt-12 w-11/12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400" role="status">
      Checking your session…
    </section>

    <template v-else-if="currentUser">
      <p v-if="pageError" role="alert" class="mx-auto mb-5 flex w-11/12 max-w-7xl items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-200">
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
const isDark = ref(false);

const applyTheme = (dark: boolean) => {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("customer-registry-theme", dark ? "dark" : "light");
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
};

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

const signOut = async () => {
  await AuthService.signOut();
  customerRepository.clear();
  currentUser.value = null;
  pageError.value = "";
};

onMounted(async () => {
  const savedTheme = localStorage.getItem("customer-registry-theme");
  isDark.value = savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(isDark.value);
  try {
    currentUser.value = await AuthService.getCurrentUser();
    if (currentUser.value) await loadCustomers();
  } catch (error) {
    pageError.value = error instanceof Error ? error.message : "Could not restore your session.";
  } finally {
    checkingSession.value = false;
  }
});
</script>
