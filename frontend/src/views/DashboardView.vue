<template>
  <div class="space-y-6">
    <!-- Welcome banner -->
    <div class="bg-gradient-to-r from-pokeblue to-pokeblue-dark rounded-2xl p-6 text-white relative overflow-hidden">
      <div class="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="white"/>
          <rect x="0" y="47" width="100" height="6" fill="currentColor"/>
          <circle cx="50" cy="50" r="12" fill="currentColor"/>
        </svg>
      </div>
      <div class="relative z-10">
        <h1 class="text-2xl font-bold">Bem-vindo ao PokéVault!</h1>
        <p class="text-blue-200 mt-1">Centro de Distribuição de Suprimentos Pokémon — Visão geral do sistema</p>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total de Itens"
        :value="stats.total_itens"
        subtitle="Cadastrados no sistema"
        icon="cube"
        color="blue"
        :loading="loadingStats"
      />
      <StatsCard
        title="Estoque Crítico"
        :value="stats.itens_criticos"
        subtitle="Itens abaixo do limite"
        icon="alert"
        color="red"
        :loading="loadingStats"
        :pulse="stats.itens_criticos > 0"
      />
      <StatsCard
        title="Movimentações Hoje"
        :value="stats.movimentacoes_hoje"
        subtitle="Entradas e saídas"
        icon="arrows"
        color="yellow"
        :loading="loadingStats"
      />
      <StatsCard
        title="Categorias"
        :value="totalCategorias"
        subtitle="Tipos de suprimento"
        icon="tag"
        color="green"
        :loading="loadingStats"
      />
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Estoque por categoria -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <ChartBarIcon class="w-5 h-5 text-pokeblue" />
          Estoque por Categoria
        </h3>
        <div v-if="loadingChart" class="flex items-center justify-center h-64">
          <div class="w-8 h-8 border-3 border-pokeblue border-t-transparent rounded-full pokespin"></div>
        </div>
        <div v-else class="h-64">
          <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
          <p v-else class="text-gray-400 text-sm text-center mt-20">Sem dados para exibir</p>
        </div>
      </div>

      <!-- Itens com estoque baixo -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <ExclamationTriangleIcon class="w-5 h-5 text-pokered" />
          Estoque Baixo
        </h3>
        <div v-if="loadingLow" class="flex items-center justify-center h-40">
          <div class="w-8 h-8 border-3 border-pokered border-t-transparent rounded-full pokespin"></div>
        </div>
        <div v-else-if="lowStockItems.length === 0" class="flex flex-col items-center justify-center h-40 text-gray-400">
          <CheckCircleIcon class="w-10 h-10 text-success mb-2" />
          <p class="text-sm">Nenhum item crítico!</p>
        </div>
        <ul v-else class="space-y-2 max-h-64 overflow-y-auto">
          <li
            v-for="item in lowStockItems"
            :key="item.id"
            class="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl"
          >
            <div>
              <p class="text-sm font-medium text-gray-800">{{ item.nome }}</p>
              <p class="text-xs text-gray-500">{{ item.categoria_nome }}</p>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                {{ item.quantidade }} / {{ item.limite_minimo }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <ArrowsRightLeftIcon class="w-5 h-5 text-pokeyellow" />
          Movimentações Recentes
        </h3>
        <router-link to="/transacoes" class="text-xs text-pokeblue hover:underline font-medium">Ver todas →</router-link>
      </div>
      <div v-if="loadingTransacoes" class="flex items-center justify-center h-20">
        <div class="w-8 h-8 border-3 border-pokeyellow border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else-if="recentTransacoes.length === 0" class="text-center text-gray-400 py-8 text-sm">
        Nenhuma transação registrada ainda.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs text-gray-500 uppercase border-b border-gray-100">
              <th class="py-2 text-left font-medium">Tipo</th>
              <th class="py-2 text-left font-medium">Item</th>
              <th class="py-2 text-left font-medium">Qtd</th>
              <th class="py-2 text-left font-medium">Usuário</th>
              <th class="py-2 text-left font-medium">Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in recentTransacoes" :key="t.id" class="border-b border-gray-50 table-row-hover">
              <td class="py-2.5">
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
                  t.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ t.tipo === 'ENTRADA' ? '↓ Entrada' : '↑ Saída' }}
                </span>
              </td>
              <td class="py-2.5 font-medium text-gray-800">{{ t.item_nome }}</td>
              <td class="py-2.5 text-gray-600">{{ t.quantidade }}</td>
              <td class="py-2.5 text-gray-500">{{ t.usuario_nome || '—' }}</td>
              <td class="py-2.5 text-gray-400">{{ formatDate(t.data_hora) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- IA Analysis (Gerente only) -->
    <div v-if="authStore.isGerente" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <SparklesIcon class="w-5 h-5 text-pokeyellow" />
          Análise de IA — Tendências
        </h3>
        <button
          @click="fetchIaAnalysis"
          :disabled="loadingIA"
          class="text-xs bg-pokeyellow/10 text-pokeyellow-dark hover:bg-pokeyellow/20 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {{ loadingIA ? 'Analisando...' : 'Gerar Análise' }}
        </button>
      </div>
      <div v-if="loadingIA" class="flex items-center justify-center py-8">
        <div class="w-8 h-8 border-3 border-pokeyellow border-t-transparent rounded-full pokespin"></div>
        <span class="ml-3 text-sm text-gray-500">Consultando Gemini...</span>
      </div>
      <div v-else-if="iaAnalysis" class="prose prose-sm max-w-none text-gray-700 whitespace-pre-line bg-yellow-50 border border-yellow-100 rounded-xl p-4">
        {{ iaAnalysis }}
      </div>
      <div v-else-if="iaError" class="text-sm text-red-600 bg-red-50 p-4 rounded-xl">
        {{ iaError }}
      </div>
      <p v-else class="text-sm text-gray-400 text-center py-4">Clique em "Gerar Análise" para consultar a IA sobre tendências do estoque.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import StatsCard from '../components/StatsCard.vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const authStore = useAuthStore()

const stats = ref({ total_itens: 0, itens_criticos: 0, movimentacoes_hoje: 0 })
const totalCategorias = ref(0)
const loadingStats = ref(true)

const lowStockItems = ref([])
const loadingLow = ref(true)

const recentTransacoes = ref([])
const loadingTransacoes = ref(true)

const chartData = ref(null)
const loadingChart = ref(true)

const iaAnalysis = ref('')
const iaError = ref('')
const loadingIA = ref(false)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E40AF',
      titleFont: { size: 12 },
      bodyFont: { size: 11 },
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#F3F4F6' },
      ticks: { font: { size: 11 } },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
  },
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function fetchData() {
  try {
    const [statsRes, categoriasRes, lowRes, transRes] = await Promise.all([
      api.get('/dashboard/stats/'),
      api.get('/categorias/'),
      api.get('/itens/estoque_baixo/'),
      api.get('/transacoes/'),
    ])

    stats.value = statsRes.data
    totalCategorias.value = categoriasRes.data.length
    lowStockItems.value = lowRes.data
    recentTransacoes.value = transRes.data.slice(0, 8)

    // Build chart from categories + items
    const categorias = categoriasRes.data
    const itensRes = await api.get('/itens/')
    const itens = itensRes.data

    const catMap = {}
    categorias.forEach((c) => { catMap[c.id] = { nome: c.nome, total: 0 } })
    itens.forEach((item) => {
      if (catMap[item.categoria]) {
        catMap[item.categoria].total += item.quantidade
      }
    })

    const labels = Object.values(catMap).map((c) => c.nome)
    const data = Object.values(catMap).map((c) => c.total)

    if (labels.length > 0) {
      chartData.value = {
        labels,
        datasets: [
          {
            label: 'Quantidade em Estoque',
            data,
            backgroundColor: [
              'rgba(220, 38, 38, 0.8)',
              'rgba(30, 64, 175, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(5, 150, 105, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
            ],
            borderRadius: 8,
            barThickness: 40,
          },
        ],
      }
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  } finally {
    loadingStats.value = false
    loadingLow.value = false
    loadingTransacoes.value = false
    loadingChart.value = false
  }
}

async function fetchIaAnalysis() {
  loadingIA.value = true
  iaAnalysis.value = ''
  iaError.value = ''
  try {
    const res = await api.post('/dashboard/ia-analysis/')
    if (res.data.error) {
      iaError.value = res.data.error
    } else {
      iaAnalysis.value = res.data.analise
    }
  } catch (err) {
    iaError.value = err.response?.data?.error || 'Erro ao gerar análise de IA.'
  } finally {
    loadingIA.value = false
  }
}

onMounted(fetchData)
</script>
