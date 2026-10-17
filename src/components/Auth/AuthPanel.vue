<template>
  <section class="mx-auto mt-8 w-11/12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
    <p class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Customer directory</p>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">
      {{ isRegistering ? "Create your account" : "Welcome back" }}
    </h1>
    <p class="mt-2 text-sm leading-6 text-slate-500">
      {{ isRegistering ? "Your customer records are private to your account." : "Sign in to manage your customer records." }}
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="submit">
      <div>
        <label for="auth-email" class="mb-2 block text-sm font-medium text-slate-700">Email address</label>
        <input id="auth-email" v-model.trim="email" type="email" autocomplete="email" required maxlength="254" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
      </div>
      <div>
        <label for="auth-password" class="mb-2 block text-sm font-medium text-slate-700">Password</label>
        <input id="auth-password" v-model="password" type="password" :autocomplete="isRegistering ? 'new-password' : 'current-password'" :minlength="isRegistering ? 12 : undefined" maxlength="128" required class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
        <p v-if="isRegistering" class="mt-2 text-xs text-slate-500">Use at least 12 characters.</p>
      </div>

      <p v-if="errorMessage" role="alert" class="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{{ errorMessage }}</p>

      <button type="submit" :disabled="loading" class="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-wait disabled:opacity-60">
        {{ loading ? "Please wait…" : isRegistering ? "Create account" : "Sign in" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-500">
      {{ isRegistering ? "Already have an account?" : "New to the directory?" }}
      <button type="button" class="font-semibold text-blue-700 hover:text-blue-800" @click="toggleMode">
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

const toggleMode = () => {
  isRegistering.value = !isRegistering.value;
  errorMessage.value = "";
};

const submit = async () => {
  loading.value = true;
  errorMessage.value = "";
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
</script>
