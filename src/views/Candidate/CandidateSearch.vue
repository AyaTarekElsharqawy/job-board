<template>
  <div class="p-6">
    <JobFilter @filterChanged="applyFilters" />

    <div v-if="loading">Loading jobs...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="jobs.length === 0 && !loading" class="text-center text-gray-500">
      No jobs found.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <CandidateJobCard
        v-for="job in jobs"
        :key="job.id"
        :job="job"
        @openDetails="goToDetails"
        @applyNow="applyNow"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import JobFilter from '@/components/jobs/JobFilters.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useCandidateStore } from '@/stores/candidateStore'
import { useApplicationStore } from '@/stores/applicationStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const jobs = ref([])
const loading = ref(false)
const error = ref(null)

const auth = useAuthStore()
const applicationStore = useApplicationStore()
const candidateStore = useCandidateStore()

const applyFilters = async (filters) => {
  loading.value = true
  error.value = null
  try {
    const query = new URLSearchParams(filters).toString()
    const res = await axios.get(`http://localhost:3000/jobs?${query}`)
    jobs.value = res.data
  } catch (err) {
    error.value = 'Failed to load jobs'
  } finally {
    loading.value = false
  }
}

const goToDetails = (id) => {
  router.push(`/job-details/${id}`)
}

const applyNow = async (job) => {
  const candidate = candidateStore.candidates.find(c => c.user_id === auth.user.id)
  if (!candidate) return alert('Candidate not found.')

  await applicationStore.createApplication({
    job_id: job.id,
    candidate_id: candidate.id,
    resume_snapshot: candidate.resume,
    contact_email: candidate.email,
    contact_phone: candidate.phone_number,
    status: 'pending'
  })

  alert('Applied successfully!')
}

onMounted(() => {
  applyFilters({})
})
</script>