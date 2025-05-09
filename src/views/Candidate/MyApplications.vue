<template>
  <div class="applications-page min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="text-center text-gray-600 text-lg">Loading applications...</div>
    <div v-if="error" class="text-center text-red-600 text-lg font-medium">{{ error }}</div>
    <div v-else-if="applications.length === 0" class="text-center text-gray-500 text-lg py-12">
      No applications found.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="application in applications" :key="application.id" class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        <h3 class="text-xl font-semibold text-blue-800 mb-2">{{ application.job.title }}</h3>
        <p class="text-gray-600 text-sm mb-1">Type: {{ application.job.type }}</p>
        <p class="text-sm mb-1">
          Status:
          <span :class="{
            'text-green-600 font-medium': application.status.toLowerCase() === 'accepted',
            'text-yellow-600 font-medium': application.status.toLowerCase() === 'pending',
            'text-red-600 font-medium': application.status.toLowerCase() === 'rejected'
          }">{{ application.status }}</span>
        </p>
        <p class="text-gray-500 text-sm mb-1">Location: {{ application.job.location }}</p>
        <p class="text-gray-500 text-sm">Deadline: {{ new Date(application.job.deadline).toLocaleDateString() }}</p>
        <div class="mt-4 flex space-x-3">
          <button @click="viewJobDetails(application.job.id)" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">View Details</button>
          <button v-if="application.status.toLowerCase() === 'pending'" @click="cancelApplication(application.id)" class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicationStore } from '@/stores/applicationStore'

const router = useRouter()
const applicationStore = useApplicationStore()
const applications = ref([])
const loading = ref(false)
const error = ref(null)
const currentUserId = 'c7a6'

onMounted(async () => {
  loading.value = true
  try {
    await applicationStore.fetchByCandidate(currentUserId)
    applications.value = applicationStore.applications
  } catch (err) {
    error.value = 'Failed to load applications'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const viewJobDetails = (jobId) => {
  router.push({ name: 'JobDetails', params: { id: jobId } })
}

const cancelApplication = async (applicationId) => {
  if (confirm('Are you sure you want to cancel this application?')) {
    try {
      await applicationStore.deleteApplication(applicationId)
      applications.value = applications.value.filter(app => app.id !== applicationId)
    } catch (err) {
      error.value = 'Failed to cancel application'
      console.error(err)
    }
  }
}
</script>
<style scoped>
.applications-page {
  background-color: #f9fafb;
  padding: 2rem 1rem;
}

.bg-white {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.bg-white:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.text-blue-800 {
  color: #1e3a8a;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-green-600 {
  color: #16a34a !important;
  font-weight: 600;
  background-color: rgba(22, 163, 74, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
}

.text-yellow-600 {
  color: #2563eb !important;
  font-weight: 600;
  background-color: rgba(37, 99, 235, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
}

.text-red-600 {
  color: #dc2626 !important;
  font-weight: 600;
  background-color: rgba(220, 38, 38, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
}

button {
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.bg-blue-600 {
  background-color: #2563eb;
}
.bg-blue-600:hover {
  background-color: #1e40af;
}

.bg-red-600 {
  background-color: #dc2626;
}
.bg-red-600:hover {
  background-color: #b91c1c;
}
</style>
