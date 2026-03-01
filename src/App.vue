<template>
  <div class="app">
    <header class="header">
      <div class="container header-content">
        <router-link to="/" class="logo">
          BHUMI <span class="accent">SHOP</span>
        </router-link>

        <nav class="nav">
          <router-link to="/produtos" class="nav-link">Produtos</router-link>
          <router-link to="/videos" class="nav-link">Vídeos</router-link>
          <router-link to="/sobre" class="nav-link">Sobre</router-link>
        </nav>

        <div class="header-actions">
          <router-link to="/carrinho" class="cart-btn">
            🛒
            <span v-if="cartStore.totalItems > 0" class="cart-badge">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
          <router-link to="/config" class="config-link" title="Configurações">
            ⚙️
          </router-link>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-section">
          <h4>BHUMI SHOP</h4>
          <p>Arte, Conhecimento e Criatividade</p>
        </div>
        <div class="footer-section">
          <h4>Links Rápidos</h4>
          <router-link to="/produtos">Produtos</router-link>
          <router-link to="/videos">Vídeos</router-link>
          <router-link to="/sobre">Sobre</router-link>
        </div>
        <div class="footer-section">
          <h4>Contato</h4>
          <p>contato@bhumi.com.br</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 BhumiShop. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useCartStore } from './stores/cart'

const cartStore = useCartStore()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0a;
  color: #FFFFFF;
  line-height: 1.6;
}

:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a2e;
  --bg-card: #12121f;
  
  --accent-purple: #7B2CBF;
  --accent-purple-light: #9D4EDD;
  --accent-purple-dark: #5a1f8c;
  --accent-green: #00FF41;
  --accent-green-dark: #00CC33;
  --accent-green-glow: rgba(0, 255, 65, 0.3);
  
  --text-primary: #FFFFFF;
  --text-secondary: #B8B8B8;
  --text-muted: #6B6B6B;
  
  --border-color: #2a2a4a;
  
  --font-display: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  --shadow-glow: 0 0 20px rgba(123, 44, 191, 0.3);
}

a {
  text-decoration: none;
  color: inherit;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(10, 10, 10, 0.95);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.logo .accent {
  color: var(--accent-green);
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--accent-green);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-btn {
  position: relative;
  font-size: 1.25rem;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--accent-purple);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.config-link {
  font-size: 1.25rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.config-link:hover {
  color: var(--accent-purple);
}

.main-content {
  flex: 1;
}

.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 3rem 1rem;
}

.footer-section h4 {
  color: var(--accent-green);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p,
.footer-section a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
}

.footer-section a:hover {
  color: var(--accent-purple);
}

.footer-bottom {
  text-align: center;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.85rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--accent-purple);
  transform: translateY(-5px);
  box-shadow: var(--shadow-glow);
}

.btn-primary {
  display: inline-block;
  background: var(--accent-purple);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--accent-purple-light);
}

.btn-secondary {
  display: inline-block;
  background: transparent;
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: var(--accent-purple);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  .header-content {
    justify-content: space-between;
  }
}
</style>
