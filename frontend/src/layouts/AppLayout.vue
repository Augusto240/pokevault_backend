<template>
  <div class="min-h-screen bg-surface flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-white transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-[72px]',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="PokéBall"
            class="w-8 h-8 image-pixelated drop-shadow-md pokebounce"
          />
        </div>
        <transition name="fade">
          <div v-if="sidebarOpen" class="overflow-hidden whitespace-nowrap">
            <h1 class="font-pixel text-[10px] text-white tracking-tight leading-none">PokéVault</h1>
            <p class="text-[9px] text-slate-500 mt-1.5 uppercase tracking-widest font-medium">Supply HQ</p>
          </div>
        </transition>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 py-4 space-y-0.5 overflow-y-auto px-2">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-sidebar-hover hover:text-white transition-all duration-200 group',
          ]"
          :active-class="'nav-link-active !text-white'"
        >
          <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img
              :src="item.sprite"
              :alt="item.label"
              class="w-6 h-6 image-pixelated drop-shadow-sm group-hover:scale-110 transition-transform duration-200"
            />
          </div>
          <transition name="fade">
            <span v-if="sidebarOpen" class="text-sm font-medium">{{ item.label }}</span>
          </transition>
        </router-link>
      </nav>

      <!-- User profile footer -->
      <div class="border-t border-white/5 p-3">
        <div class="flex items-center gap-3 px-1">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-pokeblue to-pokeblue-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
            {{ userInitials }}
          </div>
          <transition name="fade">
            <div v-if="sidebarOpen" class="overflow-hidden flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ authStore.userName }}</p>
              <p class="text-[10px] text-slate-500 flex items-center gap-1">
                <span :class="authStore.isGerente ? 'text-pokeyellow' : 'text-pokeblue-light'">{{ authStore.user?.role === 'GERENTE' ? '★' : '◆' }}</span>
                {{ authStore.user?.role }}
              </p>
            </div>
          </transition>
        </div>
        <button
          v-if="sidebarOpen"
          @click="handleLogout"
          class="mt-3 w-full flex items-center gap-2 justify-center text-xs text-slate-500 hover:text-pokered-light py-2 rounded-xl border border-white/5 hover:border-pokered/30 hover:bg-pokered/5 transition-all"
        >
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div :class="['flex-1 transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-[72px]']">
      <!-- Top bar -->
      <header class="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-14 flex items-center justify-between px-6">
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <Bars3Icon class="w-5 h-5" />
          </button>
          <div>
            <h2 class="text-sm font-semibold text-slate-800">{{ currentPageTitle }}</h2>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            Online
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6 bg-pokeball-pattern min-h-[calc(100vh-3.5rem)]">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getSpriteBySlug } from '../utils/sprites'
import {
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(true)

const navItems = computed(() => {
  const items = [
    { to: '/', label: 'Dashboard', sprite: getSpriteBySlug('poke-ball') },
    { to: '/inventario', label: 'Inventário', sprite: getSpriteBySlug('ultra-ball') },
    { to: '/categorias', label: 'Categorias', sprite: getSpriteBySlug('oran-berry') },
    { to: '/transacoes', label: 'Transações', sprite: getSpriteBySlug('rare-candy') },
    { to: '/relatorios', label: 'Relatórios', sprite: getSpriteBySlug('exp-share') },
  ]
  if (authStore.isGerente) {
    items.splice(4, 0, { to: '/usuarios', label: 'Usuários', sprite: getSpriteBySlug('lucky-egg') })
  }
  return items
})

const currentPageTitle = computed(() => {
  const titles = {
    Dashboard: 'Dashboard',
    Inventario: 'Gestão de Inventário',
    Categorias: 'Categorias',
    Transacoes: 'Transações',
    Usuarios: 'Gestão de Usuários',
    Relatorios: 'Relatórios',
  }
  return titles[route.name] || 'PokéVault'
})

const userInitials = computed(() => {
  if (!authStore.user) return '?'
  const f = authStore.user.first_name?.[0] || ''
  const l = authStore.user.last_name?.[0] || ''
  return (f + l).toUpperCase() || authStore.user.email?.[0]?.toUpperCase() || '?'
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
