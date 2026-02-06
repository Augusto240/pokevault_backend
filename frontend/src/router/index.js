import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'inventario',
        name: 'Inventario',
        component: () => import('../views/InventarioView.vue'),
      },
      {
        path: 'categorias',
        name: 'Categorias',
        component: () => import('../views/CategoriasView.vue'),
      },
      {
        path: 'transacoes',
        name: 'Transacoes',
        component: () => import('../views/TransacoesView.vue'),
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: () => import('../views/UsuariosView.vue'),
        meta: { requiresGerente: true },
      },
      {
        path: 'relatorios',
        name: 'Relatorios',
        component: () => import('../views/RelatoriosView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.public) {
    if (authStore.isAuthenticated) {
      return next('/')
    }
    return next()
  }

  if (to.matched.some((r) => r.meta.requiresAuth) && !authStore.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.requiresGerente && !authStore.isGerente) {
    return next('/')
  }

  next()
})

export default router
