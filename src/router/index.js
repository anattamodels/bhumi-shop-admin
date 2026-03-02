import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import VideosView from '../views/VideosView.vue'
import AboutView from '../views/AboutView.vue'
import ConfigView from '../views/ConfigView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import OrdersView from '../views/OrdersView.vue'

function checkAuth() {
  const savedAuth = sessionStorage.getItem('admin-session')
  if (!savedAuth) return false
  try {
    const data = JSON.parse(savedAuth)
    return !!(data && data.email)
  } catch {
    return false
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true }
    },
    {
      path: '/loja',
      name: 'home',
      component: HomeView
    },
    {
      path: '/produtos',
      name: 'products',
      component: ProductsView
    },
    {
      path: '/produtos/:id',
      name: 'product-detail',
      component: ProductDetailView
    },
    {
      path: '/carrinho',
      name: 'cart',
      component: CartView
    },
    {
      path: '/videos',
      name: 'videos',
      component: VideosView
    },
    {
      path: '/sobre',
      name: 'about',
      component: AboutView
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin',
      name: 'admin-alt',
      component: AdminView,
      meta: { requiresAuth: true }
    },
    {
      path: '/pedidos',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !checkAuth()) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && checkAuth()) {
    next({ name: 'admin' })
  } else {
    next()
  }
})

export default router
