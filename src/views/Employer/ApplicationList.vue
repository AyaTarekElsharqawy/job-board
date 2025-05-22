<template>
  <div class="container mt-4">
    <h3 class="mb-3">Job Applications</h3>

    <div v-if="applications.length" class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Applicant</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Status</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(app, index) in applications" :key="app.id">
            <td>{{ getGlobalIndex(index) }}</td>
            <td>{{ app.user.name }}</td>
            <td>{{ app.user.email }}</td>
            <td>{{ app.job.title }}</td>
            <td>
              <span class="badge" 
                :class="{
                  'bg-warning text-dark': app.status === 'pending',
                  'bg-success': app.status === 'accepted',
                  'bg-danger': app.status === 'rejected'
                }">
                {{ app.status }}
              </span>
            </td>
            <td>
              <a :href="'http://localhost:8000/' + app.resume_snapshot" 
                 target="_blank" class="btn btn-sm btn-outline-primary">
                View
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Info -->
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-muted">
          Showing {{ getStartIndex() }} to {{ getEndIndex() }} of {{ totalApplications }} applications
        </span>

        <!-- Pagination Controls -->
        <nav>
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
            </li>

            <li v-for="page in visiblePages" :key="page" :class="{ active: currentPage === page }" class="page-item">
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === lastPage }">
              <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div v-else-if="!loading" class="alert alert-info text-center">
      No applications found.
    </div>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// State
const applications = ref([])
const loading = ref(false)

const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(10)
const totalApplications = ref(0)

const user = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')

if (!user || user.role !== 'employer') {
  window.location.href = '/' // Redirect to home if not employer
}

const fetchApplications = async () => {
  try {
    loading.value = true
    const response = await axios.get(`http://localhost:8000/api/employer/applcations/${user.id}?page=${currentPage.value}&per_page=${perPage.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data.success) {
      applications.value = response.data.data
      currentPage.value = response.data.current_page
      lastPage.value = response.data.last_page
      perPage.value = response.data.per_page
      totalApplications.value = response.data.total_applications
    }
  } catch (error) {
    console.error('Failed to fetch applications:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchApplications)

// Pagination helpers
const getGlobalIndex = (i) => (currentPage.value - 1) * perPage.value + i + 1
const getStartIndex = () => (currentPage.value - 1) * perPage.value + 1
const getEndIndex = () => Math.min(currentPage.value * perPage.value, totalApplications.value)

const goToPage = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page
    fetchApplications()
  }
}

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(lastPage.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>
