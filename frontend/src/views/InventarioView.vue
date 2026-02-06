<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Suprimentos Pokémon</h2>
        <p class="text-sm text-gray-500">Gerencie todos os itens do inventário</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Filter: Low stock -->
        <button
          @click="toggleLowStock"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border',
            showLowStock
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          ]"
        >
          <ExclamationTriangleIcon class="w-4 h-4" />
          Estoque Baixo
        </button>
        <!-- Add item -->
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 bg-pokeblue hover:bg-pokeblue-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <PlusIcon class="w-4 h-4" />
          Novo Item
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div class="relative">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar item por nome..."
          class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue focus:border-transparent"
        />
      </div>
    </div>

    <!-- Items table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <div class="w-10 h-10 border-4 border-pokeblue border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
        <CubeIcon class="w-12 h-12 mb-3" />
        <p class="text-sm">{{ searchQuery ? 'Nenhum item encontrado.' : 'Nenhum item cadastrado ainda.' }}</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 text-xs text-gray-500 uppercase">
              <th class="py-3 px-4 text-left font-medium">Item</th>
              <th class="py-3 px-4 text-left font-medium">Categoria</th>
              <th class="py-3 px-4 text-center font-medium">Quantidade</th>
              <th class="py-3 px-4 text-center font-medium">Limite Mín.</th>
              <th class="py-3 px-4 text-right font-medium">Preço Unit.</th>
              <th class="py-3 px-4 text-center font-medium">Status</th>
              <th class="py-3 px-4 text-center font-medium">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in filteredItems" :key="item.id" class="table-row-hover">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div v-if="item.imagem" class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img :src="item.imagem" :alt="item.nome" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-10 h-10 rounded-lg bg-gradient-to-br from-pokeblue/10 to-pokered/10 flex items-center justify-center flex-shrink-0">
                    <CubeIcon class="w-5 h-5 text-pokeblue" />
                  </div>
                  <span class="font-medium text-gray-800">{{ item.nome }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {{ item.categoria_nome }}
                </span>
              </td>
              <td class="py-3 px-4 text-center font-semibold" :class="item.status_estoque === 'CRITICO' ? 'text-red-600' : 'text-gray-800'">
                {{ item.quantidade }}
              </td>
              <td class="py-3 px-4 text-center text-gray-500">{{ item.limite_minimo }}</td>
              <td class="py-3 px-4 text-right text-gray-700 font-medium">
                {{ formatCurrency(item.preco_unitario) }}
              </td>
              <td class="py-3 px-4 text-center">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
                  item.status_estoque === 'CRITICO'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                ]">
                  {{ item.status_estoque === 'CRITICO' ? '⚠ Crítico' : '✓ OK' }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="openEditModal(item)" class="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-pokeblue transition-colors" title="Editar">
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(item)" class="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-pokered transition-colors" title="Excluir">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ModalDialog :show="showModal" :title="editingItem ? 'Editar Item' : 'Novo Item'" @close="closeModal">
      <form @submit.prevent="saveItem" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Item</label>
          <input v-model="form.nome" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" placeholder="Ex: Ultra Ball" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select v-model="form.categoria" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue bg-white">
            <option value="" disabled>Selecione uma categoria</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nome }}</option>
          </select>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input v-model.number="form.quantidade" type="number" min="0" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Limite Mín.</label>
            <input v-model.number="form.limite_minimo" type="number" min="0" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preço (P$)</label>
            <input v-model.number="form.preco_unitario" type="number" step="0.01" min="0" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Imagem (opcional)</label>
          <input type="file" accept="image/*" @change="handleImage" class="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-pokeblue hover:file:bg-blue-100" />
        </div>
        <div v-if="formError" class="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{{ formError }}</div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button @click="saveItem" :disabled="saving" class="px-6 py-2 bg-pokeblue hover:bg-pokeblue-dark text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
            {{ saving ? 'Salvando...' : (editingItem ? 'Atualizar' : 'Criar Item') }}
          </button>
        </div>
      </template>
    </ModalDialog>

    <!-- Delete confirmation -->
    <ModalDialog :show="showDeleteModal" title="Confirmar Exclusão" @close="showDeleteModal = false">
      <p class="text-sm text-gray-600">
        Tem certeza que deseja excluir o item <strong class="text-gray-800">{{ deletingItem?.nome }}</strong>?
        Esta ação não pode ser desfeita.
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button @click="deleteItem" :disabled="deleting" class="px-6 py-2 bg-pokered hover:bg-pokered-dark text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
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
  PencilSquareIcon,
  TrashIcon,
  CubeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const items = ref([])
const categorias = ref([])
const loading = ref(true)
const searchQuery = ref('')
const showLowStock = ref(false)

const showModal = ref(false)
const editingItem = ref(null)
const saving = ref(false)
const formError = ref('')

const showDeleteModal = ref(false)
const deletingItem = ref(null)
const deleting = ref(false)

const form = ref({
  nome: '',
  categoria: '',
  quantidade: 0,
  limite_minimo: 10,
  preco_unitario: 0,
  imagem: null,
})

const filteredItems = computed(() => {
  let list = items.value
  if (showLowStock.value) {
    list = list.filter((i) => i.status_estoque === 'CRITICO')
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((i) => i.nome.toLowerCase().includes(q))
  }
  return list
})

function formatCurrency(val) {
  return `P$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function toggleLowStock() {
  showLowStock.value = !showLowStock.value
}

function openCreateModal() {
  editingItem.value = null
  form.value = { nome: '', categoria: '', quantidade: 0, limite_minimo: 10, preco_unitario: 0, imagem: null }
  formError.value = ''
  showModal.value = true
}

function openEditModal(item) {
  editingItem.value = item
  form.value = {
    nome: item.nome,
    categoria: item.categoria,
    quantidade: item.quantidade,
    limite_minimo: item.limite_minimo,
    preco_unitario: Number(item.preco_unitario),
    imagem: null,
  }
  formError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingItem.value = null
}

function handleImage(e) {
  form.value.imagem = e.target.files[0] || null
}

async function saveItem() {
  saving.value = true
  formError.value = ''

  try {
    const formData = new FormData()
    formData.append('nome', form.value.nome)
    formData.append('categoria', form.value.categoria)
    formData.append('quantidade', form.value.quantidade)
    formData.append('limite_minimo', form.value.limite_minimo)
    formData.append('preco_unitario', form.value.preco_unitario)
    if (form.value.imagem) {
      formData.append('imagem', form.value.imagem)
    }

    if (editingItem.value) {
      await api.patch(`/itens/${editingItem.value.id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } else {
      await api.post('/itens/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    closeModal()
    await fetchItems()
  } catch (err) {
    formError.value = err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao salvar item.'
  } finally {
    saving.value = false
  }
}

function confirmDelete(item) {
  deletingItem.value = item
  showDeleteModal.value = true
}

async function deleteItem() {
  deleting.value = true
  try {
    await api.delete(`/itens/${deletingItem.value.id}/`)
    showDeleteModal.value = false
    await fetchItems()
  } catch (err) {
    alert('Erro ao excluir item: ' + (err.response?.data?.detail || 'Erro desconhecido'))
  } finally {
    deleting.value = false
  }
}

async function fetchItems() {
  loading.value = true
  try {
    const [itensRes, catsRes] = await Promise.all([
      api.get('/itens/'),
      api.get('/categorias/'),
    ])
    items.value = itensRes.data
    categorias.value = catsRes.data
  } catch (err) {
    console.error('Error fetching items:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchItems)
</script>
