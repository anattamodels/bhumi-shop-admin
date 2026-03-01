import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)

  const getProductById = computed(() => {
    return (id) => products.value.find(p => p.id === parseInt(id))
  })

  const getProductsByCategory = computed(() => {
    return (category) => {
      if (category === 'todos') return products.value
      return products.value.filter(p => p.category === category)
    }
  })

  async function fetchProducts() {
    loading.value = true
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })
    
    if (data) {
      products.value = data
    }
    loading.value = false
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (data) {
      categories.value = data
    }
  }

  async function addProduct(product) {
    const productData = {
      name: product.name,
      category: product.category,
      price: parseFloat(product.price) || 0,
      description: product.description || '',
      stock: product.stock || 'print-on-demand',
      image: product.image || '',
      artist: product.artist || '',
      info: product.info || '',
      sizes: product.sizes || null
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
    
    if (error) {
      console.error('Error adding product:', error)
      alert('Erro ao adicionar produto: ' + error.message)
      return
    }
    
    if (data && data[0]) {
      products.value.unshift(data[0])
    }
  }

  async function updateProduct(id, updates) {
    const productData = {
      name: updates.name,
      category: updates.category,
      price: parseFloat(updates.price) || 0,
      description: updates.description || '',
      stock: updates.stock || 'print-on-demand',
      image: updates.image || '',
      artist: updates.artist || '',
      info: updates.info || '',
      sizes: updates.sizes || null
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating product:', error)
      alert('Erro ao atualizar produto: ' + error.message)
      return
    }
    
    if (data && data[0]) {
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = data[0]
      }
    }
  }

  async function deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (!error) {
      products.value = products.value.filter(p => p.id !== id)
    }
  }

  async function addCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
    
    if (data && data[0]) {
      categories.value.push(data[0])
    }
  }

  async function deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (!error) {
      categories.value = categories.value.filter(c => c.id !== id)
    }
  }

  return {
    products,
    categories,
    loading,
    getProductById,
    getProductsByCategory,
    fetchProducts,
    fetchCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory
  }
})
