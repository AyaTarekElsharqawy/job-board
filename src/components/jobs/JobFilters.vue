<template>
  <div class="filters">
    <div class="filter-group">
      <input type="text" v-model="filters.keyword" placeholder="Search keyword" @input="emitFilters" />
    </div>

    <div class="filter-group">
      <select v-model="filters.location" @change="emitFilters">
        <option value="">All Locations</option>
        <option v-for="loc in props.locations" :key="loc" :value="loc">{{ loc }}</option>
      </select>
    </div>

    <div class="filter-group">
      <select v-model="filters.category" @change="emitFilters">
        <option value="">All Categories</option>
        <option v-for="cat in props.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>

    <div class="filter-group">
      <select v-model="filters.experience" @change="emitFilters">
        <option value="">All Experience Levels</option>
        <option v-for="level in props.experienceLevels" :key="level" :value="level">{{ level }}</option>
      </select>
    </div>

    <div class="filter-group">
      <select v-model="filters.salary" @change="emitFilters">
        <option value="">All Salaries</option>
        <option v-for="range in props.salaryRanges" :key="range" :value="range">{{ range }}</option>
      </select>
    </div>

    <div class="filter-group">
      <select v-model="filters.datePosted" @change="emitFilters">
        <option value="">Any time</option>
        <option v-for="option in props.timeFilters" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>

    <button class="find-job-btn" @click="emitFilters">Find Job</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  locations: Array,
  categories: Array,
  experienceLevels: Array,
  salaryRanges: Array,
  timeFilters: Array
})

const emit = defineEmits(['filterChanged'])

const filters = ref({
  keyword: '',
  location: '',
  category: '',
  experience: '',
  salary: '',
  datePosted: ''
})

const emitFilters = () => {
 
  const convertedFilters = {
    ...filters.value,
    datePosted: convertTimeFilter(filters.value.datePosted),
    salary: convertSalaryFilter(filters.value.salary)
  }
  emit('filterChanged', convertedFilters)
}

const convertTimeFilter = (timeFilter) => {
  const map = {
    'Last 24 Hours': 1,
    'Last 7 Days': 7,
    'Last 30 Days': 30,
    'Any': null
  }
  return map[timeFilter] || null
}

const convertSalaryFilter = (salaryFilter) => {
  if (!salaryFilter || salaryFilter === 'Any') return null
  return salaryFilter.replace(/[^\d\-]/g, '') 
}
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-group {
  flex: 1 1 200px;
}

.filter-group input,
.filter-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  outline: none;
}

.find-job-btn {
  background: #00e56c;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.3s;
}

.find-job-btn:hover {
  background: #047fec;
}
</style>
