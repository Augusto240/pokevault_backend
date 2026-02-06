<template>
  <div class="space-y-6">
    <!-- Welcome banner -->
    <div class="card-pokemon bg-gradient-to-r from-pokeblue to-pokeblue-dark p-6 text-white relative overflow-hidden !border-0">
      <div class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-15">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-16 h-16 image-pixelated pokefloat" style="animation-delay: 0s;" />
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png" class="w-12 h-12 image-pixelated pokefloat mt-4" style="animation-delay: 0.5s;" />
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png" class="w-14 h-14 image-pixelated pokefloat" style="animation-delay: 1s;" />
      </div>
      <div class="relative z-10">
        <h1 class="font-pixel text-xs leading-relaxed">Bem-vindo ao PokéVault!</h1>
        <p class="text-blue-200/80 mt-2 text-sm">Centro de Distribuição — Visão geral do estoque e movimentações</p>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total de Itens"
        :value="stats.total_itens"
        subtitle="Cadastrados no sistema"
        :sprite="sprites.ultraBall"
        color="blue"
        :loading="loadingStats"
      />
      <StatsCard
        title="Estoque Crítico"
        :value="stats.itens_criticos"
        subtitle="Itens abaixo do limite"
        :sprite="sprites.xAttack"
        color="red"
        :loading="loadingStats"
        :pulse="stats.itens_criticos > 0"
      />
      <StatsCard
        title="Movimentações Hoje"
        :value="stats.movimentacoes_hoje"
        subtitle="Entradas e saídas"
        :sprite="sprites.rareCandy"
        color="yellow"
        :loading="loadingStats"
      />
      <StatsCard
        title="Categorias"
        :value="totalCategorias"
        subtitle="Tipos de suprimento"
        :sprite="sprites.oranBerry"
        color="green"
        :loading="loadingStats"
      />
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Estoque por categoria -->
      <div class="lg:col-span-2 card-pokemon p-6">
        <h3 class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <img :src="sprites.expShare" class="w-5 h-5 image-pixelated" />
          Estoque por Categoria
        </h3>
        <div v-if="loadingChart" class="flex items-center justify-center h-64">
          <div class="w-8 h-8 border-3 border-pokeblue border-t-transparent rounded-full pokespin"></div>
        </div>
        <div v-else class="h-64">
          <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
          <p v-else class="text-slate-400 text-sm text-center mt-20">Sem dados para exibir</p>
        </div>
      </div>

      <!-- Itens com estoque baixo -->
      <div class="card-pokemon p-6">
        <h3 class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <img :src="sprites.xAttack" class="w-5 h-5 image-pixelated" />
          Estoque Baixo
        </h3>
        <div v-if="loadingLow" class="flex items-center justify-center h-40">
          <div class="w-8 h-8 border-3 border-pokered border-t-transparent rounded-full pokespin"></div>
        </div>
        <div v-else-if="lowStockItems.length === 0" class="flex flex-col items-center justify-center h-40 text-slate-400">
          <img :src="sprites.fullRestore" class="w-10 h-10 image-pixelated mb-2 opacity-40" />
          <p class="text-sm">Nenhum item crítico!</p>
        </div>
        <ul v-else class="space-y-2 max-h-64 overflow-y-auto">
          <li
            v-for="item in lowStockItems"
            :key="item.id"
            class="flex items-center justify-between p-3 bg-red-50/60 border border-red-100 rounded-xl"
          >
            <div class="flex items-center gap-2.5">
              <SpriteIcon :name="item.nome" size="sm" />
              <div>
                <p class="text-sm font-medium text-slate-800">{{ item.nome }}</p>
                <p class="text-[10px] text-slate-400">{{ item.categoria_nome }}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
              {{ item.quantidade }}/{{ item.limite_minimo }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="card-pokemon p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <img :src="sprites.rareCandy" class="w-5 h-5 image-pixelated" />
          Movimentações Recentes
        </h3>
        <router-link to="/transacoes" class="text-xs text-pokeblue hover:underline font-medium">Ver todas →</router-link>
      </div>
      <div v-if="loadingTransacoes" class="flex items-center justify-center h-20">
        <div class="w-8 h-8 border-3 border-pokeyellow border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else-if="recentTransacoes.length === 0" class="text-center text-slate-400 py-8 text-sm">
        Nenhuma transação registrada ainda.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-[10px] text-slate-400 uppercase border-b border-slate-100">
              <th class="py-2 text-left font-semibold tracking-wider">Tipo</th>
              <th class="py-2 text-left font-semibold tracking-wider">Item</th>
              <th class="py-2 text-left font-semibold tracking-wider">Qtd</th>
              <th class="py-2 text-left font-semibold tracking-wider">Usuário</th>
              <th class="py-2 text-left font-semibold tracking-wider">Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in recentTransacoes" :key="t.id" class="border-b border-slate-50 table-row-hover">
              <td class="py-2.5">
                <span :class="[
                  'badge-pokemon',
                  t.tipo === 'ENTRADA' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ t.tipo === 'ENTRADA' ? '↓ Entrada' : '↑ Saída' }}
                </span>
              </td>
              <td class="py-2.5">
                <div class="flex items-center gap-2">
                  <SpriteIcon :name="t.item_nome" size="sm" />
                  <span class="font-medium text-slate-800">{{ t.item_nome }}</span>
                </div>
              </td>
              <td class="py-2.5 font-semibold" :class="t.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'">
                {{ t.tipo === 'ENTRADA' ? '+' : '-' }}{{ t.quantidade }}
              </td>
              <td class="py-2.5 text-slate-500">{{ t.usuario_nome || '—' }}</td>
              <td class="py-2.5 text-slate-400">{{ formatDate(t.data_hora) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- IA Analysis (Gerente only) -->
    <div v-if="authStore.isGerente" class="card-pokemon p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <img :src="sprites.masterBall" class="w-5 h-5 image-pixelated" />
          Análise de IA — Tendências
        </h3>
        <button
          @click="fetchIaAnalysis"
          :disabled="loadingIA"
          class="btn-pokemon text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 disabled:opacity-50"
        >
          <img :src="sprites.rareCandy" class="w-4 h-4 image-pixelated" />
          {{ loadingIA ? 'Analisando...' : 'Gerar Análise' }}
        </button>
      </div>
      <div v-if="loadingIA" class="flex items-center justify-center py-8">
        <div class="w-8 h-8 border-3 border-pokeyellow border-t-transparent rounded-full pokespin"></div>
        <span class="ml-3 text-sm text-slate-500">Consultando Gemini...</span>
      </div>
      <div v-else-if="iaAnalysis" class="prose prose-sm max-w-none text-slate-700 whitespace-pre-line bg-amber-50/50 border border-amber-100 rounded-xl p-4">
        {{ iaAnalysis }}
      </div>
      <div v-else-if="iaError" class="text-sm text-red-600 bg-red-50 p-4 rounded-xl">
        {{ iaError }}
      </div>
      <p v-else class="text-sm text-slate-400 text-center py-4">Clique em "Gerar Análise" para consultar a IA sobre tendências do estoque.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import StatsCard from '../components/StatsCard.vue'
import SpriteIcon from '../components/SpriteIcon.vue'
import { getSpriteBySlug } from '../utils/sprites'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const authStore = useAuthStore()

// Pre-computed sprite URLs
const sprites = {
  ultraBall: getSpriteBySlug('ultra-ball'),
  xAttack: getSpriteBySlug('x-attack'),
  rareCandy: getSpriteBySlug('rare-candy'),
  oranBerry: getSpriteBySlug('oran-berry'),
  expShare: getSpriteBySlug('exp-share'),
  masterBall: getSpriteBySlug('master-ball'),
  fullRestore: getSpriteBySlug('full-restore'),
}

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
      backgroundColor: '#0F172A',
      titleFont: { size: 12, family: 'Inter' },
      bodyFont: { size: 11, family: 'Inter' },
      cornerRadius: 8,
      padding: 10,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#F1F5F9' },
      ticks: { font: { size: 11, family: 'Inter' }, color: '#94A3B8' },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11, family: 'Inter' }, color: '#64748B' },
    },
  },
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
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
              'rgba(220, 38, 38, 0.75)',
              'rgba(124, 58, 237, 0.75)',
              'rgba(5, 150, 105, 0.75)',
              'rgba(67, 56, 202, 0.75)',
              'rgba(234, 88, 12, 0.75)',
              'rgba(236, 72, 153, 0.75)',
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
