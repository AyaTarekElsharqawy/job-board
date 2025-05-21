<template>
  <div class="container py-5">
    <div v-if="loading" class="text-center text-muted fs-5 mb-4">Loading applications...</div>
    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <div v-else-if="applications.length === 0" class="text-center text-muted py-5 fs-5">
      No applications found.
    </div>

    <div v-else class="table-responsive">
      <h2 class="text-center mb-4">My Applications</h2>
      <table class="table table-hover align-middle table-bordered table-striped shadow-sm">   
        <thead class="table-dark">
          <tr>
            <th scope="col">Cover Letter</th>
            <th scope="col">Work Type</th>
            <th scope="col">Status</th>
            <th scope="col">Location</th>
            <th scope="col">Deadline</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in applications" :key="application.id">
            <td>{{ application.cover_letter }}</td>
            <td>{{ application.job.work_type }}</td>
            <td><span :class="statusClass(application.status)">{{ application.status }}</span></td>
            <td>{{ application.job.location }}</td>
            <td>{{ new Date(application.job.deadline).toLocaleDateString() }}</td>
            <td class="text-center">
              <div class="d-flex justify-content-center gap-2">
                <button @click="viewJobDetails(application.job.id)" class="btn btn-sm btn-outline-primary">
                  View
                </button>
                <button
                  v-if="application.status.toLowerCase() === 'pending'"
                  @click="cancelApplication(application.id)"
                  class="btn btn-sm btn-outline-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#cancelModal"
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div class="modal fade" id="cancelModal" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true" ref="cancelModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cancelModalLabel">Cancel Application</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to cancel this application?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger" @click="confirmCancel">Yes, Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicationStore } from '@/stores/applicationStore'

let bootstrapModal = null

const router = useRouter()
const applicationStore = useApplicationStore()

const applications = ref([])
const loading = ref(false)
const error = ref(null)
const selectedAppId = ref(null)
const cancelModal = ref(null)

const currentUserId = 'c7a6' // Ideally, fetch this from auth store

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

const cancelApplication = (applicationId) => {
  selectedAppId.value = applicationId
  bootstrapModal = new bootstrap.Modal(cancelModal.value)
  bootstrapModal.show()
}

const confirmCancel = async () => {
  try {
    await applicationStore.deleteApplication(selectedAppId.value)
    applications.value = applications.value.filter(app => app.id !== selectedAppId.value)
    bootstrapModal.hide()
  } catch (err) {
    error.value = 'Failed to cancel application'
    console.error(err)
  }
}

const statusClass = (status) => {
  const s = status.toLowerCase()
  if (s === 'accepted') return 'badge bg-success'
  if (s === 'pending') return 'badge bg-warning text-dark'
  if (s === 'rejected') return 'badge bg-danger'
  return 'badge bg-secondary'
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
