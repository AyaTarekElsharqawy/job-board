<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Job Management</h1>

    <div class="p-4 bg-white rounded shadow mb-4 flex flex-wrap gap-4 items-end">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search by job title or company"
        class="border p-2 rounded w-64"
      />

      <select v-model="filters.status" class="border p-2 rounded">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <select v-model="filters.type" class="border p-2 rounded">
        <option value="">All Types</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="remote">Remote</option>
      </select>

      <input
        v-model="filters.date"
        type="date"
        class="border p-2 rounded"
      />

      <button @click="getJobs" class="bg-blue-600 text-white px-4 py-2 rounded">
        Apply Filter
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full bg-white rounded shadow text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">#</th>
            <th class="p-2">Title</th>
            <th class="p-2">Company</th>
            <th class="p-2">Type</th>
            <th class="p-2">Status</th>
            <th class="p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, index) in jobs" :key="job.id" class="border-b">
            <td class="p-2">{{ index + 1 }}</td>
            <td class="p-2">{{ job.title }}</td>
            <td class="p-2">{{ job.company }}</td>
            <td class="p-2">{{ job.type }}</td>
            <td class="p-2">
              <span
                :class="{
                  'text-yellow-500': job.status === 'pending',
                  'text-green-600': job.status === 'approved',
                  'text-red-600': job.status === 'rejected'
                }"
              >
                {{ getStatusText(job.status) }}
              </span>
            </td>
            <td class="p-2">{{ job.created_at }}</td>
          </tr>
          <tr v-if="jobs.length === 0">
            <td class="p-4 text-center text-gray-500" colspan="6">No results found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const jobs = ref([]);

const filters = ref({
  search: '',
  status: '',
  type: '',
  date: ''
});

const getJobs = async () => {
  try {
    const response = await axios.get('/api/admin/jobs', {
      params: filters.value
    });
    jobs.value = response.data.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      return status;
  }
};

onMounted(() => {
  getJobs();
});
</script>

<style scoped>
/* Navbar Styles */
.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #2a3f54;
  color: white;
  height: 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
  border-radius: 4px;
}

.app-name {
  font-weight: bold;
  font-size: 1.2rem;
}

.navbar-menu {
  display: flex;
  flex-grow: 1;
  justify-content: center;
}

.nav-link {
  padding: 0 15px;
  height: 60px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  border-bottom: 3px solid #00bcd4;
}

.nav-icon {
  margin-right: 8px;
  font-size: 0.9rem;
}

.nav-text {
  font-size: 0.9rem;
}

.navbar-user {
  display: flex;
  align-items: center;
}

.welcome-msg {
  margin-right: 15px;
  font-size: 0.9rem;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Main Content Styles */
.filters-container {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.header-section {
  margin-bottom: 20px;
}

.page-title {
  color: #2a3f54;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 1.8rem;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.filters-table {
  width: 100%;
  border-collapse: collapse;
}

.filters-table th {
  background-color: #2f93f7;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
}

.filters-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e6f1;
  color: #2a3f54;
  vertical-align: top;
}

.filters-table tr:last-child td {
  border-bottom: none;
}

.filters-table tr:hover {
  background-color: rgba(0, 188, 212, 0.05);
}

.filter-details pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 500px;
  max-height: 150px;
  overflow: auto;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e0e6f1;
}

.delete-btn {
  padding: 6px 12px;
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.delete-btn:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.message {
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 4px;
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

@media (max-width: 768px) {
  .main-navbar {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  
  .navbar-menu {
    flex-direction: column;
    width: 100%;
    margin: 10px 0;
  }
  
  .nav-link {
    width: 100%;
    justify-content: center;
    height: 45px;
  }
  
  .navbar-user {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .table-wrapper {
    overflow-x: auto;
  }
  
  .filter-details pre {
    max-width: 200px;
  }
}
</style>