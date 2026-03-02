<template>
  <div class="login-page">
    <div class="login-box">
      <h1>🔐 Admin BhumiShop</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="admin@bhumi.com.br"
            required
          >
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Digite sua senha"
            required
          >
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const { data, error: rpcError } = await supabase.rpc(
      'verify_admin_password',
      { 
        p_email: email.value.toLowerCase(), 
        p_password: password.value 
      }
    )

    if (rpcError) {
      console.error('RPC Error:', rpcError)
      throw new Error('Erro ao verificar credenciais')
    }

    if (!data || !data.valid) {
      throw new Error(data?.error || 'Email ou senha inválidos')
    }

    sessionStorage.setItem('admin-session', JSON.stringify(data.admin))

    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    error.value = e.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
}

.login-box {
  background: #1a1a2e;
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.login-box h1 {
  color: #00FF41;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #00FF41;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  background: #12121f;
  border: 1px solid #2a2a4a;
  color: #00FF41;
  border-radius: 4px;
}

.form-group input::placeholder {
  color: #00FF41;
  opacity: 0.6;
}

.form-group input:focus {
  outline: none;
  border-color: #7B2CBF;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: #7B2CBF;
  color: #00FF41;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #9D4EDD;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #ff4444;
  margin-top: 1rem;
}
</style>
