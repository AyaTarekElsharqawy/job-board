<template>
  <div class="user-management">
    <h2>User Management</h2>
    
    <div class="export-actions">
      <button @click="exportToCSV" class="export-btn">
        <i class="fas fa-file-csv"></i> Export to CSV
      </button>
      <button @click="exportToExcel" class="export-btn">
        <i class="fas fa-file-excel"></i> Export to Excel
      </button>
      <button @click="exportToPDF" class="export-btn">
        <i class="fas fa-file-pdf"></i> Export to PDF
      </button>
    </div>
    
    <div class="user-filters">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by name or email"
        @input="filterUsers"
      />
      
      <select v-model="roleFilter" @change="filterUsers">
        <option value="">All Types</option>
        <option value="employer">Employers</option>
        <option value="candidate">Candidates</option>
      </select>
      
      <select v-model="statusFilter" @change="filterUsers">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="banned">Banned</option>
      </select>
    </div>
    
    <div v-if="loading" class="user-table-skeleton">
      <SkeletonLoader 
        v-for="i in 5" 
        :key="i"
        height="60px"
        class="skeleton-row"
      />
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="!loading && filteredUsers.length === 0" class="no-users">
      No users found
    </div>
    
    <div v-if="!loading && filteredUsers.length > 0" class="user-table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Registered</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>
              <img 
                :src="user.avatar || '/default-avatar.png'" 
                :alt="user.name"
                class="user-avatar"
              />
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['user-type', user.role]">
                {{ user.role === 'employer' ? 'Employer' : 'Candidate' }}
              </span>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td>
              <span :class="['user-status', user.status]">
                {{ user.status === 'active' ? 'Active' : 'Banned' }}
              </span>
            </td>
            <td>
              <button 
                v-if="user.status === 'active'"
                @click="banUser(user.id)"
                class="ban-btn"
              >
                Ban
              </button>
              <button
                v-else
                @click="unbanUser(user.id)"
                class="unban-btn"
              >
                Unban
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="changePage"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { useDebounce } from '../composables/useDebounce'
import { usePdfExport } from '../composables/usePdfExport'
import { useExcelExport } from '../composables/useExcelExport'
import SkeletonLoader from './SkeletonLoader.vue'
import Pagination from './Pagination.vue'

export default {
  components: { SkeletonLoader, Pagination },
  setup() {
    const adminStore = useAdminStore()
    const { exportToPDF } = usePdfExport()
    const { exportToExcel, exportToCSV } = useExcelExport()
    
    const searchQuery = ref('')
    const roleFilter = ref('')
    const statusFilter = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10
    
    const debouncedSearchQuery = useDebounce(searchQuery, 500)
    
    onMounted(async () => {
      try {
        await adminStore.fetchAllUsers()
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    })
    
    const filteredUsers = computed(() => {
  const users = Array.isArray(adminStore.allUsers) ? adminStore.allUsers : []
  return users.filter(user => {
        const matchesSearch = 
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        const matchesRole = roleFilter.value 
          ? user.role === roleFilter.value 
          : true
        
        const matchesStatus = statusFilter.value
          ? user.status === statusFilter.value
          : true
        
        return matchesSearch && matchesRole && matchesStatus
      })
    })
    
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredUsers.value.slice(start, end)
    })
    
    const totalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / itemsPerPage)
    })
    
    const changePage = (page) => {
      currentPage.value = page
    }
    
    const banUser = async (userId) => {
      try {
        await adminStore.banUser(userId)
      } catch (error) {
        console.error('Failed to ban user:', error)
      }
    }
    
    const unbanUser = async (userId) => {
      try {
        await adminStore.unbanUser(userId)
      } catch (error) {
        console.error('Failed to unban user:', error)
      }
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    
    const exportUsers = (type) => {
      const headers = [
        'Name', 'Email', 'Type', 'Registration Date', 'Status'
      ]
      
      const data = filteredUsers.value.map(user => [
        user.name,
        user.email,
        user.role === 'employer' ? 'Employer' : 'Candidate',
        formatDate(user.created_at),
        user.status === 'active' ? 'Active' : 'Banned'
      ])
      
      const title = 'Users List'
      const fileName = `users_${new Date().toISOString().split('T')[0]}`
      
      if (type === 'pdf') {
        exportToPDF(title, headers, data, fileName)
      } else if (type === 'excel') {
        exportToExcel(title, headers, data, fileName)
      } else {
        exportToCSV(headers, data, fileName)
      }
    }
    
    return {
      searchQuery,
      roleFilter,
      statusFilter,
      currentPage,
      filteredUsers,
      paginatedUsers,
      totalPages,
      loading: computed(() => adminStore.loading),
      error: computed(() => adminStore.error),
      changePage,
      banUser,
      unbanUser,
      formatDate,
      exportToPDF: () => exportUsers('pdf'),
      exportToExcel: () => exportUsers('excel'),
      exportToCSV: () => exportUsers('csv')
    }
  }
}
</script>

<style scoped>
.user-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.export-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.export-btn {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.user-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.user-filters input,
.user-filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.user-table th {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-type.employer {
  color: #2196f3;
}

.user-type.candidate {
  color: #4caf50;
}

.user-status.active {
  color: #4caf50;
}

.user-status.banned {
  color: #f44336;
}

.ban-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.unban-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.error {
  color: #f44336;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 20px;
}

.no-users {
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.user-table-skeleton {
  margin-top: 20px;
}

.skeleton-row {
  margin-bottom: 10px;
}
</style>