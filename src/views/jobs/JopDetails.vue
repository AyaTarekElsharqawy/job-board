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

      <button class="apply-btn">Apply Now</button>
    </div>
  </div>

  <div v-else class="loading">
    Loading job details...
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const job = ref(null)

const fetchJob = async () => {
  try {
    const res = await fetch(`http://localhost:3000/jobs/${route.params.id}`)
    if (!res.ok) throw new Error('Job not found')
    job.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchJob)
</script>
  
<style scoped>
.job-details-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
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
</style> 