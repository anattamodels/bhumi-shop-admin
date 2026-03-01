<template>
  <div class="product-detail container" v-if="product">
    <div class="product-layout">
      <div class="product-gallery">
        <div class="main-image">
          <img 
            v-if="product.image && product.image.startsWith('data:')" 
            :src="product.image" 
            :alt="product.name"
            class="product-img"
          >
          <div v-else class="placeholder-image">{{ product.category }}</div>
        </div>
      </div>

      <div class="product-info">
        <span class="product-category">{{ getCategoryName(product.category) }}</span>
        <h1 class="product-title">{{ product.name }}</h1>
        <p v-if="product.artist" class="product-artist">Artista: {{ product.artist }}</p>
        <p class="product-price">R$ {{ product.price.toFixed(2) }}</p>
        
        <p class="product-description">{{ product.description }}</p>
        
        <p v-if="product.info" class="product-info-text">ℹ️ {{ product.info }}</p>

        <div class="product-options">
          <div v-if="product.sizes" class="size-selector">
            <label>Tamanho:</label>
            <div class="sizes">
              <button 
                v-for="size in product.sizes" 
                :key="size"
                :class="['size-btn', { active: selectedSize === size }]"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="quantity-selector">
            <label>Quantidade:</label>
            <div class="quantity-controls">
              <button @click="quantity > 1 && quantity--">-</button>
              <span>{{ quantity }}</span>
              <button @click="quantity++">+</button>
            </div>
          </div>
        </div>

        <div class="product-stock-info">
          <span :class="['stock-badge', product.stock]">
            {{ product.stock === 'print-on-demand' ? 'Impressão sob demanda' : 'Em estoque' }}
          </span>
        </div>

        <div class="product-actions">
          <button class="btn-primary" @click="addToCart">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found container">
    <h2>Produto não encontrado</h2>
    <router-link to="/produtos" class="btn-secondary">
      Voltar aos Produtos
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = computed(() => productStore.getProductById(route.params.id))
const selectedSize = ref(null)
const quantity = ref(1)

function getCategoryName(categoryId) {
  const categories = productStore.categories
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.name : categoryId
}

function addToCart() {
  if (product.value.sizes && !selectedSize.value) {
    alert('Por favor, selecione um tamanho.')
    return
  }

  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    size: selectedSize.value,
    quantity: quantity.value
  })

  alert('Produto adicionado ao carrinho!')
  router.push('/carrinho')
}
</script>

<style scoped>
.product-detail {
  padding: 3rem 1rem;
  min-height: 60vh;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.product-gallery {
  position: sticky;
  top: 100px;
}

.main-image {
  aspect-ratio: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  font-size: 4rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.product-category {
  color: var(--accent-purple-light);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.product-title {
  font-size: 2rem;
  margin: 0.5rem 0 1rem;
}

.product-price {
  font-size: 2.5rem;
  color: var(--accent-green);
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.product-artist {
  font-size: 1rem;
  color: var(--accent-purple-light);
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-info-text {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 4px;
  border-left: 3px solid var(--accent-purple);
}

.product-description {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.product-options {
  margin-bottom: 2rem;
}

.size-selector,
.quantity-selector {
  margin-bottom: 1.5rem;
}

.size-selector label,
.quantity-selector label {
  display: block;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.sizes {
  display: flex;
  gap: 0.5rem;
}

.size-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.size-btn:hover {
  border-color: var(--accent-green);
}

.size-btn.active {
  background: var(--accent-green);
  border-color: var(--accent-green);
  color: var(--bg-primary);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-controls button {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 40px;
  height: 40px;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-controls button:hover {
  border-color: var(--accent-green);
}

.quantity-controls span {
  font-size: 1.25rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.stock-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.stock-badge.print-on-demand {
  background: rgba(157, 78, 221, 0.2);
  color: var(--accent-purple-light);
  border: 1px solid var(--accent-purple);
}

.stock-badge.estoque {
  background: rgba(0, 255, 65, 0.2);
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
}

.product-actions {
  display: flex;
  gap: 1rem;
}

.product-actions .btn-primary {
  flex: 1;
}

.not-found {
  text-align: center;
  padding: 4rem 1rem;
}

.not-found h2 {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .product-layout {
    grid-template-columns: 1fr;
  }
  
  .product-gallery {
    position: static;
  }
}
</style>
