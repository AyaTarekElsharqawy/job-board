<template>
  <div>
    <!-- Compact Hero Section -->
    <Transition name="fade-slide" appear>
      <div class="compact-hero">
        <div class="hero-content">
          <div class="hero-text">
            <h1>Browse Available Jobs</h1>
            <p class="subtitle">Find your next career opportunity</p>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Search Filters -->
    <Transition name="fade-up" appear>
      <div class="search-container">
        <JobFilters @filterChanged="applyFilter" />
      </div>
    </Transition>

    <!-- Job Listings -->
    <div class="job-listings">
      <Transition name="fade" appear>
        <div class="listings-header">
          <h2>Available Positions</h2>
          <div class="results-count" v-if="filteredJobs.length > 0">
            Showing {{ startItem }}-{{ endItem }} of {{ filteredJobs.length }} jobs
          </div>
        </div>
      </Transition>
      
      <TransitionGroup name="list" tag="div" class="job-list">
        <JobCard 
          v-for="job in paginatedJobs" 
          :key="job.id" 
          :job="job"
        />
      </TransitionGroup>
      
      <div v-if="filteredJobs.length === 0" class="no-results">
        <p>No jobs match your current filters.</p>
        <button @click="resetFilters" class="reset-btn">Reset Filters</button>
      </div>
     
      <Transition name="fade" appear>
        <div class="pagination-controls" v-if="totalPages > 1">
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
import JobCard from '@/components/jobs/ JobCard.vue'
import JobFilters from '@/components/jobs/JobFilters.vue'
import dayjs from 'dayjs'

const jobs = ref([])       
const filterCriteria = ref({})
const currentPage = ref(1)
const itemsPerPage = ref(6) 

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/jobs') 
    const data = await res.json()
    jobs.value = data
  } catch (err) {
    console.error('Error fetching jobs:', err)
  }
})

const applyFilter = (filters) => {
  filterCriteria.value = filters
  currentPage.value = 1 
}

const resetFilters = () => {
  filterCriteria.value = {}
}

const filteredJobs = computed(() => {
  return jobs.value.filter(job => {
    const f = filterCriteria.value

    const matchKeyword = !f.keyword || job.title.toLowerCase().includes(f.keyword.toLowerCase()) || job.description.toLowerCase().includes(f.keyword.toLowerCase())
    const matchLocation = !f.location || job.location === f.location
    const matchCategory = !f.category || job.category === f.category
    const matchExperience = !f.experience || job.experience_level === f.experience
    const matchSalary = !f.salary || (() => {
      const [min, max] = f.salary.split('-').map(Number)
      const [jobMin, jobMax] = job.salary_range.split('-').map(Number)
      return jobMin >= min && jobMax <= max
    })()
    const matchDate = !f.datePosted || (() => {
      const days = Number(f.datePosted)
      const postedDate = dayjs(job.created_at)
      return postedDate.isAfter(dayjs().subtract(days, 'day'))
    })()

    return matchKeyword && matchLocation && matchCategory && matchExperience && matchSalary && matchDate
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredJobs.value.length / itemsPerPage.value)
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredJobs.value.slice(start, end)
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredJobs.value.length ? filteredJobs.value.length : end
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
</script>

<style scoped>
/* Compact Hero Section */
.compact-hero {
  background: #047fec;
  color: white;
  padding: 2.5rem 1rem;
  margin-bottom: 1.5rem;
}

.compact-hero h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.compact-hero .subtitle {
  font-size: 1.1rem;
  text-align: center;
  opacity: 0.9;
}

/* Search Container */
.search-container {
  max-width: 1000px;
  margin: 0 auto 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Job Listings */
.job-listings {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.listings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.listings-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.results-count {
  color: #666;
  font-size: 0.9rem;
}

/* Job List */
.job-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 3rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.no-results p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.reset-btn {
  background: #047fec;
  color: white;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.reset-btn:hover {
  background: #0366c4;
}

/* Pagination */
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

/* Animations */
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

@media (max-width: 768px) {
  .compact-hero {
    padding: 2rem 1rem;
  }
  
  .compact-hero h1 {
    font-size: 1.7rem;
  }
  
  .listings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .job-list {
    grid-template-columns: 1fr;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
  }
}
</style>