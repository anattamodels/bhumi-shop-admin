<template>
  <div class="cart-page container">
    <h1 class="page-title">Carrinho</h1>

    <div v-if="cartStore.items.length > 0" class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-image">
            <div class="placeholder-image">{{ item.category || 'produto' }}</div>
          </div>
          
          <div class="item-info">
            <h3 class="item-name">{{ item.name }}</h3>
            <p v-if="item.size" class="item-size">Tamanho: {{ item.size }}</p>
            <p class="item-price">R$ {{ item.price.toFixed(2) }}</p>
          </div>

          <div class="item-quantity">
            <button @click="updateQty(item.id, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQty(item.id, item.quantity + 1)">+</button>
          </div>

          <div class="item-total">
            R$ {{ (item.price * item.quantity).toFixed(2) }}
          </div>

          <button class="remove-btn" @click="removeItem(item.id)">×</button>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Resumo do Pedido</h2>
        
        <div class="summary-row">
          <span>Subtotal ({{ cartStore.totalItems }} itens)</span>
          <span>R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        
        <div class="summary-row">
          <span>Frete</span>
          <span class="shipping-note">A calcular</span>
        </div>

        <div class="payment-methods">
          <h3>Forma de Pagamento</h3>
          <div class="payment-options">
            <label :class="{ active: cartStore.paymentMethod === 'pix' }">
              <input 
                type="radio" 
                v-model="cartStore.paymentMethod" 
                value="pix"
              >
              <span>PIX</span>
            </label>
            <label :class="{ active: cartStore.paymentMethod === 'mercadopago' }">
              <input 
                type="radio" 
                v-model="cartStore.paymentMethod" 
                value="mercadopago"
              >
              <span>Mercado Pago</span>
            </label>
            <label :class="{ active: cartStore.paymentMethod === 'paypal' }">
              <input 
                type="radio" 
                v-model="cartStore.paymentMethod" 
                value="paypal"
              >
              <span>PayPal</span>
            </label>
          </div>
        </div>

        <div class="summary-total">
          <span>Total</span>
          <span>R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>

        <button class="btn-primary checkout-btn" @click="checkout">
          Finalizar Compra
        </button>

        <div class="payment-icons">
          <span>💳 PIX</span>
          <span>💰 Mercado Pago</span>
          <span>🅿️ PayPal</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-cart">
      <p>Seu carrinho está vazio.</p>
      <router-link to="/produtos" class="btn-primary">
        Ver Produtos
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

function updateQty(productId, quantity) {
  cartStore.updateQuantity(productId, quantity)
}

function removeItem(productId) {
  cartStore.removeItem(productId)
}

function checkout() {
  alert(`Finalizando compra com ${cartStore.paymentMethod.toUpperCase()}\nTotal: R$ ${cartStore.totalPrice.toFixed(2)}`)
}
</script>

<style scoped>
.cart-page {
  padding: 3rem 1rem;
  min-height: 60vh;
}

.page-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  background: var(--bg-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.item-name {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.item-size {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.item-price {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-quantity button {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.item-quantity button:hover {
  border-color: var(--accent-green);
}

.item-quantity span {
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: 700;
  color: var(--accent-green);
  min-width: 80px;
  text-align: right;
}

.remove-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.remove-btn:hover {
  color: #ff4444;
}

.cart-summary {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  position: sticky;
  top: 100px;
}

.cart-summary h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.shipping-note {
  color: var(--text-muted);
  font-style: italic;
}

.payment-methods {
  margin: 1.5rem 0;
}

.payment-methods h3 {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.payment-options label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-options label:hover {
  border-color: var(--accent-purple);
}

.payment-options label.active {
  border-color: var(--accent-green);
  background: rgba(0, 255, 65, 0.1);
}

.payment-options input {
  display: none;
}

.payment-options span {
  font-weight: 600;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.5rem 0;
}

.summary-total span:last-child {
  color: var(--accent-green);
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.empty-cart {
  text-align: center;
  padding: 4rem;
}

.empty-cart p {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }

  .cart-item {
    grid-template-columns: 60px 1fr auto;
  }
  
  .item-quantity,
  .item-total {
    grid-column: 2;
  }
  
  .remove-btn {
    grid-column: 3;
    grid-row: 1 / 3;
  }
}
</style>
