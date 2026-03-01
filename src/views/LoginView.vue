<template>
  <div class="login-page">
    <div class="login-box">
      <h1>🔐 Admin BhumiShop</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Senha de Acesso</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Digite a senha"
            required
          >
        </div>
        <button type="submit" class="btn-primary">Entrar</button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const password = ref('')
const error = ref('')

function handleLogin() {
  const correctPassword = '@AryaAvalokite2026'
  
  if (password.value === correctPassword) {
    sessionStorage.setItem('admin-auth', 'true')
    window.location.href = '/'
  } else {
    error.value = 'Senha incorreta'
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
  color: #B8B8B8;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  background: #12121f;
  border: 1px solid #2a2a4a;
  color: white;
  border-radius: 4px;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: #7B2CBF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:hover {
  background: #9D4EDD;
}

.error-msg {
  color: #ff4444;
  margin-top: 1rem;
}
</style>
