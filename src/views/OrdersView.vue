<template>
  <div class="orders-page">
    <div class="page-header">
      <h1 class="page-title">Pedidos</h1>
      <button class="btn-primary" @click="orderStore.fetchOrders()">
        🔄 Atualizar
      </button>
    </div>

    <div v-if="orderStore.loading" class="loading">
      Carregando pedidos...
    </div>

    <div v-else-if="orderStore.error" class="error-message">
      Erro: {{ orderStore.error }}
    </div>

    <div v-else-if="orderStore.orders.length === 0" class="no-orders">
      <p>Nenhum pedido encontrado.</p>
    </div>

    <div v-else class="orders-list">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Nº Pedido</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Pagamento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orderStore.orders" :key="order.id">
            <td class="order-number">{{ order.order_number }}</td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>
              <div class="customer-info">
                <strong>{{ order.customer_name }}</strong>
                <span>{{ order.customer_email }}</span>
                <span>{{ order.customer_phone }}</span>
              </div>
            </td>
            <td class="order-total">R$ {{ formatPrice(order.total) }}</td>
            <td>{{ getPaymentMethodLabel(order.payment_method) }}</td>
            <td>
              <span :class="['status-badge', order.status]">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="actions">
              <button class="btn-icon" @click="openOrderDetails(order)" title="Ver detalhes">
                👁️
              </button>
              <select 
                :value="order.status" 
                @change="updateStatus(order.id, $event.target.value)"
                class="status-select"
              >
                <option value="pending">Pendente</option>
                <option value="processing">Processando</option>
                <option value="paid">Pago</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal">
        <div class="modal-header">
          <h2>Pedido {{ selectedOrder.order_number }}</h2>
          <button class="close-btn" @click="selectedOrder = null">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="order-details">
            <div class="detail-section">
              <h3>Dados do Cliente</h3>
              <p><strong>Nome:</strong> {{ selectedOrder.customer_name }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.customer_email }}</p>
              <p><strong>Telefone:</strong> {{ selectedOrder.customer_phone }}</p>
              <p><strong>Endereço:</strong> {{ selectedOrder.shipping_address || 'Não informado' }}</p>
            </div>

            <div class="detail-section">
              <h3>Itens do Pedido</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Qtd</th>
                    <th>Tamanho</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.order_items" :key="item.id">
                    <td>{{ item.product_name }}</td>
                    <td>R$ {{ formatPrice(item.product_price) }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.size || '-' }}</td>
                    <td>R$ {{ formatPrice(item.product_price * item.quantity) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4"><strong>Total</strong></td>
                    <td><strong>R$ {{ formatPrice(selectedOrder.total) }}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="detail-section">
              <h3>Histórico de Status</h3>
              <div class="status-history">
                <div 
                  v-for="(item, index) in selectedOrder.order_status_history" 
                  :key="index"
                  class="history-item"
                >
                  <span class="history-status">{{ getStatusLabel(item.status) }}</span>
                  <span class="history-date">{{ formatDate(item.created_at) }}</span>
                  <span class="history-desc">{{ item.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '../stores/orders'

const orderStore = useOrderStore()
const selectedOrder = ref(null)

onMounted(() => {
  orderStore.fetchOrders()
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatPrice(price) {
  return Number(price).toFixed(2).replace('.', ',')
}

function getPaymentMethodLabel(method) {
  const labels = {
    pix: 'PIX',
    mercadopago: 'Mercado Pago',
    paypal: 'PayPal',
    whatsapp: 'WhatsApp'
  }
  return labels[method] || method
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendente',
    processing: 'Processando',
    paid: 'Pago',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

function openOrderDetails(order) {
  selectedOrder.value = order
}

async function updateStatus(orderId, newStatus) {
  const descriptions = {
    pending: 'Aguardando pagamento',
    processing: 'Pagamento em análise',
    paid: 'Pagamento confirmado',
    shipped: 'Pedido enviado',
    delivered: 'Pedido entregue',
    cancelled: 'Pedido cancelado'
  }
  
  try {
    await orderStore.updateOrderStatus(orderId, newStatus, descriptions[newStatus])
    alert('Status atualizado!')
  } catch (error) {
    alert('Erro ao atualizar: ' + error.message)
  }
}
</script>

<style scoped>
.orders-page {
  padding: 2rem 1rem;
  min-height: 80vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--text-primary);
}

.loading, .error-message, .no-orders {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.error-message {
  color: #ff4444;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card);
  border-radius: 8px;
  overflow: hidden;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.orders-table th {
  background: var(--bg-secondary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.orders-table tr:hover {
  background: var(--bg-secondary);
}

.order-number {
  font-weight: 600;
  color: var(--accent-purple-light);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-info span {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.order-total {
  font-weight: 600;
  color: var(--accent-green);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status-badge.processing {
  background: rgba(123, 44, 191, 0.2);
  color: var(--accent-purple-light);
}

.status-badge.paid {
  background: rgba(0, 255, 65, 0.2);
  color: var(--accent-green);
}

.status-badge.shipped {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.status-badge.delivered {
  background: rgba(0, 255, 65, 0.3);
  color: var(--accent-green);
}

.status-badge.cancelled {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-icon {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-icon:hover {
  border-color: var(--accent-purple);
}

.status-select {
  padding: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
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
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  color: var(--accent-purple-light);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  margin-bottom: 1rem;
  color: var(--accent-green);
}

.detail-section p {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.items-table tfoot td {
  font-weight: 600;
  color: var(--accent-green);
}

.status-history {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 4px;
}

.history-status {
  font-weight: 600;
  color: var(--accent-purple-light);
  min-width: 100px;
}

.history-date {
  color: var(--text-muted);
  font-size: 0.85rem;
  min-width: 150px;
}

.history-desc {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .orders-table {
    font-size: 0.85rem;
  }
  
  .orders-table th,
  .orders-table td {
    padding: 0.5rem;
  }
  
  .customer-info span {
    display: none;
  }
}
</style>
