<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png" class="w-8 h-8 image-pixelated" />
        <div>
          <h2 class="text-xl font-bold text-slate-800">Registro de Transações</h2>
          <p class="text-sm text-slate-400">Entradas (reposição) e Saídas (vendas/distribuição)</p>
        </div>
      </div>
      <button
        @click="openCreate"
        class="btn-pokemon bg-pokeblue hover:bg-pokeblue-dark text-white"
      >
        <PlusIcon class="w-4 h-4" />
        Nova Transação
      </button>
    </div>

    <!-- Filters -->
    <div class="card-pokemon p-4 flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <button
          @click="filterTipo = ''"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
            !filterTipo ? 'bg-pokeblue text-white border-pokeblue' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          ]"
        >Todas</button>
        <button
          @click="filterTipo = 'ENTRADA'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5',
            filterTipo === 'ENTRADA' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          ]"
        >
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png" class="w-4 h-4 image-pixelated" />
          Entradas
        </button>
        <button
          @click="filterTipo = 'SAIDA'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5',
            filterTipo === 'SAIDA' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          ]"
        >
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png" class="w-4 h-4 image-pixelated" />
          Saídas
        </button>
      </div>
      <div class="flex-1 min-w-[200px]">
        <div class="relative">
          <MagnifyingGlassIcon class="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por item..."
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card-pokemon overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <div class="w-10 h-10 border-4 border-pokeblue border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else-if="filteredTransacoes.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png" class="w-12 h-12 image-pixelated mb-3 opacity-30" />
        <p class="text-sm">Nenhuma transação encontrada.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50/80 text-[10px] text-slate-400 uppercase tracking-wider">
              <th class="py-3 px-4 text-left font-semibold">Tipo</th>
              <th class="py-3 px-4 text-left font-semibold">Item</th>
              <th class="py-3 px-4 text-center font-semibold">Quantidade</th>
              <th class="py-3 px-4 text-left font-semibold">Usuário</th>
              <th class="py-3 px-4 text-left font-semibold">Data/Hora</th>
              <th class="py-3 px-4 text-left font-semibold">Observação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="t in filteredTransacoes" :key="t.id" class="table-row-hover">
              <td class="py-3 px-4">
                <span :class="[
                  'badge-pokemon',
                  t.tipo === 'ENTRADA' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ t.tipo === 'ENTRADA' ? '↓ Entrada' : '↑ Saída' }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <SpriteIcon :name="t.item_nome" size="sm" />
                  <span class="font-medium text-slate-800">{{ t.item_nome }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-center font-semibold" :class="t.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'">
                {{ t.tipo === 'ENTRADA' ? '+' : '-' }}{{ t.quantidade }}
              </td>
              <td class="py-3 px-4 text-slate-500">{{ t.usuario_nome || '—' }}</td>
              <td class="py-3 px-4 text-slate-400">{{ formatDate(t.data_hora) }}</td>
              <td class="py-3 px-4 text-slate-400 max-w-[200px] truncate">{{ t.observacao || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create modal -->
    <ModalDialog :show="showModal" title="Nova Transação" @close="showModal = false">
      <form @submit.prevent="createTransacao" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tipo de Movimentação</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.tipo = 'ENTRADA'"
              :class="[
                'flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
                form.tipo === 'ENTRADA'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              ]"
            >
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png" class="w-5 h-5 image-pixelated" />
              Entrada
            </button>
            <button
              type="button"
              @click="form.tipo = 'SAIDA'"
              :class="[
                'flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
                form.tipo === 'SAIDA'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              ]"
            >
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png" class="w-5 h-5 image-pixelated" />
              Saída
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Item</label>
          <select v-model="form.item" required class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 bg-slate-50 focus:bg-white">
            <option value="" disabled>Selecione um item</option>
            <option v-for="item in itens" :key="item.id" :value="item.id">
              {{ item.nome }} (estoque: {{ item.quantidade }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Quantidade</label>
          <input v-model.number="form.quantidade" type="number" min="1" required class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 bg-slate-50 focus:bg-white" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Observação (opcional)</label>
          <textarea v-model="form.observacao" rows="2" class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 bg-slate-50 focus:bg-white resize-none" placeholder="Detalhes da movimentação..."></textarea>
        </div>
        <div v-if="formError" class="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{{ formError }}</div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showModal = false" class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
          <button
            @click="createTransacao"
            :disabled="saving"
            :class="[
              'btn-pokemon text-white disabled:opacity-50',
              form.tipo === 'ENTRADA' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
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
import SpriteIcon from '../components/SpriteIcon.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
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
