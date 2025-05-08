<template>
  <div class="apply-form">
    <h2 class="apply-form__title">Apply for Job</h2>
    <form @submit.prevent="submitApplication" class="apply-form__form">
      <div class="form-group">
        <label for="resume">Resume:</label>
        <input type="file" id="resume" @change="handleFileUpload" accept=".pdf,.doc,.docx" required />
      </div>
      <div class="form-group">
        <label for="coverLetter">Cover Letter:</label>
        <textarea id="coverLetter" v-model="coverLetter" placeholder="Write your cover letter here..." required></textarea>
      </div>
      <button type="submit" class="submit-btn">Submit Application</button>
    </form>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApplicationStore } from '@/stores/applicationStore'
import { useCandidateStore } from '@/stores/candidateStore' // تعديل المسار هنا
import { useJobStore } from '@/stores/job'

const applicationStore = useApplicationStore()
const candidateStore = useCandidateStore()
const jobStore = useJobStore()

const route = useRoute()
const jobId = route.params.id
const resume = ref(null)
const coverLetter = ref('')
const successMessage = ref('')
const errorMessage = ref('')

onMounted(() => {
  if (!jobStore.jobs.length) {
    jobStore.fetchJobs()
  }
})

const handleFileUpload = (event) => {
  resume.value = event.target.files[0]
}

const submitApplication = async () => {
  const formData = new FormData()
  formData.append('resume', resume.value)
  formData.append('coverLetter', coverLetter.value)
  formData.append('jobId', jobId)

  try {
    await applicationStore.createApplication(formData)
    successMessage.value = 'Application submitted successfully!'
    errorMessage.value = ''
    resume.value = null
    coverLetter.value = ''
  } catch (error) {
    errorMessage.value = 'Failed to submit application. Please try again.'
    successMessage.value = ''
  }
}
</script>

<style scoped>
.apply-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.apply-form__title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="file"],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 150px;
  resize: vertical;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.submit-btn:hover {
  background-color: #45a049;
}

.success-message {
  color: #4CAF50;
  text-align: center;
  margin-top: 1rem;
}

.error-message {
  color: #f44336;
  text-align: center;
  margin-top: 1rem;
}
</style>