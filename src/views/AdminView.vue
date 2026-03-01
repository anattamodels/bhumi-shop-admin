<template>
  <div class="admin-page container">
    <div class="admin-header">
      <h1 class="page-title">Painel Admin - BhumiShop</h1>
      <div class="header-actions">
        <button @click="exportCSV" class="btn-secondary export-btn">
          📊 Download CSV
        </button>
        <button @click="exportPDF" class="btn-secondary export-btn">
          📄 Download PDF
        </button>
        <button @click="showAddModal = true" class="btn-primary">
          + Adicionar Produto
        </button>
        <button @click="logout" class="btn-secondary">
          🚪 Sair
        </button>
      </div>
    </div>

    <div class="admin-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'products' }]"
        @click="activeTab = 'products'"
      >
        Produtos ({{ products.length }})
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'categories' }]"
        @click="activeTab = 'categories'"
      >
        Categorias
      </button>
    </div>

    <div v-if="activeTab === 'products'" class="products-management">
      <div class="filters">
        <select v-model="filterCategory" class="filter-select">
          <option value="">Todas as categorias</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar produto..."
          class="search-input"
        >
      </div>

      <div class="products-table">
        <table>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Artista</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-thumb">
                  {{ product.category?.charAt(0) || 'P' }}
                </div>
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.artist || '-' }}</td>
              <td>
                <span class="category-badge">{{ getCategoryName(product.category) }}</span>
              </td>
              <td>R$ {{ product.price.toFixed(2) }}</td>
              <td>
                <span :class="['stock-badge', product.stock]">
                  {{ product.stock === 'print-on-demand' ? 'Sob demanda' : 'Estoque' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="editProduct(product)" class="edit-btn">✏️</button>
                  <button @click="deleteProduct(product.id)" class="delete-btn">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredProducts.length === 0" class="no-products">
        <p>Nenhum produto encontrado.</p>
      </div>
    </div>

    <div v-if="activeTab === 'categories'" class="categories-management">
      <div class="category-cards">
        <div v-for="cat in categories" :key="cat.id" class="category-edit-card">
          <div class="cat-info">
            <span class="cat-icon">{{ cat.icon }}</span>
            <input v-model="cat.name" @blur="saveCategories" class="cat-name-input">
          </div>
          <button @click="deleteCategory(cat.id)" class="delete-btn">🗑️</button>
        </div>
        
        <div class="add-category-card">
          <input 
            v-model="newCategory" 
            placeholder="Nova categoria..."
            @keyup.enter="addCategory"
          >
          <button @click="addCategory" class="btn-secondary">+</button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal || editingProduct" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}</h2>
        
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Nome do produto</label>
            <input v-model="productForm.name" required>
          </div>

          <div class="form-group">
            <label>Categoria</label>
            <select v-model="productForm.category" required>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Preço (R$)</label>
              <input v-model.number="productForm.price" type="number" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Tipo de estoque</label>
              <select v-model="productForm.stock">
                <option value="print-on-demand">Sob demanda</option>
                <option value="estoque">Estoque</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Descrição</label>
            <textarea v-model="productForm.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Imagem do produto</label>
            <div class="image-upload">
              <input 
                type="file" 
                accept="image/*" 
                @change="handleImageUpload"
                id="image-upload"
              >
              <label for="image-upload" class="upload-btn">
                📁 Escolher imagem
              </label>
              <span v-if="productForm.imagePreview" class="preview-text">
                ✅ Imagem carregada
              </span>
            </div>
            <input 
              v-model="productForm.image" 
              placeholder="Ou cole URL da imagem"
              class="url-input"
            >
          </div>

          <div class="form-group">
            <label>Artista</label>
            <input v-model="productForm.artist" placeholder="Nome do artista/autor">
          </div>

          <div class="form-group">
            <label>Info</label>
            <input v-model="productForm.info" placeholder="Informações adicionais">
          </div>

          <div v-if="productForm.category === 'camisetas'" class="form-group">
            <label>Tamanhos (separados por vírgula)</label>
            <input v-model="sizesInput" placeholder="P, M, G, GG">
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ editingProduct ? 'Salvar' : 'Adicionar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { useProductStore } from '../stores/products'

const productStore = useProductStore()

const products = computed(() => productStore.products)
const categories = computed(() => productStore.categories)

const activeTab = ref('products')
const searchQuery = ref('')
const filterCategory = ref('')
const showAddModal = ref(false)
const editingProduct = ref(null)
const newCategory = ref('')
const sizesInput = ref('')

const defaultForm = {
  name: '',
  category: 'livros',
  price: 0,
  description: '',
  stock: 'print-on-demand',
  image: '',
  imagePreview: false,
  artist: '',
  info: ''
}

const productForm = ref({ ...defaultForm })

const filteredProducts = computed(() => {
  let result = products.value
  
  if (filterCategory.value) {
    result = result.filter(p => p.category === filterCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }
  
  return result
})

function getCategoryName(categoryId) {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat ? cat.name : categoryId
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.value.image = e.target.result
      productForm.value.imagePreview = true
    }
    reader.readAsDataURL(file)
  }
}

function editProduct(product) {
  editingProduct.value = product
  productForm.value = { ...product }
  sizesInput.value = product.sizes ? product.sizes.join(', ') : ''
}

function deleteProduct(id) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    productStore.products = productStore.products.filter(p => p.id !== id)
    saveToStorage()
  }
}

