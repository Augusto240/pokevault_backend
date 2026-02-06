<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png" class="w-8 h-8 image-pixelated" />
        <div>
          <h2 class="text-xl font-bold text-slate-800">Relatórios do PokéVault</h2>
          <p class="text-sm text-slate-400">Visão analítica de estoque e movimentações</p>
        </div>
      </div>
      <button
        @click="refreshData"
        :disabled="loading"
        class="btn-pokemon bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
      >
        <ArrowPathIcon class="w-4 h-4" :class="{ 'pokespin': loading }" />
        Atualizar Dados
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card-pokemon p-5">
        <div class="flex items-center gap-2 mb-2">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" class="w-5 h-5 image-pixelated" />
          <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Valor Total em Estoque</p>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ formatCurrency(valorTotalEstoque) }}</p>
        <p class="text-xs text-slate-400 mt-1">Soma de (quantidade x preço unitário)</p>
      </div>
      <div class="card-pokemon p-5">
        <div class="flex items-center gap-2 mb-2">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png" class="w-5 h-5 image-pixelated" />
          <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total de Movimentações</p>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ transacoes.length }}</p>
        <p class="text-xs text-slate-400 mt-1">Entradas + saídas registradas</p>
      </div>
      <div class="card-pokemon p-5">
        <div class="flex items-center gap-2 mb-2">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png" class="w-5 h-5 image-pixelated" />
          <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total Entradas</p>
        </div>
        <p class="text-2xl font-bold text-emerald-600">{{ totalEntradas }}</p>
        <p class="text-xs text-slate-400 mt-1">Itens repostos</p>
      </div>
      <div class="card-pokemon p-5">
        <div class="flex items-center gap-2 mb-2">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png" class="w-5 h-5 image-pixelated" />
          <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total Saídas</p>
        </div>
        <p class="text-2xl font-bold text-red-600">{{ totalSaidas }}</p>
        <p class="text-xs text-slate-400 mt-1">Itens vendidos/distribuídos</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Transactions by type (Pie) -->
      <div class="card-pokemon p-6">
        <div class="flex items-center gap-2 mb-4">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-5 h-5 image-pixelated" />
          <h3 class="text-sm font-semibold text-slate-700">Proporção Entradas vs Saídas</h3>
        </div>
        <div class="h-64">
          <Doughnut v-if="pieData" :data="pieData" :options="pieOptions" />
          <div v-else class="flex items-center justify-center h-full text-slate-300 text-sm">Sem dados</div>
        </div>
      </div>

      <!-- Top items by stock -->
      <div class="card-pokemon p-6">
        <div class="flex items-center gap-2 mb-4">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png" class="w-5 h-5 image-pixelated" />
          <h3 class="text-sm font-semibold text-slate-700">Top 10 — Itens por Quantidade em Estoque</h3>
        </div>
        <div class="h-64">
          <Bar v-if="topItemsData" :data="topItemsData" :options="barOptions" />
          <div v-else class="flex items-center justify-center h-full text-slate-300 text-sm">Sem dados</div>
        </div>
      </div>
    </div>

    <!-- Movimentações por item -->
    <div class="card-pokemon p-6">
      <div class="flex items-center gap-2 mb-4">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png" class="w-5 h-5 image-pixelated" />
        <h3 class="text-sm font-semibold text-slate-700">Movimentação por Item (Quantidade total movimentada)</h3>
      </div>
      <div class="h-72">
        <Bar v-if="movPerItemData" :data="movPerItemData" :options="stackedBarOptions" />
        <div v-else class="flex items-center justify-center h-full text-slate-300 text-sm">Sem dados</div>
      </div>
    </div>

    <!-- Detailed inventory table -->
    <div class="card-pokemon overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scope-lens.png" class="w-5 h-5 image-pixelated" />
          <h3 class="text-sm font-semibold text-slate-700">Relatório Detalhado de Estoque</h3>
        </div>
      </div>
      <div v-if="loading" class="flex items-center justify-center h-32">
        <div class="w-8 h-8 border-3 border-pokeblue border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50/80 text-[10px] text-slate-400 uppercase tracking-wider">
              <th class="py-3 px-4 text-left font-semibold">Item</th>
              <th class="py-3 px-4 text-left font-semibold">Categoria</th>
              <th class="py-3 px-4 text-center font-semibold">Qtd</th>
              <th class="py-3 px-4 text-center font-semibold">Limite</th>
              <th class="py-3 px-4 text-right font-semibold">Preço Unit.</th>
              <th class="py-3 px-4 text-right font-semibold">Valor Total</th>
              <th class="py-3 px-4 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="item in itens" :key="item.id" class="table-row-hover">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <SpriteIcon :name="item.nome" size="sm" />
                  <span class="font-medium text-slate-800">{{ item.nome }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-500">{{ item.categoria_nome }}</td>
              <td class="py-3 px-4 text-center font-semibold text-slate-800">{{ item.quantidade }}</td>
              <td class="py-3 px-4 text-center text-slate-400">{{ item.limite_minimo }}</td>
              <td class="py-3 px-4 text-right text-slate-500">{{ formatCurrency(item.preco_unitario) }}</td>
              <td class="py-3 px-4 text-right font-semibold text-slate-800">{{ formatCurrency(item.quantidade * item.preco_unitario) }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="[
                  'badge-pokemon',
                  item.status_estoque === 'CRITICO' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                ]">
                  {{ item.status_estoque === 'CRITICO' ? '⚠ Crítico' : '✓ OK' }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-slate-50/80 font-semibold">
              <td class="py-3 px-4" colspan="5">
                <div class="flex items-center gap-2">
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" class="w-4 h-4 image-pixelated" />
                  TOTAL GERAL
                </div>
              </td>
              <td class="py-3 px-4 text-right text-pokeblue text-base">{{ formatCurrency(valorTotalEstoque) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { Bar, Doughnut } from 'vue-chartjs'
import SpriteIcon from '../components/SpriteIcon.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const itens = ref([])
const transacoes = ref([])
const loading = ref(true)

const valorTotalEstoque = computed(() => {
  return itens.value.reduce((sum, i) => sum + i.quantidade * Number(i.preco_unitario), 0)
})

const totalEntradas = computed(() => {
  return transacoes.value.filter((t) => t.tipo === 'ENTRADA').reduce((sum, t) => sum + t.quantidade, 0)
})

const totalSaidas = computed(() => {
  return transacoes.value.filter((t) => t.tipo === 'SAIDA').reduce((sum, t) => sum + t.quantidade, 0)
})

const pieData = computed(() => {
  const entradas = transacoes.value.filter((t) => t.tipo === 'ENTRADA').length
  const saidas = transacoes.value.filter((t) => t.tipo === 'SAIDA').length
  if (entradas === 0 && saidas === 0) return null
  return {
    labels: ['Entradas', 'Saídas'],
    datasets: [{
      data: [entradas, saidas],
      backgroundColor: ['rgba(5, 150, 105, 0.8)', 'rgba(220, 38, 38, 0.8)'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  }
})

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 20 } },
  },
}

const topItemsData = computed(() => {
  const sorted = [...itens.value].sort((a, b) => b.quantidade - a.quantidade).slice(0, 10)
  if (sorted.length === 0) return null
  return {
    labels: sorted.map((i) => i.nome),
    datasets: [{
      label: 'Quantidade',
      data: sorted.map((i) => i.quantidade),
      backgroundColor: sorted.map((_, idx) => {
        const colors = ['#DC2626', '#1E40AF', '#F59E0B', '#059669', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1']
        return colors[idx % colors.length]
      }),
      borderRadius: 6,
    }],
  }
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: { beginAtZero: true, grid: { color: '#F3F4F6' } },
    y: { grid: { display: false }, ticks: { font: { size: 11 } } },
  },
}

const movPerItemData = computed(() => {
  const map = {}
  transacoes.value.forEach((t) => {
    if (!map[t.item_nome]) map[t.item_nome] = { entradas: 0, saidas: 0 }
    if (t.tipo === 'ENTRADA') map[t.item_nome].entradas += t.quantidade
    else map[t.item_nome].saidas += t.quantidade
  })
  const labels = Object.keys(map)
  if (labels.length === 0) return null
  return {
    labels,
    datasets: [
      { label: 'Entradas', data: labels.map((l) => map[l].entradas), backgroundColor: 'rgba(5, 150, 105, 0.8)', borderRadius: 4 },
      { label: 'Saídas', data: labels.map((l) => map[l].saidas), backgroundColor: 'rgba(220, 38, 38, 0.8)', borderRadius: 4 },
    ],
  }
})

const stackedBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16 } } },
  scales: {
    x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { stacked: true, beginAtZero: true, grid: { color: '#F3F4F6' } },
  },
}

function formatCurrency(val) {
  return `P$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

async function fetchData() {
  loading.value = true
  try {
    const [iRes, tRes] = await Promise.all([
      api.get('/itens/'),
      api.get('/transacoes/'),
    ])
    itens.value = iRes.data
    transacoes.value = tRes.data
  } catch (err) {
    console.error('Error fetching report data:', err)
  } finally {
    loading.value = false
  }
}

async function refreshData() {
  await fetchData()
}

onMounted(fetchData)
</script>
