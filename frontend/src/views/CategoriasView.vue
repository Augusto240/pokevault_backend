<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png" class="w-8 h-8 image-pixelated" />
        <div>
          <h2 class="text-xl font-bold text-slate-800">Categorias de Suprimentos</h2>
          <p class="text-sm text-slate-400">Organize os tipos de itens do PokéMart</p>
        </div>
      </div>
      <button
        @click="openCreate"
        class="btn-pokemon bg-pokeblue hover:bg-pokeblue-dark text-white"
      >
        <PlusIcon class="w-4 h-4" />
        Nova Categoria
      </button>
    </div>

    <!-- Categories grid -->
    <div v-if="loading" class="flex items-center justify-center h-48">
      <div class="w-10 h-10 border-4 border-pokeblue border-t-transparent rounded-full pokespin"></div>
    </div>
    <div v-else-if="categorias.length === 0" class="card-pokemon p-12 text-center">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-12 h-12 mx-auto image-pixelated mb-3 opacity-30" />
      <p class="text-sm text-slate-400">Nenhuma categoria cadastrada ainda.</p>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="cat in categorias"
        :key="cat.id"
        class="card-pokemon p-5 group"
      >
        <div class="flex items-start justify-between mb-3">
          <SpriteIcon :name="cat.nome" type="category" size="lg" rounded />
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openEdit(cat)" class="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-pokeblue transition-colors">
              <PencilSquareIcon class="w-4 h-4" />
            </button>
            <button @click="confirmDelete(cat)" class="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-pokered transition-colors">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 class="font-semibold text-slate-800">{{ cat.nome }}</h3>
        <p class="text-xs text-slate-400 mt-1 line-clamp-2">{{ cat.descricao || 'Sem descrição' }}</p>
      </div>
    </div>

    <!-- Modal -->
    <ModalDialog :show="showModal" :title="editing ? 'Editar Categoria' : 'Nova Categoria'" @close="showModal = false">
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome</label>
          <input v-model="form.nome" required class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 focus:border-pokeblue bg-slate-50 focus:bg-white" placeholder="Ex: Pokébolas" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Descrição</label>
          <textarea v-model="form.descricao" rows="3" class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue/30 focus:border-pokeblue bg-slate-50 focus:bg-white resize-none" placeholder="Descrição da categoria..."></textarea>
        </div>
        <!-- Sprite preview -->
        <div v-if="form.nome" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <SpriteIcon :name="form.nome" type="category" size="lg" rounded />
          <div>
            <p class="text-xs font-medium text-slate-600">Sprite da Categoria</p>
            <p class="text-[10px] text-slate-400">Ícone automático baseado no nome</p>
          </div>
        </div>
        <div v-if="formError" class="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{{ formError }}</div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showModal = false" class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
          <button @click="save" :disabled="saving" class="btn-pokemon bg-pokeblue hover:bg-pokeblue-dark text-white disabled:opacity-50">
            {{ saving ? 'Salvando...' : (editing ? 'Atualizar' : 'Criar') }}
          </button>
        </div>
      </template>
    </ModalDialog>

    <!-- Delete confirmation -->
    <ModalDialog :show="showDelete" title="Confirmar Exclusão" @close="showDelete = false">
      <div class="flex items-center gap-3 mb-2">
        <SpriteIcon :name="deletingCat?.nome" type="category" size="lg" />
        <p class="text-sm text-slate-600">
          Excluir a categoria <strong>{{ deletingCat?.nome }}</strong>? Só é possível excluir categorias sem itens vinculados.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showDelete = false" class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
          <button @click="doDelete" :disabled="deleting" class="btn-pokemon bg-pokered hover:bg-pokered-dark text-white disabled:opacity-50">
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
import SpriteIcon from '../components/SpriteIcon.vue'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

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
