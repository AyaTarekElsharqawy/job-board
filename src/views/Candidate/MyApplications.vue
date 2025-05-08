<template>
  <div class="my-applications">
    <h2>My Applications</h2>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="initialLoad && applications.length === 0" class="no-applications">
      No applications found.
    </div>
    <div v-else class="applications-list">
      <JobCard
        v-for="app in applications"
        :key="app.id"
        :job="app.job"
        :status="app.status"
        fromApplicationsPage
        @delete="handleDelete(app.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'
import { useApplicationStore } from '@/stores/applicationStore'
import JobCard from './JobCard.vue'

const candidateId = 1
const appStore = useApplicationStore()
const initialLoad = ref(true)

onMounted(async () => {
  await appStore.fetchByCandidate(candidateId)
  initialLoad.value = false
  await nextTick()
})

const { applications, loading, error } = appStore

const handleDelete = async (id) => {
  await appStore.deleteApplication(id)
}
</script>

<style scoped>
.my-applications {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.loading {
  text-align: center;
  color: #666;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  text-align: center;
  color: #e74c3c;
  padding: 2rem;
  font-size: 1.2rem;
}

.no-applications {
  text-align: center;
  color: #666;
  padding: 2rem;
  font-size: 1.2rem;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>