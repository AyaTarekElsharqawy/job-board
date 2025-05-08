<template>
  <div class="job-approval-list">
    <!-- Page title -->
    <h2>Pending Job Approvals</h2>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      Loading data...
    </div>
    
    <!-- Error state -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <!-- Job list -->
    <div v-if="!loading && !error">
      <!-- Message if no jobs -->
      <div v-if="jobs.length === 0" class="no-jobs">
        No pending jobs at the moment
      </div>
      
      <!-- Loop to display each job using JobApprovalItem -->
      <JobApprovalItem
        v-for="job in jobs"
        :key="job.id"
        :job="job"
        @approve="handleApprove"
        @reject="handleReject"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import JobApprovalItem from './JobApprovalItem.vue'

export default {
  components: { JobApprovalItem },
  setup() {
    const adminStore = useAdminStore()
    const loading = ref(false)
    const error = ref(null)

    // Fetch jobs on component mount
    onMounted(async () => {
      try {
        loading.value = true
        await adminStore.fetchPendingJobs()
      } catch (err) {
        error.value = 'Failed to load data: ' + err.message
      } finally {
        loading.value = false
      }
    })

    // Approve job function
    const handleApprove = async (jobId) => {
      try {
        await adminStore.approveJob(jobId)
      } catch (err) {
        error.value = 'Failed to approve job: ' + err.message
      }
    }

    // Reject job function
    const handleReject = async (jobId) => {
      try {
        await adminStore.rejectJob(jobId)
      } catch (err) {
        error.value = 'Failed to reject job: ' + err.message
      }
    }

    return {
      jobs: adminStore.pendingJobs,
      loading,
      error,
      handleApprove,
      handleReject
    }
  }
}
</script>

<style scoped>
.job-approval-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error, .no-jobs {
  padding: 20px;
  text-align: center;
  background: #f5f5f5;
  border-radius: 5px;
  margin: 20px 0;
}

.error {
  color: #f44336;
}
</style>