function closeModal() {
  showAddModal.value = false
  editingProduct.value = null
  productForm.value = { ...defaultForm }
  sizesInput.value = ''
}

function saveProduct() {
  const sizes = sizesInput.value ? sizesInput.value.split(',').map(s => s.trim()) : null
  
  const productData = {
    ...productForm.value,
    sizes,
    image: productForm.value.image || '/images/placeholder.png'
  }
  
  if (editingProduct.value) {
    const index = productStore.products.findIndex(p => p.id === editingProduct.value.id)
    if (index !== -1) {
      productStore.products[index] = { ...editingProduct.value, ...productData }
    }
  } else {
    const newId = Math.max(...productStore.products.map(p => p.id), 0) + 1
    productStore.products.push({ ...productData, id: newId })
  }
  
  saveToStorage()
  closeModal()
}

function addCategory() {
  if (!newCategory.value.trim()) return
  
  const id = newCategory.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const icon = '📦'
  
  if (!categories.value.find(c => c.id === id)) {
    productStore.categories.push({ id, name: newCategory.value, icon })
    saveToStorage()
  }
  
  newCategory.value = ''
}

function deleteCategory(id) {
  if (confirm('Excluir esta categoria? Os produtos não serão excluídos.')) {
    productStore.categories = productStore.categories.filter(c => c.id !== id)
    saveToStorage()
  }
}

function saveCategories() {
  saveToStorage()
}

function saveToStorage() {
  localStorage.setItem('bhumi-products', JSON.stringify(productStore.products))
  localStorage.setItem('bhumi-categories', JSON.stringify(productStore.categories))
}

function exportCSV() {
  const headers = ['ID', 'Nome', 'Artista', 'Categoria', 'Preço', 'Estoque', 'Descrição', 'Info']
  const rows = products.value.map(p => [
    p.id,
    p.name,
    p.artist || '',
    getCategoryName(p.category),
    p.price.toFixed(2),
    p.stock === 'print-on-demand' ? 'Sob demanda' : 'Estoque',
    p.description || '',
    p.info || ''
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().split('T')[0]
  link.setAttribute('href', url)
  link.setAttribute('download', `bhumi-produtos-${date}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportPDF() {
  const doc = new jsPDF()
  const date = new Date().toLocaleDateString('pt-BR')
  
  doc.setFontSize(18)
  doc.text('BhumiShop - Relatório de Produtos', 14, 22)
  
  doc.setFontSize(10)
  doc.text(`Data: ${date}`, 14, 30)
  doc.text(`Total de produtos: ${products.value.length}`, 14, 36)
  
  const tableData = products.value.map(p => [
    p.id,
    p.name,
    p.artist || '-',
    getCategoryName(p.category),
    `R$ ${p.price.toFixed(2)}`,
    p.stock === 'print-on-demand' ? 'Sob demanda' : 'Estoque'
  ])
  
  doc.autoTable({
    head: [['ID', 'Nome', 'Artista', 'Categoria', 'Preço', 'Estoque']],
    body: tableData,
    startY: 42,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [123, 44, 191] }
  })
  
  doc.save(`bhumi-produtos-${new Date().toISOString().split('T')[0]}.pdf`)
}

function logout() {
  sessionStorage.removeItem('admin-auth')
  window.location.href = '/login'
}

onMounted(() => {
  const isAuth = sessionStorage.getItem('admin-auth')
  if (!isAuth) {
    window.location.href = '/login'
    return
  }
  
  const savedProducts = localStorage.getItem('bhumi-products')
  const savedCategories = localStorage.getItem('bhumi-categories')
  
  if (savedProducts) {
    productStore.products = JSON.parse(savedProducts)
  }
  if (savedCategories) {
    productStore.categories = JSON.parse(savedCategories)
  }
})
</script>

<style scoped>
.admin-page {
  padding: 2rem 1rem;
  min-height: 80vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.export-btn {
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.page-title {
  font-size: 2rem;
}

.admin-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.tab-btn {
  background: transparent;
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: var(--accent-purple);
  color: white;
}

.tab-btn:hover:not(.active) {
  border-color: var(--accent-purple);
  color: var(--text-primary);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-select,
.search-input {
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 4px;
}

.filter-select {
  min-width: 200px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.products-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background: var(--bg-secondary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.product-thumb {
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--accent-purple);
}

.category-badge {
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.stock-badge {
  font-size: 0.75rem;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.stock-badge.print-on-demand {
  background: rgba(157, 78, 221, 0.2);
  color: var(--accent-purple-light);
}

.stock-badge.estoque {
  background: rgba(0, 255, 65, 0.2);
  color: var(--accent-green);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  border-color: var(--accent-green);
}

.delete-btn:hover {
  border-color: #ff4444;
}

.no-products {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.category-edit-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cat-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cat-icon {
  font-size: 1.5rem;
}

.cat-name-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem;
  border-radius: 4px;
}

.add-category-card {
  background: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
}

.add-category-card input {
  flex: 1;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem;
  border-radius: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem;
  border-radius: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.image-upload input[type="file"] {
  display: none;
}

.upload-btn {
  background: var(--bg-secondary);
  border: 1px dashed var(--accent-purple);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.upload-btn:hover {
  border-color: var(--accent-green);
  background: rgba(0, 255, 65, 0.1);
}

.preview-text {
  color: var(--accent-green);
  font-size: 0.85rem;
}

.url-input {
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
