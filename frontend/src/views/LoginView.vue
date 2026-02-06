<template>
  <div class="min-h-screen bg-pokemart-gradient flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Decorative pokéballs in background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -left-20 w-64 h-64 opacity-5">
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="white"/><rect x="0" y="47" width="100" height="6" fill="white"/><circle cx="50" cy="50" r="12" fill="white"/></svg>
      </div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 opacity-5">
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="white"/><rect x="0" y="47" width="100" height="6" fill="white"/><circle cx="50" cy="50" r="12" fill="white"/></svg>
      </div>
      <div class="absolute top-1/3 right-1/4 w-32 h-32 opacity-[0.03]">
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="white"/><rect x="0" y="47" width="100" height="6" fill="white"/><circle cx="50" cy="50" r="12" fill="white"/></svg>
      </div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Header card -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 border border-white/20">
          <svg viewBox="0 0 100 100" class="w-12 h-12">
            <circle cx="50" cy="50" r="48" fill="#DC2626" stroke="white" stroke-width="3"/>
            <path d="M 2 50 A 48 48 0 0 0 98 50" fill="white" stroke="white" stroke-width="3"/>
            <rect x="0" y="47" width="100" height="6" fill="white" opacity="0.3"/>
            <circle cx="50" cy="50" r="14" fill="white" stroke="white" stroke-width="3"/>
            <circle cx="50" cy="50" r="7" fill="#333"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">PokéVault</h1>
        <p class="text-blue-200 text-sm mt-1">Sistema Corporativo de Suprimentos Pokémon</p>
      </div>

      <!-- Login form -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Acesso ao Sistema</h2>
          <p class="text-sm text-gray-500 mt-1">Entre com suas credenciais corporativas</p>
        </div>

        <!-- Error message -->
        <transition name="slide-up">
          <div v-if="error" class="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            {{ error }}
          </div>
        </transition>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                placeholder="trainer@pokevault.com"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pokeblue focus:border-transparent transition-all text-sm pl-11"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
              </svg>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pokeblue focus:border-transparent transition-all text-sm pl-11 pr-11"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-pokeblue hover:bg-pokeblue-dark text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pokeblue/25 hover:shadow-pokeblue/40"
          >
            <svg v-if="loading" class="w-5 h-5 pokespin" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="8" stroke-dasharray="80 200" stroke-linecap="round"/>
            </svg>
            <span v-if="!loading">Entrar no PokéVault</span>
            <span v-else>Autenticando...</span>
          </button>
        </form>

        <!-- Footer info -->
        <div class="mt-6 pt-5 border-t border-gray-100 text-center">
          <p class="text-xs text-gray-400">PokéVault v1.0 — Gotta Code 'Em All!</p>
          <p class="text-[10px] text-gray-300 mt-1">Projeto Integrador — IFRN 2025</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'E-mail ou senha incorretos. Tente novamente.'
    } else if (err.response?.data?.detail) {
      error.value = err.response.data.detail
    } else {
      error.value = 'Erro ao conectar ao servidor. Verifique sua conexão.'
    }
  } finally {
    loading.value = false
  }
}
</script>
