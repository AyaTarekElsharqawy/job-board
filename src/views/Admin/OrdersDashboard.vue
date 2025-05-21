<template>
  <div class="orders-dashboard">
    <h2>Order Management</h2>
    <div class="table-wrapper">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Order Status</th>
            <th>Created At</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.user.name }}</td>
            <td>{{ order.user.email }}</td>
            <td>{{ order.user.phone }}</td>
            <td>
              <span :class="['status', order.status]">{{ order.status }}</span>
            </td>
            <td>{{ new Date(order.created_at).toLocaleString() }}</td>
            <td>
              <select v-model="order.status" @change="updateOrderStatus(order)">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="7" style="text-align: center;">No orders available.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../../axios';

const orders = ref([]);

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    orders.value = res.data.data || [];
  } catch (error) {
    console.error('Failed to load orders', error);
    orders.value = [];
  }
};

const updateOrderStatus = async (order) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`/api/admin/orders/${order.id}`, { status: order.status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Order status updated successfully');
  } catch (error) {
    alert('An error occurred while updating the status');
    console.error(error);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders-dashboard {
  padding: 20px;
  background-color: #fefefe;
  min-height: 100vh;
}

h2 {
  margin-bottom: 20px;
  color: #2a3f54;
}

.table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.orders-table th {
  background-color: #2f93f7;
  color: white;
}

.status {
  padding: 5px 10px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  text-transform: capitalize;
}

.status.pending {
  background-color: #f0ad4e;
}

.status.completed {
  background-color: #5cb85c;
}

.status.canceled {
  background-color: #d9534f;
}

select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;
  cursor: pointer;
  background: white;
}

select:focus {
  border-color: #2f93f7;
  box-shadow: 0 0 5px #2f93f7;
}
</style>