<template>
  <div>
    <Transition name="fade-slide" appear>
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1><strong>Find Your Dream Job Today!</strong></h1>
            <p class="subtitle"><strong>Join thousands of companies hiring right now</strong></p>
            <div class="stats">{{ filteredJobs.length }}+ Jobs listed</div>
            <p class="description">
              <strong>We connect top talent with leading companies worldwide. 
              Start your career journey with us today!</strong>
            </p>
          </div>
          <div class="hero-image">
            <img src="@/assets/illustration.png" alt="People working">
          </div>
        </div>
      </div>
    </Transition>
 
    <Transition name="fade-up" appear>
      <div class="search-container">
        <JobFilters 
          :locations="locations"
          :categories="categories"
          :experienceLevels="experienceLevels"
          :salaryRanges="salaryRanges"
          :timeFilters="timeFilters"
          @filterChanged="applyFilter"
        />
      </div>
    </Transition>

    <div class="job-listings">
      <Transition name="fade" appear>
        <h2>Job Listing</h2>
      </Transition>
      
      <div v-if="isLoading" class="loading">Loading jobs...</div>
      
      <div v-if="error" class="error">{{ error }}</div>
     
      <div v-if="!isLoading && !error && filteredJobs.length === 0" class="empty">
        No jobs found matching your criteria
      </div>
      
      <TransitionGroup name="list" tag="div" class="job-list">
        <JobCard 
          v-for="job in paginatedJobs" 
          :key="job.id" 
          :job="job"
        />
      </TransitionGroup>
     
      <Transition name="fade" appear>
        <div v-if="filteredJobs.length > 0" class="pagination-controls">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            Previous
          </button>
          
          <span class="page-numbers">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="{ active: currentPage === page }"
              class="page-btn"
            >
              {{ page }}
            </button>
          </span>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import JobCard from '../../components/jobs/ JobCard.vue'
import JobFilters from '../../components/jobs/JobFilters.vue'
import dayjs from 'dayjs'

const jobs = ref([])
const locations = ref([]) 
const categories = ref([]) 
const experienceLevels = ref(['Entry', 'Mid', 'Senior'])
const filterCriteria = ref({})
const currentPage = ref(1)
const itemsPerPage = ref(6)
const isLoading = ref(false)
const error = ref(null)

const salaryRanges = ref([
  'Any',
  '< 5000',
  '5000 - 10000',
  '> 10000'
])

const timeFilters = ref([
  'Any',
  'Last 24 Hours',
  'Last 7 Days',
  'Last 30 Days'
])

const fetchInitialData = async () => {
  isLoading.value = true
  try {
    const [jobsRes, categoriesRes, locationsRes] = await Promise.all([
      axios.get('http://localhost:8000/api/jobs/published'),
      axios.get('http://localhost:8000/api/categories'),
      axios.get('http://localhost:8000/api/jobs/locations')
    ])
    
    jobs.value = jobsRes.data.data || []
    categories.value = categoriesRes.data.data || []
    locations.value = locationsRes.data.locations || []
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to load data. Please try again later.'
  } finally {
    isLoading.value = false
  }
}


const applyFilter = async (filters) => {
  isLoading.value = true
  error.value = null
  try {
    const postData = {}

    if (filters.keyword) postData.keyword = filters.keyword
    if (filters.location) postData.location = filters.location
    if (filters.experience) postData.experience = filters.experience  
    if (filters.category) postData.category_id = filters.category

    if (filters.salary) {
      if (filters.salary === '< 5000') {
        postData.salary_max = 5000
      } else if (filters.salary === '5000 - 10000') {
        postData.salary_min = 5000
        postData.salary_max = 10000
      } else if (filters.salary === '> 10000') {
        postData.salary_min = 10000
      }
    }

    if (filters.datePosted) {
      if (filters.datePosted === 'Last 24 Hours') postData.posted_within_days = 1
      else if (filters.datePosted === 'Last 7 Days') postData.posted_within_days = 7
      else if (filters.datePosted === 'Last 30 Days') postData.posted_within_days = 30
    }

    const response = await axios.post('http://localhost:8000/api/jobs/filter', postData)
    jobs.value = response.data.jobs || response.data || []
    filterCriteria.value = filters
    currentPage.value = 1
  } catch (err) {
    console.error('Error filtering jobs:', err)
    error.value = 'Failed to apply filters. Please try again.'
    jobs.value = []
  } finally {
    isLoading.value = false
  }
}

const filteredJobs = computed(() => {
 
  return jobs.value
})

const totalPages = computed(() => {
  return Math.ceil(filteredJobs.value.length / itemsPerPage.value)
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredJobs.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchInitialData()
})
</script>

<style scoped>
.hero-section {
  background: #047fec; 
  color: white; 
  text-align: center;
  padding: 5rem 1rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.stats {
  background: #00e56c;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  margin-bottom: 1rem;
}

.description {
  max-width: 600px;
  margin: 0 auto 2rem;
}

.upload-btn {
  background: #047fec;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
}

.search-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2%;
}

.job-listings {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.job-listings h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #047fec;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.browse-more {
  display: block;
  margin: 0 auto;
  background: #00e56c;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
}

.hero-section {
  background: #047fec;
  color: white;
  padding: 4rem 1rem;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-text {
  flex: 1;
  text-align: left;
  padding-right: 2rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.subtitle {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.stats {
  background: #00e56c;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  font-size: 1.1rem;
}

.description {
  max-width: 500px;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.upload-btn {
  background: white;
  color: #047fec;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
  }
  
  .hero-text {
    text-align: center;
    padding-right: 0;
    margin-bottom: 2rem;
  }
  
  .hero-image {
    justify-content: center;
  }
  
  .description {
    margin-left: auto;
    margin-right: auto;
  }
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #047fec;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background-color: #0366c4;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover {
  background-color: #ddd;
}

.page-btn.active {
  background-color: #047fec;
  color: white;
}

.pagination-info {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease 0.2s;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.5s ease;
}


.upload-btn {

  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}


.job-card {
  transition: all 0.3s ease;
}

.job-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.1);
}


.hero-image img {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
  
  