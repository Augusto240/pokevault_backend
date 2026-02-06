<template>
  <div class="min-h-screen bg-surface flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div class="w-10 h-10 flex-shrink-0 relative">
          <!-- Pokéball SVG icon -->
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="#DC2626" stroke="#333" stroke-width="4"/>
            <rect x="0" y="46" width="100" height="8" fill="#333"/>
            <circle cx="50" cy="50" r="48" fill="none" stroke="#333" stroke-width="4"/>
            <path d="M 0 50 Q 0 50 0 50 A 48 48 0 0 1 100 50 L 100 50 Z" fill="#DC2626"/>
            <path d="M 0 50 Q 0 50 0 50 A 48 48 0 0 0 100 50 L 100 50 Z" fill="white"/>
            <rect x="0" y="47" width="100" height="6" fill="#333"/>
            <circle cx="50" cy="50" r="16" fill="white" stroke="#333" stroke-width="4"/>
            <circle cx="50" cy="50" r="8" fill="#333"/>
          </svg>
        </div>
        <transition name="fade">
          <div v-if="sidebarOpen" class="overflow-hidden whitespace-nowrap">
            <h1 class="text-lg font-bold tracking-tight">PokéVault</h1>
            <p class="text-[10px] text-gray-400 -mt-1 uppercase tracking-widest">Supply HQ</p>
          </div>
        </transition>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors"
          active-class="!bg-pokeblue !text-white"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <transition name="fade">
            <span v-if="sidebarOpen" class="text-sm font-medium">{{ item.label }}</span>
          </transition>
        </router-link>
      </nav>

      <!-- User profile footer -->
      <div class="border-t border-white/10 p-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-pokeblue flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {{ userInitials }}
          </div>
          <transition name="fade">
            <div v-if="sidebarOpen" class="overflow-hidden">
              <p class="text-sm font-medium text-white truncate">{{ authStore.userName }}</p>
              <p class="text-xs text-gray-400">{{ authStore.user?.role }}</p>
            </div>
          </transition>
        </div>
        <button
          v-if="sidebarOpen"
          @click="handleLogout"
          class="mt-3 w-full flex items-center gap-2 justify-center text-xs text-gray-400 hover:text-pokered-light py-1.5 rounded border border-white/10 hover:border-pokered/40 transition-colors"
        >
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div :class="['flex-1 transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20']">
      <!-- Top bar -->
      <header class="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-6">
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <Bars3Icon class="w-5 h-5" />
          </button>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">{{ currentPageTitle }}</h2>
            <p class="text-xs text-gray-400">PokéMart Distribution Center</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
            <span class="w-2 h-2 bg-success rounded-full"></span>
            Sistema Online
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6 bg-pokeball-pattern min-h-[calc(100vh-4rem)]">
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
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  ArrowsRightLeftIcon,
  UsersIcon,
  ChartBarIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(true)

const navItems = computed(() => {
  const items = [
    { to: '/', label: 'Dashboard', icon: HomeIcon },
    { to: '/inventario', label: 'Inventário', icon: CubeIcon },
    { to: '/categorias', label: 'Categorias', icon: TagIcon },
    { to: '/transacoes', label: 'Transações', icon: ArrowsRightLeftIcon },
    { to: '/relatorios', label: 'Relatórios', icon: ChartBarIcon },
  ]
  if (authStore.isGerente) {
    items.splice(4, 0, { to: '/usuarios', label: 'Usuários', icon: UsersIcon })
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
