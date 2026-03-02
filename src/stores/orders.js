import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchOrders() {
    loading.value = true
    error.value = null
    
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*, order_items(*), order_status_history(*)')
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      error.value = fetchError.message
    } else {
      orders.value = data || []
    }
    
    loading.value = false
  }

  async function updateOrderStatus(orderId, newStatus, description) {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
    
    if (updateError) throw updateError

    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status: newStatus,
        description: description
      })
    
    if (historyError) throw historyError
    
    await fetchOrders()
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus
  }
})
