<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Relatórios do PokéVault</h2>
        <p class="text-sm text-gray-500">Visão analítica de estoque e movimentações</p>
      </div>
      <button
        @click="refreshData"
        :disabled="loading"
        class="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all"
      >
        <ArrowPathIcon class="w-4 h-4" :class="{ 'pokespin': loading }" />
        Atualizar Dados
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p class="text-xs font-medium text-gray-500 uppercase">Valor Total em Estoque</p>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatCurrency(valorTotalEstoque) }}</p>
        <p class="text-xs text-gray-400 mt-1">Soma de (quantidade × preço unitário)</p>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p class="text-xs font-medium text-gray-500 uppercase">Total de Movimentações</p>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ transacoes.length }}</p>
        <p class="text-xs text-gray-400 mt-1">Entradas + saídas registradas</p>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p class="text-xs font-medium text-gray-500 uppercase">Total Entradas</p>
        <p class="text-2xl font-bold text-green-600 mt-2">{{ totalEntradas }}</p>
        <p class="text-xs text-gray-400 mt-1">Itens repostos</p>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p class="text-xs font-medium text-gray-500 uppercase">Total Saídas</p>
        <p class="text-2xl font-bold text-red-600 mt-2">{{ totalSaidas }}</p>
        <p class="text-xs text-gray-400 mt-1">Itens vendidos/distribuídos</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Transactions by type (Pie) -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Proporção Entradas vs Saídas</h3>
        <div class="h-64">
          <Doughnut v-if="pieData" :data="pieData" :options="pieOptions" />
        </div>
      </div>

      <!-- Top items by stock -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Top 10 — Itens por Quantidade em Estoque</h3>
        <div class="h-64">
          <Bar v-if="topItemsData" :data="topItemsData" :options="barOptions" />
        </div>
      </div>
    </div>

    <!-- Movimentações por item -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 class="text-sm font-semibold text-gray-700 mb-4">Movimentação por Item (Quantidade total movimentada)</h3>
      <div class="h-72">
        <Bar v-if="movPerItemData" :data="movPerItemData" :options="stackedBarOptions" />
      </div>
    </div>

    <!-- Detailed inventory table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700">Relatório Detalhado de Estoque</h3>
      </div>
      <div v-if="loading" class="flex items-center justify-center h-32">
        <div class="w-8 h-8 border-3 border-pokeblue border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 text-xs text-gray-500 uppercase">
              <th class="py-3 px-4 text-left font-medium">Item</th>
              <th class="py-3 px-4 text-left font-medium">Categoria</th>
              <th class="py-3 px-4 text-center font-medium">Qtd</th>
              <th class="py-3 px-4 text-center font-medium">Limite</th>
              <th class="py-3 px-4 text-right font-medium">Preço Unit.</th>
              <th class="py-3 px-4 text-right font-medium">Valor Total</th>
              <th class="py-3 px-4 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in itens" :key="item.id" class="table-row-hover">
              <td class="py-3 px-4 font-medium text-gray-800">{{ item.nome }}</td>
              <td class="py-3 px-4 text-gray-500">{{ item.categoria_nome }}</td>
              <td class="py-3 px-4 text-center font-semibold">{{ item.quantidade }}</td>
              <td class="py-3 px-4 text-center text-gray-400">{{ item.limite_minimo }}</td>
              <td class="py-3 px-4 text-right text-gray-600">{{ formatCurrency(item.preco_unitario) }}</td>
              <td class="py-3 px-4 text-right font-semibold text-gray-800">{{ formatCurrency(item.quantidade * item.preco_unitario) }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold',
                  item.status_estoque === 'CRITICO' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                ]">
                  {{ item.status_estoque === 'CRITICO' ? '⚠ Crítico' : '✓ OK' }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50 font-semibold">
              <td class="py-3 px-4" colspan="5">TOTAL GERAL</td>
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
