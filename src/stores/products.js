import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('products', () => {
  const products = ref([
    {
      id: 1,
      name: 'Prata Ativa - Livro',
      category: 'livros',
      price: 89.90,
      description: 'Livro Prata Ativa - Uma jornada pelo conhecimento.',
      image: '/images/prata-ativa-capa.jpg',
      stock: 'print-on-demand',
      sizes: null
    },
    {
      id: 2,
      name: 'Camiseta Prata Ativa',
      category: 'camisetas',
      price: 79.90,
      description: 'Camiseta oficial Prata Ativa - Algodão orgânico.',
      image: '/images/camiseta-01.png',
      stock: 'print-on-demand',
      sizes: ['P', 'M', 'G', 'GG']
    },
    {
      id: 3,
      name: 'Poster Arte Digital',
      category: 'posters',
      price: 49.90,
      description: 'Poster de arte digital - Impressão alta qualidade.',
      image: '/images/poster-01.jpg',
      stock: 'print-on-demand',
      sizes: ['A4', 'A3', 'A2']
    },
    {
      id: 4,
      name: 'Caneca Arte Bhumi',
      category: 'outros',
      price: 39.90,
      description: 'Caneca cerâmica com arte exclusiva.',
      image: '/images/caneca-01.jpg',
      stock: 'print-on-demand',
      sizes: null
    },
    {
      id: 5,
      name: 'Acessório Artesanal - pulseira',
      category: 'acessorios',
      price: 29.90,
      description: 'Pulseira artesanal feita à mão.',
      image: '/images/pulseira-01.jpg',
      stock: 'estoque',
      sizes: ['Único']
    }
  ])

  const categories = ref([
    { id: 'todos', name: 'Todos', icon: '🏪' },
    { id: 'livros', name: 'Livros', icon: '📚' },
    { id: 'camisetas', name: 'Camisetas', icon: '👕' },
    { id: 'posters', name: 'Posters', icon: '🖼️' },
    { id: 'acessorios', name: 'Acessórios', icon: '💎' },
    { id: 'outros', name: 'Outros', icon: '📦' }
  ])

  const getProductById = computed(() => {
    return (id) => products.value.find(p => p.id === parseInt(id))
  })

  const getProductsByCategory = computed(() => {
    return (category) => {
      if (category === 'todos') return products.value
      return products.value.filter(p => p.category === category)
    }
  })

  function addProduct(product) {
    const newId = Math.max(...products.value.map(p => p.id)) + 1
    products.value.push({ ...product, id: newId })
  }

  return {
    products,
    categories,
    getProductById,
    getProductsByCategory,
    addProduct
  }
})
