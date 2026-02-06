<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Gestão de Funcionários</h2>
        <p class="text-sm text-gray-500">Cadastro e gerenciamento de acesso — Apenas Gerentes</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 bg-pokeblue hover:bg-pokeblue-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
      >
        <PlusIcon class="w-4 h-4" />
        Novo Funcionário
      </button>
    </div>

    <!-- Users table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-48">
        <div class="w-10 h-10 border-4 border-pokeblue border-t-transparent rounded-full pokespin"></div>
      </div>
      <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
        <UsersIcon class="w-12 h-12 mb-3" />
        <p class="text-sm">Nenhum funcionário cadastrado.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 text-xs text-gray-500 uppercase">
              <th class="py-3 px-4 text-left font-medium">Funcionário</th>
              <th class="py-3 px-4 text-left font-medium">E-mail</th>
              <th class="py-3 px-4 text-left font-medium">Matrícula</th>
              <th class="py-3 px-4 text-center font-medium">Perfil</th>
              <th class="py-3 px-4 text-center font-medium">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="u in users" :key="u.id" class="table-row-hover">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                       :class="u.role === 'GERENTE' ? 'bg-pokeyellow' : 'bg-pokeblue'">
                    {{ getInitials(u) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ u.first_name }} {{ u.last_name }}</p>
                    <p class="text-xs text-gray-400">@{{ u.username }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ u.email }}</td>
              <td class="py-3 px-4 text-gray-500 font-mono text-xs">{{ u.matricula }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
                  u.role === 'GERENTE' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                ]">
                  {{ u.role === 'GERENTE' ? '★ Gerente' : '◆ Estoquista' }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="openEdit(u)" class="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-pokeblue transition-colors" title="Editar">
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(u)" class="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-pokered transition-colors" title="Excluir">
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
    <ModalDialog :show="showModal" :title="editing ? 'Editar Funcionário' : 'Novo Funcionário'" @close="closeModal">
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input v-model="form.first_name" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" placeholder="Ash" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
            <input v-model="form.last_name" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" placeholder="Ketchum" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input v-model="form.username" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" placeholder="ashketchum" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input v-model="form.email" type="email" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" placeholder="ash@pokevault.com" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
            <input v-model="form.matricula" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" placeholder="2024001" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            <select v-model="form.role" required class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue bg-white">
              <option value="ESTOQUISTA">Estoquista</option>
              <option value="GERENTE">Gerente</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ editing ? 'Nova Senha (deixe vazio para manter)' : 'Senha' }}
          </label>
          <input v-model="form.password" :type="'password'" :required="!editing" class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pokeblue" placeholder="••••••••" />
        </div>
        <div v-if="formError" class="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{{ formError }}</div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button @click="save" :disabled="saving" class="px-6 py-2 bg-pokeblue hover:bg-pokeblue-dark text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
            {{ saving ? 'Salvando...' : (editing ? 'Atualizar' : 'Cadastrar') }}
          </button>
        </div>
      </template>
    </ModalDialog>

    <!-- Delete confirmation -->
    <ModalDialog :show="showDelete" title="Confirmar Exclusão" @close="showDelete = false">
      <p class="text-sm text-gray-600">
        Excluir o funcionário <strong>{{ deletingUser?.first_name }} {{ deletingUser?.last_name }}</strong>? Esta ação não pode ser desfeita.
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
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

const users = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const formError = ref('')

const showDelete = ref(false)
const deletingUser = ref(null)
const deleting = ref(false)

const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  matricula: '',
  role: 'ESTOQUISTA',
  password: '',
})

function getInitials(u) {
  return ((u.first_name?.[0] || '') + (u.last_name?.[0] || '')).toUpperCase() || '?'
}

function openCreate() {
  editing.value = null
  form.value = { first_name: '', last_name: '', username: '', email: '', matricula: '', role: 'ESTOQUISTA', password: '' }
  formError.value = ''
  showModal.value = true
}

function openEdit(u) {
  editing.value = u
  form.value = {
    first_name: u.first_name,
    last_name: u.last_name,
    username: u.username,
    email: u.email,
    matricula: u.matricula,
    role: u.role,
    password: '',
  }
  formError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editing.value = null
}

async function save() {
  saving.value = true
  formError.value = ''
  try {
    const payload = { ...form.value }
    if (editing.value && !payload.password) {
      delete payload.password
    }

    if (editing.value) {
      await api.patch(`/users/${editing.value.id}/`, payload)
    } else {
      await api.post('/users/', payload)
    }
    closeModal()
    await fetchUsers()
  } catch (err) {
    formError.value = err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

function confirmDelete(u) {
  deletingUser.value = u
  showDelete.value = true
}

async function doDelete() {
  deleting.value = true
  try {
    await api.delete(`/users/${deletingUser.value.id}/`)
    showDelete.value = false
    await fetchUsers()
  } catch (err) {
    alert('Erro ao excluir: ' + (err.response?.data?.detail || 'Erro desconhecido'))
  } finally {
    deleting.value = false
  }
}

async function fetchUsers() {
  loading.value = true
  try {
    const res = await api.get('/users/')
    users.value = res.data
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>
