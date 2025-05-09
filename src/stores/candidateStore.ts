// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import axios from 'axios'

// export const useCandidateStore = defineStore('candidate', () => {
//   const candidates = ref([])
//   const loading = ref(false)
//   const error = ref(null)

//   const apiUrl = 'http://localhost:3000/candidates'

//   const fetchCandidates = async () => {
//     loading.value = true
//     error.value = null
//     try {
//       const res = await axios.get(apiUrl)
//       candidates.value = res.data
//     } catch (err) {
//         error.value = 'Failed to load candidate data'
//     } finally {
//       loading.value = false
//     }
//   }

//   const createCandidate = async (candidateData: any) => {
//     try {
//       const res = await axios.post(apiUrl, candidateData)
//       candidates.value.push(res.data)
//     } catch (err) {
//         error.value = 'Failed to create candidate account'
//     }
//   }

//   return {
//     candidates,
//     loading,
//     error,
//     fetchCandidates,
//     createCandidate
//   }
// })

// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import axios from 'axios'

// export const useCandidateStore = defineStore('candidate', () => {
//   const candidates = ref([])
//   const loading = ref(false)
//   const error = ref(null)

//   const apiUrl = 'http://localhost:3000/candidates'

//   const fetchCandidates = async () => {
//     loading.value = true
//     error.value = null
//     try {
//       const res = await axios.get(apiUrl)
//       candidates.value = res.data
//     } catch (err) {
//       error.value = 'Failed to load candidate data'
//     } finally {
//       loading.value = false
//     }
//   }

//   const fetchCandidateById = async (userId) => {
//     loading.value = true
//     error.value = null
//     try {
//       const res = await axios.get(`${apiUrl}?user_id=${userId}`)
//       const candidate = res.data[0]
//       if (candidate) {
//         const candidateIndex = candidates.value.findIndex(c => c.user_id === userId)
//         if (candidateIndex !== -1) {
//           candidates.value[candidateIndex] = candidate
//         } else {
//           candidates.value.push(candidate)
//         }
//       }
//     } catch (err) {
//       error.value = 'Failed to load candidate data'
//     } finally {
//       loading.value = false
//     }
//   }

//   const createCandidate = async (candidateData) => {
//     try {
//       const res = await axios.post(apiUrl, candidateData)
//       candidates.value.push(res.data)
//     } catch (err) {
//       error.value = 'Failed to create candidate account'
//     }
//   }

//   const updateCandidate = async (userId, updatedData) => {
//     try {
//       const res = await axios.put(`${apiUrl}/${userId}`, updatedData)
//       const candidateIndex = candidates.value.findIndex(c => c.user_id === userId)
//       if (candidateIndex !== -1) {
//         candidates.value[candidateIndex] = res.data
//       }
//     } catch (err) {
//       error.value = 'Failed to update candidate data'
//     }
//   }

//   return {
//     candidates,
//     loading,
//     error,
//     fetchCandidates,
//     fetchCandidateById,
//     createCandidate,
//     updateCandidate
//   }
// })
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCandidateStore = defineStore('candidate', () => {
  const candidates = ref(JSON.parse(localStorage.getItem('candidates')) || [
    { 
      user_id: 3, 
      resume: null,
      linkedin_profile: null,
      phone_number: "",
      experience_level: "",
      location: ""
    }
  ]);

  const saveToLocalStorage = () => {
    localStorage.setItem('candidates', JSON.stringify(candidates.value));
  }

  const fetchCandidateById = (userId) => {
    const candidate = candidates.value.find(c => c.user_id === userId);
    if (!candidate) {
      candidates.value.push({ 
        user_id: userId, 
        resume: null,
        linkedin_profile: null,
        phone_number: "",
        experience_level: "",
        location: ""
      });
      saveToLocalStorage();
    }
  };

  const updateCandidate = (userId, updatedData) => {
    const candidateIndex = candidates.value.findIndex(c => c.user_id === userId);
    if (candidateIndex !== -1) {
      candidates.value[candidateIndex] = { 
        ...candidates.value[candidateIndex], 
        ...updatedData 
      };
    } else {
      candidates.value.push({ 
        user_id: userId, 
        ...updatedData 
      });
    }
    saveToLocalStorage();
  };

  return {
    candidates,
    fetchCandidateById,
    updateCandidate
  }
});