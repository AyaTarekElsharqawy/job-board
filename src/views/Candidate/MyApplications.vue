<template>
  <div class="applications-page">
    <h2>My Applications</h2>
    <div v-if="loading">Loading applications...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="applications.length === 0" class="text-center text-gray-500">
      No applications found.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <JobsCard
        v-for="application in applications"
        :key="application.id"
        :job="application.job"
        :status="application.status"
        :fromApplicationsPage="true"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'
import { useApplicationStore } from '@/stores/applicationStore'
import JobsCard from './JobsCard.vue' // تعديل الاستيراد هنا

const applicationStore = useApplicationStore()
const applications = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    await applicationStore.fetchApplications()
    applications.value = applicationStore.applications
  } catch (err) {
    error.value = 'Failed to load applications'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.applications-page {
  padding: 2rem;
}
</style>