import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCandidateStore = defineStore('candidate', () => {
  const profile = ref({});
  const applications = ref([]);

  function setProfile(data) {
    profile.value = data;
  }

  function addApplication(job) {
    applications.value.push(job);
  }

  function removeApplication(jobId) {
    applications.value = applications.value.filter(job => job.id !== jobId);
  }

  return {
    profile,
    applications,
    setProfile,
    addApplication,
    removeApplication
  };
});
