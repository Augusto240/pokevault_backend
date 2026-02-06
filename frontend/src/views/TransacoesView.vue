<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Registro de Transações</h2>
        <p class="text-sm text-gray-500">Entradas (reposição) e Saídas (vendas/distribuição)</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 bg-pokeblue hover:bg-pokeblue-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
      >
        <PlusIcon class="w-4 h-4" />
        Nova Transação
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <button
          @click="filterTipo = ''"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
            !filterTipo ? 'bg-pokeblue text-white border-pokeblue' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          ]"
        >Todas</button>
        <button
          @click="filterTipo = 'ENTRADA'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
            filterTipo === 'ENTRADA' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          ]"
        >↓ Entradas</button>
        <button
          @click="filterTipo = 'SAIDA'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
            filterTipo === 'SAIDA' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          ]"
        >↑ Saídas</button>
      </div>
      <div class="flex-1 min-w-[200px]">
        <div class="relative">
          <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por item..."
            class="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <div class="w-10 h-10 border-4 border-pokeblue border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else-if="filteredTransacoes.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
        <ArrowsRightLeftIcon class="w-12 h-12 mb-3" />
        <p class="text-sm">Nenhuma transação encontrada.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 text-xs text-gray-500 uppercase">
              <th class="py-3 px-4 text-left font-medium">Tipo</th>
              <th class="py-3 px-4 text-left font-medium">Item</th>
              <th class="py-3 px-4 text-center font-medium">Quantidade</th>
              <th class="py-3 px-4 text-left font-medium">Usuário</th>
              <th class="py-3 px-4 text-left font-medium">Data/Hora</th>
              <th class="py-3 px-4 text-left font-medium">Observação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="t in filteredTransacoes" :key="t.id" class="table-row-hover">
              <td class="py-3 px-4">
                <span :class="[
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold',
                  t.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="t.tipo === 'ENTRADA'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                  {{ t.tipo === 'ENTRADA' ? 'Entrada' : 'Saída' }}
                </span>
              </td>
              <td class="py-3 px-4 font-medium text-gray-800">{{ t.item_nome }}</td>
              <td class="py-3 px-4 text-center font-semibold" :class="t.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'">
                {{ t.tipo === 'ENTRADA' ? '+' : '-' }}{{ t.quantidade }}
              </td>
              <td class="py-3 px-4 text-gray-500">{{ t.usuario_nome || '—' }}</td>
              <td class="py-3 px-4 text-gray-400">{{ formatDate(t.data_hora) }}</td>
              <td class="py-3 px-4 text-gray-400 max-w-[200px] truncate">{{ t.observacao || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create modal -->
    <ModalDialog :show="showModal" title="Nova Transação" @close="showModal = false">
      <form @submit.prevent="createTransacao" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimentação</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.tipo = 'ENTRADA'"
              :class="[
                'flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
                form.tipo === 'ENTRADA'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              Entrada
            </button>
            <button
              type="button"
              @click="form.tipo = 'SAIDA'"
              :class="[
                'flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
                form.tipo === 'SAIDA'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
              Saída
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Item</label>
          <select v-model="form.item" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue bg-white">
            <option value="" disabled>Selecione um item</option>
            <option v-for="item in itens" :key="item.id" :value="item.id">
              {{ item.nome }} (estoque: {{ item.quantidade }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
          <input v-model.number="form.quantidade" type="number" min="1" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Observação (opcional)</label>
          <textarea v-model="form.observacao" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue resize-none" placeholder="Detalhes da movimentação..."></textarea>
        </div>
        <div v-if="formError" class="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{{ formError }}</div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showModal = false" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button
            @click="createTransacao"
            :disabled="saving"
            :class="[
              'px-6 py-2 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50',
              form.tipo === 'ENTRADA' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            ]"
          >
            {{ saving ? 'Registrando...' : 'Registrar' }}
          </button>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import ModalDialog from '../components/ModalDialog.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/vue/24/outline'

const transacoes = ref([])
const itens = ref([])
const loading = ref(true)
const filterTipo = ref('')
const searchQuery = ref('')

const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const form = ref({
  tipo: 'ENTRADA',
  item: '',
  quantidade: 1,
  observacao: '',
})

const filteredTransacoes = computed(() => {
  let list = transacoes.value
  if (filterTipo.value) {
    list = list.filter((t) => t.tipo === filterTipo.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((t) => t.item_nome?.toLowerCase().includes(q))
  }
  return list
})

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function openCreate() {
  form.value = { tipo: 'ENTRADA', item: '', quantidade: 1, observacao: '' }
  formError.value = ''
  showModal.value = true
}

async function createTransacao() {
  saving.value = true
  formError.value = ''
  try {
    await api.post('/transacoes/', {
      tipo: form.value.tipo,
      item: form.value.item,
      quantidade: form.value.quantidade,
      observacao: form.value.observacao,
    })
    showModal.value = false
    await fetchData()
  } catch (err) {
    formError.value = err.response?.data
      ? (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data))
      : 'Erro ao registrar transação.'
  } finally {
    saving.value = false
  }
}

async function fetchData() {
  loading.value = true
  try {
    const [tRes, iRes] = await Promise.all([
      api.get('/transacoes/'),
      api.get('/itens/'),
    ])
    transacoes.value = tRes.data
    itens.value = iRes.data
  } catch (err) {
    console.error('Error fetching transactions:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
