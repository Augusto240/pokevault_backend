<template>
  <div class="min-h-screen bg-pokemart-gradient flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated floating sprites in background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
           class="absolute top-[10%] left-[8%] w-12 h-12 opacity-[0.08] image-pixelated pokefloat" style="animation-delay: 0s;" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png"
           class="absolute top-[25%] right-[12%] w-10 h-10 opacity-[0.06] image-pixelated pokefloat" style="animation-delay: 1s;" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png"
           class="absolute bottom-[20%] left-[15%] w-14 h-14 opacity-[0.07] image-pixelated pokefloat" style="animation-delay: 2s;" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png"
           class="absolute top-[60%] right-[8%] w-8 h-8 opacity-[0.06] image-pixelated pokefloat" style="animation-delay: 0.5s;" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png"
           class="absolute bottom-[10%] right-[30%] w-10 h-10 opacity-[0.05] image-pixelated pokefloat" style="animation-delay: 1.5s;" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
           class="absolute top-[15%] left-[45%] w-8 h-8 opacity-[0.04] image-pixelated pokefloat" style="animation-delay: 3s;" />
      <!-- Large decorative Pokéball -->
      <div class="absolute -bottom-24 -right-24 w-80 h-80 opacity-[0.04]">
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="white"/><rect x="0" y="47" width="100" height="6" fill="white"/><circle cx="50" cy="50" r="12" fill="white"/></svg>
      </div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-5 border border-white/20 pokebounce">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="PokéBall"
            class="w-12 h-12 image-pixelated drop-shadow-lg"
          />
        </div>
        <h1 class="font-pixel text-xl text-white tracking-tight leading-relaxed">PokéVault</h1>
        <p class="text-blue-200/80 text-sm mt-2 font-light">Centro de Distribuição de Suprimentos</p>
      </div>

      <!-- Login form card -->
      <div class="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
        <!-- Decorative top bar -->
        <div class="h-1.5 bg-gradient-to-r from-pokered via-pokeyellow to-pokeblue"></div>
        
        <div class="p-8">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-800">Acesso ao Sistema</h2>
            <p class="text-sm text-slate-400 mt-1">Insira suas credenciais corporativas</p>
          </div>

          <!-- Error message -->
          <transition name="slide-up">
            <div v-if="error" class="mb-5 flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png" class="w-5 h-5 image-pixelated flex-shrink-0" />
              {{ error }}
            </div>
          </transition>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">E-mail</label>
              <div class="relative">
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="trainer@pokevault.com"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pokeblue/40 focus:border-pokeblue focus:bg-white transition-all text-sm pl-11"
                />
                <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Senha</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pokeblue/40 focus:border-pokeblue focus:bg-white transition-all text-sm pl-11 pr-11"
                />
                <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-pokemon bg-pokeblue hover:bg-pokeblue-dark text-white justify-center py-3.5 rounded-xl shadow-lg shadow-pokeblue/25 hover:shadow-pokeblue/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg v-if="loading" class="w-5 h-5 pokespin" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="8" stroke-dasharray="80 200" stroke-linecap="round"/>
              </svg>
              <img v-if="!loading" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-5 h-5 image-pixelated" />
              <span>{{ loading ? 'Autenticando...' : 'Entrar no Sistema' }}</span>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-6 pt-5 border-t border-slate-100 text-center">
            <p class="text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" class="w-4 h-4 image-pixelated opacity-40" />
              PokéVault v2.0 — Gotta Stock 'Em All!
            </p>
            <p class="text-[10px] text-slate-300 mt-1">Projeto Integrador — IFRN 2025</p>
          </div>
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
