<template>
  <div class="products-page container">
    <h1 class="page-title">Nossos Produtos</h1>
    
    <div class="filters">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        :class="['filter-btn', { active: activeCategory === cat.id }]"
        @click="activeCategory = cat.id"
      >
        <span>{{ cat.icon }}</span>
        {{ cat.name }}
      </button>
    </div>

    <div class="products-grid">
      <router-link 
        v-for="product in filteredProducts" 
        :key="product.id"
        :to="`/produtos/${product.id}`"
        class="product-card card"
      >
        <div class="product-image">
          <img 
            v-if="product.image && product.image.startsWith('data:')" 
            :src="product.image" 
            :alt="product.name"
            class="product-img"
          >
          <div v-else class="placeholder-image">{{ product.category }}</div>
          <span class="product-badge">{{ getCategoryName(product.category) }}</span>
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-footer">
            <span class="product-price">R$ {{ product.price.toFixed(2) }}</span>
            <span class="product-stock" :class="product.stock">
              {{ product.stock === 'print-on-demand' ? 'Sob demanda' : 'Em estoque' }}
            </span>
          </div>
        </div>
      </router-link>
    </div>

    <div v-if="filteredProducts.length === 0" class="no-products">
      <p>Nenhum produto encontrado nesta categoria.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/products'

const route = useRoute()
const productStore = useProductStore()

const activeCategory = ref('todos')
const categories = computed(() => productStore.categories)

const filteredProducts = computed(() => {
  return productStore.getProductsByCategory(activeCategory.value)
})

function getCategoryName(categoryId) {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat ? cat.name : categoryId
}

watch(() => route.query.categoria, (newCategory) => {
  if (newCategory) {
    activeCategory.value = newCategory
  }
}, { immediate: true })
</script>

<style scoped>
.products-page {
  padding: 2rem 1rem;
  min-height: 60vh;
}

.page-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.filter-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--accent-purple);
  color: var(--text-primary);
}

.filter-btn.active {
  background: var(--accent-purple);
  border-color: var(--accent-purple);
  color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  text-decoration: none;
  color: inherit;
}

.product-image {
  height: 220px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  font-size: 3rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--accent-purple);
  color: white;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 4px;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.product-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  color: var(--accent-green);
  font-size: 1.25rem;
  font-weight: 700;
}

.product-stock {
  font-size: 0.75rem;
  text-transform: uppercase;
}

.product-stock.print-on-demand {
  color: var(--accent-purple-light);
}

.product-stock.estoque {
  color: var(--accent-green);
}

.no-products {
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
}
</style>
