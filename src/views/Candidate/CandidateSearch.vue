<template>
  <div class="bg-gray-100 font-sans min-h-screen">
    <!-- Header -->
    <header class="bg-blue-900 text-white py-4">
      <div class="container mx-auto flex justify-between items-center px-4">
        <div class="flex items-center">
          <div class="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center mr-2">
            <span class="text-white text-xl font-bold">Q</span>
          </div>
          <h1 class="text-xl font-bold">Job Board</h1>
          <p class="ml-2 text-sm">Find your dream job</p>
        </div>
        <nav class="flex items-center space-x-6">
          <router-link to="/" class="hover:text-green-400">Home</router-link>
          <router-link to="/browse-jobs" class="hover:text-green-400">Browse Job</router-link>
          <div class="relative group">
            <a href="#" class="hover:text-green-400 flex items-center">Pages <span class="ml-1">▼</span></a>
          </div>
          <div class="relative group">
            <a href="#" class="hover:text-green-400 flex items-center">Blog <span class="ml-1">▼</span></a>
          </div>
          <router-link to="/contact" class="hover:text-green-400">Contact</router-link>
          <router-link to="/login" class="hover:text-green-400">Log in</router-link>
          <router-link to="/post-job" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Post A Job</router-link>
        </nav>
      </div>
    </header>

    <!-- Main Search Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Search Form -->
      <div class="bg-white p-6 rounded shadow mb-8">
        <form @submit.prevent="searchJobs" class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="keywords" class="block text-sm font-medium text-gray-700">Search keyword</label>
            <input v-model="searchData.keywords" id="keywords" type="text" class="mt-1 p-2 w-full border rounded" placeholder="e.g., Developer">
          </div>
          <div class="flex-1">
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <select v-model="searchData.location" id="location" class="mt-1 p-2 w-full border rounded">
              <option value="">Select location</option>
              <option value="newyork">NewYork</option>
              <option value="remote">Remote</option>
              <option value="london">London</option>
            </select>
          </div>
          <div class="flex-1">
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select v-model="searchData.category" id="category" class="mt-1 p-2 w-full border rounded">
              <option value="">Select a category</option>
              <option value="design">Design & Creative</option>
              <option value="marketing">Marketing</option>
              <option value="administration">Administration</option>
              <option value="teaching">Teaching & Education</option>
              <option value="engineering">Engineering</option>
              <option value="software">Software & Web</option>
              <option value="telemarketing">Telemarketing</option>
              <option value="garments">Garments / Textile</option>
            </select>
          </div>
          <div class="flex-1">
            <label for="experience" class="block text-sm font-medium text-gray-700">Experience Level</label>
            <select v-model="searchData.experience" id="experience" class="mt-1 p-2 w-full border rounded">
              <option value="">Any</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
          <div class="flex-1">
            <label for="salary" class="block text-sm font-medium text-gray-700">Salary Range</label>
            <select v-model="searchData.salary" id="salary" class="mt-1 p-2 w-full border rounded">
              <option value="">Any</option>
              <option value="0-2000">0 - 2000</option>
              <option value="2000-4000">2000 - 4000</option>
              <option value="4000+">4000+</option>
            </select>
          </div>
          <div class="flex-1">
            <label for="datePosted" class="block text-sm font-medium text-gray-700">Date Posted</label>
            <select v-model="searchData.datePosted" id="datePosted" class="mt-1 p-2 w-full border rounded">
              <option value="">Any</option>
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          <div class="flex items-end">
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Find Job</button>
          </div>
        </form>
      </div>

      <!-- Popular Search -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Popular Search:</h3>
        <div class="flex flex-wrap gap-2">
          <button @click="setPopularSearch('Design & Creative')" class="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">Design & Creative</button>
          <button @click="setPopularSearch('Marketing')" class="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">Marketing</button>
          <button @click="setPopularSearch('Administration')" class="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">Administration</button>
          <button @click="setPopularSearch('Teaching & Education')" class="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">Teaching & Education</button>
          <button @click="setPopularSearch('Engineering')" class="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">Engineering</button>
          <button @click="setPopularSearch('Software & Web')" class="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">Software & Web</button>
          <button @click="setPopularSearch('Telemarketing')" class="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">Telemarketing</button>
        </div>
      </div>

      <!-- Popular Categories -->
      <div>
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Popular Categories</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-md font-medium">Design & Creative</h4>
            <p class="text-gray-500">50 Available position</p>
          </div>
          <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-md font-medium">Marketing</h4>
            <p class="text-gray-500">50 Available position</p>
          </div>
          <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-md font-medium">Telemarketing</h4>
            <p class="text-gray-500">50 Available position</p>
          </div>
          <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-md font-medium">Software & Web</h4>
            <p class="text-gray-500">50 Available position</p>
          </div>
          <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-md font-medium">Administration</h4>
            <p class="text-gray-500">50 Available position</p>
          </div>
          <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-md font-medium">Teaching & Education</h4>
            <p class="text-gray-500">50 Available position</p>
          </div>
          <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-md font-medium">Engineering</h4>
            <p class="text-gray-500">50 Available position</p>
          </div>
          <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-md font-medium">Garments / Textile</h4>
            <p class="text-gray-500">50 Available position</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useJobStore } from '@/stores/job';

export default {
  name: 'CandidateSearch',
  data() {
    return {
      searchData: {
        keywords: '',
        location: '',
        category: '',
        experience: '',
        salary: '',
        datePosted: ''
      }
    };
  },
  methods: {
    searchJobs() {
      const jobStore = useJobStore();
      jobStore.setSearchFilters({ ...this.searchData });
      console.log('Searching with:', this.searchData);
      this.searchData = {
        keywords: '',
        location: '',
        category: '',
        experience: '',
        salary: '',
        datePosted: ''
      };
    },
    setPopularSearch(category) {
      this.searchData.category = category.toLowerCase().replace(/ & /g, '-');
      this.searchJobs();
    }
  }
};
</script>

<style scoped>
header {
  background-color: #1e3a8a;
  color: white;
}
header a {
  color: white;
  text-decoration: none;
}
header a:hover {
  color: #10b981;
}
.bg-green-500 {
  background-color: #10b981;
}
.bg-green-500:hover {
  background-color: #059669;
}
.bg-blue-100 {
  background-color: #dbeafe;
}
.bg-blue-100:hover {
  background-color: #bfdbfe;
}
.text-blue-800 {
  color: #1e40af;
}
.shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}
</style>