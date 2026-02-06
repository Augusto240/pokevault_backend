import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('pokevault_access') || '')
  const refreshToken = ref(localStorage.getItem('pokevault_refresh') || '')
  const user = ref(JSON.parse(localStorage.getItem('pokevault_user') || 'null'))

  const isAuthenticated = computed(() => !!accessToken.value)
  const isGerente = computed(() => user.value?.role === 'GERENTE')
  const isEstoquista = computed(() => user.value?.role === 'ESTOQUISTA')
  const userName = computed(() => {
    if (!user.value) return ''
    return user.value.first_name || user.value.username || user.value.email
  })

  function setAccessToken(token) {
    accessToken.value = token
    localStorage.setItem('pokevault_access', token)
  }

  function setTokens(access, refresh) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('pokevault_access', access)
    localStorage.setItem('pokevault_refresh', refresh)
  }

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('pokevault_user', JSON.stringify(userData))
  }

  async function login(email, password) {
    const res = await axios.post('/api/token/', { email, password })
    setTokens(res.data.access, res.data.refresh)

    // Decode JWT payload to get user info
    const payload = JSON.parse(atob(res.data.access.split('.')[1]))
    
    // Try to fetch full user profile via /users/me/ endpoint
    try {
      const userRes = await axios.get('/api/users/me/', {
        headers: { Authorization: `Bearer ${res.data.access}` },
      })
      setUser(userRes.data)
    } catch {
      // Fallback: build minimal user object from JWT payload
      setUser({
        id: payload.user_id,
        email: email,
        username: email.split('@')[0],
        first_name: email.split('@')[0],
        last_name: '',
        role: 'ESTOQUISTA',
        matricula: '',
      })
    }

    return res.data
  }

  function logout() {
    accessToken.value = ''
    refreshToken.value = ''
    user.value = null
    localStorage.removeItem('pokevault_access')
    localStorage.removeItem('pokevault_refresh')
    localStorage.removeItem('pokevault_user')
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    isGerente,
    isEstoquista,
    userName,
    setAccessToken,
    setTokens,
    setUser,
    login,
    logout,
  }
})
