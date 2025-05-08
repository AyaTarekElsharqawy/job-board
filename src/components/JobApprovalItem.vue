<template>
  <div class="job-item">
    <h3>{{ job.title }}</h3>
    <p>Company: {{ job.company }}</p>
    <p>Location: {{ job.location }}</p>
    <div class="actions">
      <button @click="approveJob" class="approve">Approve</button>
      <button @click="rejectJob" class="reject">Reject</button>
      <button @click="showDetails = !showDetails">Details</button>
    </div>
    <div v-if="showDetails" class="job-details">
      <p>{{ job.description }}</p>
      <p>Required Skills: {{ job.required_skills }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDetails: false
    }
  },
  methods: {
    approveJob() {
      this.$emit('approve', this.job.id)
    },
    rejectJob() {
      this.$emit('reject', this.job.id)
    }
  }
}
</script>

<style scoped>
.job-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.actions {
  margin-top: 10px;
}
.approve {
  background-color: #4CAF50;
  color: white;
}
.reject {
  background-color: #f44336;
  color: white;
}
</style>