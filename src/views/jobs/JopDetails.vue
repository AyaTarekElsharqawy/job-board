<template>
  <div class="job-details-container" v-if="job">
    <h1>Job Details Page</h1>
    <div class="job-content">
      <div class="job-info">
        <h2>{{ job.title }}</h2>
        <div class="meta-info">
          <span class="company">Employer #{{ job.employer_id }}</span>
          <span class="location">{{ job.location }}</span>
          <span class="salary">{{ job.salary_range }}</span>
          <span class="job-type">{{ job.work_type }}</span>
        </div>

        <div class="description">
          <h3>Job Description:</h3>
          <p>{{ job.description }}</p>
        </div>

        <div class="requirements">
          <h3>Responsibilities:</h3>
          <p>{{ job.responsibilities }}</p>
          <h3>Skills:</h3>
          <ul>
            <li v-for="skill in job.skills.split(',')" :key="skill">{{ skill.trim() }}</li>
          </ul>
        </div>
      </div>
<JobComments />
      <button class="apply-btn" @click="showForm = true">Apply Now</button>
      
      <!-- Application Form Modal -->
      <div v-if="showForm" class="modal-overlay">
        <div class="apply-form">
          <h2 class="apply-form__title">Apply for {{ job.title }}</h2>
          <button class="close-btn" @click="showForm = false">&times;</button>
          <form @submit.prevent="submitApplication" class="apply-form__form">
        
            <div class="form-group">
              <label for="resume">Resume:</label>
              <input type="file" id="resume" @change="handleFileUpload" accept=".pdf,.doc,.docx" required />
            </div>
            <div class="form-group">
              <label for="coverLetter">Cover Letter:</label>
              <textarea id="coverLetter" v-model="application.coverLetter" 
                placeholder="Write your cover letter here..." required></textarea>
            </div>
            <button type="submit" class="submit-btn">Submit Application</button>
          </form>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading">
    Loading job details...
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import JobComments from '@/views/jobs/JobComments.vue'

const route = useRoute()
const job = ref(null)
const showForm = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const application = ref({
  name: '',
  email: '',
  phone: '',
  resume: null,
  coverLetter: ''
})

const fetchJob = async () => {
  try {
    const res = await fetch(`http://localhost:3000/jobs/${route.params.id}`)
    if (!res.ok) throw new Error('Job not found')
    job.value = await res.json()
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to load job details'
  }
}

const handleFileUpload = (event) => {
  application.value.resume = event.target.files[0]
}

const submitApplication = async () => {
  try {
    // Create FormData to handle file upload
    const formData = new FormData()
    formData.append('job_id', job.value.id)
    formData.append('name', application.value.name)
    formData.append('email', application.value.email)
    formData.append('phone', application.value.phone)
    formData.append('resume', application.value.resume)
    formData.append('coverLetter', application.value.coverLetter)
    
    const response = await fetch('http://localhost:3000/applications', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Application failed')
    
    successMessage.value = 'Application submitted successfully!'
    errorMessage.value = ''
    
    // Reset form and hide after 2 seconds
    setTimeout(() => {
      showForm.value = false
      successMessage.value = ''
      application.value = {
        name: '',
        email: '',
        phone: '',
        resume: null,
        coverLetter: ''
      }
    }, 2000)
    
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to submit application'
    successMessage.value = ''
  }
}

onMounted(fetchJob)
</script>
  
<style scoped>
.job-details-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  position: relative;
}

h1 {
  color: #047fec;
  text-align: center;
  margin-bottom: 2rem;
}

.job-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.job-info h2 {
  color: #047fec;
  margin-bottom: 1rem;
}

.meta-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  color: #666;
}

.meta-info span {
  padding-right: 1rem;
  border-right: 1px solid #ddd;
}

.meta-info span:last-child {
  border-right: none;
}

.description, .requirements {
  margin-bottom: 2rem;
}

h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.apply-btn {
  background: #00e56c;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  display: block;
  margin: 0 auto;
}

.apply-btn:hover {
  background: #00c45a;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.apply-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.apply-form__title {
  color: #047fec;
  margin-bottom: 1.5rem;
  text-align: center;
}

.apply-form__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.submit-btn {
  background: #047fec;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

.submit-btn:hover {
  background: #0366c4;
}

.success-message {
  color: #00a854;
  margin-top: 1rem;
  text-align: center;
}

.error-message {
  color: #f5222d;
  margin-top: 1rem;
  text-align: center;
}
</style>