import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useJobStore = defineStore('job', () => {
  const searchFilters = ref({
    keywords: '',
    location: '',
    category: '',
    experience: '',
    salary: '',
    datePosted: ''
  });

  function setSearchFilters(filters) {
    searchFilters.value = { ...filters };
  }

  return { searchFilters, setSearchFilters };
});