import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useAdminStore = defineStore('admin', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = ref(false)

  async function initialize() {
    loading.value = true
    
    const savedAuth = sessionStorage.getItem('admin-session')
    if (savedAuth) {
      try {
        const sessionData = JSON.parse(savedAuth)
        if (sessionData && sessionData.email) {
          user.value = sessionData
          isAuthenticated.value = true
        }
      } catch (e) {
        sessionStorage.removeItem('admin-session')
      }
    }
    
    loading.value = false
  }

  async function login(email, password) {
    error.value = null
    loading.value = true

    try {
      const { data, error: authError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (authError || !data) {
        throw new Error('Email ou senha inválidos')
      }

      const { data: verifyData, error: verifyError } = await supabase.rpc(
        'verify_admin_password',
        { email: email.toLowerCase(), password }
      )

      if (verifyError || !verifyData) {
        throw new Error('Email ou senha inválidos')
      }

      user.value = {
        id: data.id,
        email: data.email,
        nome: data.nome
      }

      isAuthenticated.value = true
      
      sessionStorage.setItem('admin-session', JSON.stringify(user.value))
      
      return true
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    sessionStorage.removeItem('admin-session')
  }

  function isAuth() {
    return isAuthenticated.value
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    initialize,
    login,
    logout,
    isAuth
  }
})
