<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png" class="w-8 h-8 image-pixelated" />
        <div>
          <h2 class="text-xl font-bold text-slate-800">Suprimentos Pokémon</h2>
          <p class="text-sm text-slate-400">Gerencie todos os itens do inventário</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="toggleLowStock"
          :class="[
            'btn-pokemon text-xs border',
            showLowStock
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          ]"
        >
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png" class="w-4 h-4 image-pixelated" />
          Estoque Baixo
        </button>
        <button
          @click="openCreateModal"
          class="btn-pokemon bg-pokeblue hover:bg-pokeblue-dark text-white"
        >
          <PlusIcon class="w-4 h-4" />
          Novo Item
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="card-pokemon p-4">
      <div class="relative">
        <MagnifyingGlassIcon class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar item por nome..."
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 focus:border-pokeblue"
        />
      </div>
    </div>

    <!-- Items table -->
    <div class="card-pokemon overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <div class="w-10 h-10 border-4 border-pokeblue border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-12 h-12 image-pixelated mb-3 opacity-30" />
        <p class="text-sm">{{ searchQuery ? 'Nenhum item encontrado.' : 'Nenhum item cadastrado ainda.' }}</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50/80 text-[10px] text-slate-400 uppercase tracking-wider">
              <th class="py-3 px-4 text-left font-semibold">Item</th>
              <th class="py-3 px-4 text-left font-semibold">Categoria</th>
              <th class="py-3 px-4 text-center font-semibold">Quantidade</th>
              <th class="py-3 px-4 text-center font-semibold">Limite Mín.</th>
              <th class="py-3 px-4 text-right font-semibold">Preço Unit.</th>
              <th class="py-3 px-4 text-center font-semibold">Status</th>
              <th class="py-3 px-4 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="item in filteredItems" :key="item.id" class="table-row-hover group">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <SpriteIcon :name="item.nome" size="md" />
                  <span class="font-medium text-slate-800">{{ item.nome }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span :class="[
                  'badge-pokemon',
                  getCategoryColor(item.categoria_nome).bg,
                  getCategoryColor(item.categoria_nome).text
                ]">
                  {{ item.categoria_nome }}
                </span>
              </td>
              <td class="py-3 px-4 text-center font-semibold" :class="item.status_estoque === 'CRITICO' ? 'text-red-600' : 'text-slate-800'">
                {{ item.quantidade }}
              </td>
              <td class="py-3 px-4 text-center text-slate-400">{{ item.limite_minimo }}</td>
              <td class="py-3 px-4 text-right text-slate-700 font-medium">
                {{ formatCurrency(item.preco_unitario) }}
              </td>
              <td class="py-3 px-4 text-center">
                <span :class="[
                  'badge-pokemon',
                  item.status_estoque === 'CRITICO'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-700'
                ]">
                  {{ item.status_estoque === 'CRITICO' ? '⚠ Crítico' : '✓ OK' }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditModal(item)" class="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-pokeblue transition-colors" title="Editar">
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(item)" class="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-pokered transition-colors" title="Excluir">
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
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome do Item</label>
          <input v-model="form.nome" required class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 focus:border-pokeblue bg-slate-50 focus:bg-white" placeholder="Ex: Ultra Ball" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Categoria</label>
          <select v-model="form.categoria" required class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 focus:border-pokeblue bg-slate-50 focus:bg-white">
            <option value="" disabled>Selecione uma categoria</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nome }}</option>
          </select>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Quantidade</label>
            <input v-model.number="form.quantidade" type="number" min="0" required class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 bg-slate-50 focus:bg-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Limite Mín.</label>
            <input v-model.number="form.limite_minimo" type="number" min="0" required class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 bg-slate-50 focus:bg-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Preço (P$)</label>
            <input v-model.number="form.preco_unitario" type="number" step="0.01" min="0" required class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 bg-slate-50 focus:bg-white" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Imagem (opcional)</label>
          <input type="file" accept="image/*" @change="handleImage" class="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-pokeblue hover:file:bg-blue-100" />
        </div>
        <!-- Sprite preview -->
        <div v-if="form.nome" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <SpriteIcon :name="form.nome" size="lg" />
          <div>
            <p class="text-xs font-medium text-slate-600">Preview do Sprite</p>
            <p class="text-[10px] text-slate-400">Sprite automático baseado no nome do item</p>
          </div>
        </div>
        <div v-if="formError" class="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{{ formError }}</div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
          <button @click="saveItem" :disabled="saving" class="btn-pokemon bg-pokeblue hover:bg-pokeblue-dark text-white disabled:opacity-50">
            {{ saving ? 'Salvando...' : (editingItem ? 'Atualizar' : 'Criar Item') }}
          </button>
        </div>
      </template>
    </ModalDialog>

    <!-- Delete confirmation -->
    <ModalDialog :show="showDeleteModal" title="Confirmar Exclusão" @close="showDeleteModal = false">
      <div class="flex items-center gap-3 mb-4">
        <SpriteIcon :name="deletingItem?.nome" size="lg" />
        <p class="text-sm text-slate-600">
          Tem certeza que deseja excluir <strong class="text-slate-800">{{ deletingItem?.nome }}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
          <button @click="deleteItem" :disabled="deleting" class="btn-pokemon bg-pokered hover:bg-pokered-dark text-white disabled:opacity-50">
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
import SpriteIcon from '../components/SpriteIcon.vue'
import { getCategoryColor } from '../utils/sprites'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
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
