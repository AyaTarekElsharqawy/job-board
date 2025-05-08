<template>
  <div class="job-card">
    <h3 class="job-title">{{ job.title }}</h3>
    <p class="job-detail"><strong>Location:</strong> {{ job.location }}</p>
    <p class="job-detail"><strong>Type:</strong> {{ job.type }}</p>
    <p class="job-detail"><strong>Deadline:</strong> {{ job.deadline }}</p>
    <p class="job-status" :class="{ 'pending': status === 'Pending', 'accepted': status === 'Accepted' }">
      <strong>Status:</strong> {{ status }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  job: Object,
  status: String,
  fromApplicationsPage: Boolean
})
</script>

<style scoped>
.job-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.job-card:hover {
  transform: translateY(-2px);
}

.job-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.job-detail {
  font-size: 1rem;
  color: #666;
  margin: 0.5rem 0;
}

.job-status {
  font-size: 1rem;
  margin: 0.5rem 0;
  font-weight: bold;
}

.job-status.pending {
  color: #f1c40f; 
}

.job-status.accepted {
  color: #27ae60; 
}
</style>