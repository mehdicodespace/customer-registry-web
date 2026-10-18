<template>
  <section class="mx-auto mt-8 w-11/12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:p-10">
    <div class="mb-7 flex items-center gap-3">
      <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm" aria-hidden="true">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M4 7.5h16M6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4Z" stroke="currentColor" stroke-width="1.6" />
          <path d="M8 12h3m-3 3h8" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" />
        </svg>
      </span>
      <div>
      <p class="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Customer Registry</p>
      <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Private records workspace</p>
      </div>
    </div>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
      {{ isRegistering ? "Create your account" : "Welcome back" }}
    </h1>
    <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
      {{ isRegistering ? "Create an account to keep your customer records in one place." : "Sign in to manage your customer records." }}
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="submit">
      <div>
        <label for="auth-email" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
        <input id="auth-email" v-model.trim="email" type="email" autocomplete="email" required maxlength="254" class="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-950" />
      </div>
      <div>
        <label for="auth-password" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
        <input id="auth-password" v-model="password" type="password" :autocomplete="isRegistering ? 'new-password' : 'current-password'" :minlength="isRegistering ? 12 : undefined" maxlength="128" required class="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-950" />
        <p v-if="isRegistering" class="mt-2 text-xs text-slate-500 dark:text-slate-400">Use at least 12 characters.</p>
        <button v-else type="button" class="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200" :disabled="loading" @click="resetPassword">Forgot password?</button>
      </div>

      <p v-if="errorMessage" role="alert" class="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-rose-950/60 dark:text-rose-200">{{ errorMessage }}</p>
      <p v-if="statusMessage" role="status" class="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">{{ statusMessage }}</p>

      <button type="submit" :disabled="loading" class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-wait disabled:opacity-60">
        <span v-if="loading" aria-hidden="true" class="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-white"></span>
        {{ loading ? "Please wait…" : isRegistering ? "Create account" : "Sign in" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
      {{ isRegistering ? "Already registered?" : "New here?" }}
      <button type="button" class="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200" @click="toggleMode">
        {{ isRegistering ? "Sign in" : "Create an account" }}
      </button>
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthService, { AuthUser } from "@/services/AuthService";

const emit = defineEmits<{ (event: "authenticated", user: AuthUser): void }>();
const email = ref("");
const password = ref("");
const isRegistering = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const statusMessage = ref("");

const toggleMode = () => {
  isRegistering.value = !isRegistering.value;
  errorMessage.value = "";
  statusMessage.value = "";
};

const submit = async () => {
  loading.value = true;
  errorMessage.value = "";
  statusMessage.value = "";
  try {
    const user = isRegistering.value
      ? await AuthService.signUp(email.value, password.value)
      : await AuthService.signIn(email.value, password.value);
    emit("authenticated", user);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Could not sign in.";
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  if (!email.value) {
    errorMessage.value = "Enter your email address first.";
    return;
  }
  loading.value = true;
  errorMessage.value = "";
  statusMessage.value = "";
  try {
    await AuthService.sendPasswordReset(email.value);
    statusMessage.value = "If an account exists for this address, Firebase will send a password reset email.";
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Could not send a reset email.";
  } finally {
    loading.value = false;
  }
};
</script>
