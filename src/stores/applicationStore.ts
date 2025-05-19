import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useApplicationStore = defineStore('application', () => {
  const applications = ref([])
  const loading = ref(false)
  const error = ref(null)

const apiUrl = 'http://localhost:8000/api/applications'

  const fetchApplications = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(apiUrl,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
      })
      applications.value = res.data
      console.log(res.data)
    } catch (err) {
        error.value = 'Failed to load requests'
    } finally {
      loading.value = false
    }
  }

  const fetchByJob = async (jobId: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(`${apiUrl}?job_id=${jobId}`)
      applications.value = res.data
    } catch (err) {
        error.value = 'Failed to load job applications'
    } finally {
      loading.value = false
    }
  }

const fetchByCandidate = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('http://localhost:8000/api/applications/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    applications.value = res.data.data
    console.log(res.data.data)
  } catch (err) {
    error.value = 'Failed to load candidate applications'
    console.error(err)
  } finally {
    loading.value = false
  }
}

  

  const createApplication = async (applicationData: any) => {
    try {
      const res = await axios.post(apiUrl, applicationData)
      applications.value.push(res.data)
    } catch (err) {
        error.value = 'Failed to send request'
    }
  }

  const deleteApplication = async (id: number) => {
    try {
     await axios.delete(`http://localhost:8000/api/applications/${id}/cancel`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

      applications.value = applications.value.filter(app => app.id !== id)
    } catch (err) {
        error.value = 'Failed to delete request'
    }
  }

  return {
    applications,
    loading,
    error,
    fetchApplications,
    fetchByJob,
    fetchByCandidate,
    createApplication,
    deleteApplication
  }
})
