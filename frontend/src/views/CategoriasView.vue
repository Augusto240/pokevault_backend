<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Categorias de Suprimentos</h2>
        <p class="text-sm text-gray-500">Organize os tipos de itens do PokéMart</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 bg-pokeblue hover:bg-pokeblue-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
      >
        <PlusIcon class="w-4 h-4" />
        Nova Categoria
      </button>
    </div>

    <!-- Categories grid -->
    <div v-if="loading" class="flex items-center justify-center h-48">
      <div class="w-10 h-10 border-4 border-pokeblue border-t-transparent rounded-full pokespin"></div>
    </div>
    <div v-else-if="categorias.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <TagIcon class="w-12 h-12 mx-auto text-gray-300 mb-3" />
      <p class="text-sm text-gray-400">Nenhuma categoria cadastrada ainda.</p>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="cat in categorias"
        :key="cat.id"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pokeblue/10 to-pokered/10 flex items-center justify-center">
            <TagIcon class="w-5 h-5 text-pokeblue" />
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openEdit(cat)" class="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-pokeblue transition-colors">
              <PencilSquareIcon class="w-4 h-4" />
            </button>
            <button @click="confirmDelete(cat)" class="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-pokered transition-colors">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 class="font-semibold text-gray-800">{{ cat.nome }}</h3>
        <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ cat.descricao || 'Sem descrição' }}</p>
      </div>
    </div>

    <!-- Modal -->
    <ModalDialog :show="showModal" :title="editing ? 'Editar Categoria' : 'Nova Categoria'" @close="showModal = false">
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input v-model="form.nome" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" placeholder="Ex: Pokébolas" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea v-model="form.descricao" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue resize-none" placeholder="Descrição da categoria..."></textarea>
        </div>
        <div v-if="formError" class="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{{ formError }}</div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showModal = false" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button @click="save" :disabled="saving" class="px-6 py-2 bg-pokeblue hover:bg-pokeblue-dark text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
            {{ saving ? 'Salvando...' : (editing ? 'Atualizar' : 'Criar') }}
          </button>
        </div>
      </template>
    </ModalDialog>

    <!-- Delete confirmation -->
    <ModalDialog :show="showDelete" title="Confirmar Exclusão" @close="showDelete = false">
      <p class="text-sm text-gray-600">
        Excluir a categoria <strong>{{ deletingCat?.nome }}</strong>? Só é possível excluir categorias sem itens vinculados.
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showDelete = false" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button @click="doDelete" :disabled="deleting" class="px-6 py-2 bg-pokered hover:bg-pokered-dark text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import ModalDialog from '../components/ModalDialog.vue'
import { PlusIcon, PencilSquareIcon, TrashIcon, TagIcon } from '@heroicons/vue/24/outline'

const categorias = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const formError = ref('')
const form = ref({ nome: '', descricao: '' })

const showDelete = ref(false)
const deletingCat = ref(null)
const deleting = ref(false)

function openCreate() {
  editing.value = null
  form.value = { nome: '', descricao: '' }
  formError.value = ''
  showModal.value = true
}

function openEdit(cat) {
  editing.value = cat
  form.value = { nome: cat.nome, descricao: cat.descricao || '' }
  formError.value = ''
  showModal.value = true
}

async function save() {
  saving.value = true
  formError.value = ''
  try {
    if (editing.value) {
      await api.patch(`/categorias/${editing.value.id}/`, form.value)
    } else {
      await api.post('/categorias/', form.value)
    }
    showModal.value = false
    await fetchData()
  } catch (err) {
    formError.value = err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

function confirmDelete(cat) {
  deletingCat.value = cat
  showDelete.value = true
}

async function doDelete() {
  deleting.value = true
  try {
    await api.delete(`/categorias/${deletingCat.value.id}/`)
    showDelete.value = false
    await fetchData()
  } catch (err) {
    alert('Erro ao excluir: ' + (err.response?.data?.detail || 'Categoria pode ter itens vinculados.'))
  } finally {
    deleting.value = false
  }
}

async function fetchData() {
  loading.value = true
  try {
    const res = await api.get('/categorias/')
    categorias.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
