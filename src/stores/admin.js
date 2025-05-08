import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const pendingJobs = ref([])
  const allUsers = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchPendingJobs() {
    try {
      loading.value = true
      const response = await axios.get('/api/jobs/pending')
      pendingJobs.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function approveJob(jobId) {
    try {
      await axios.put(`/api/jobs/${jobId}/approve`)
      pendingJobs.value = pendingJobs.value.filter(job => job.id !== jobId)
    } catch (err) {
      error.value = err.message
    }
  }

  async function rejectJob(jobId) {
    try {
      await axios.put(`/api/jobs/${jobId}/reject`)
      pendingJobs.value = pendingJobs.value.filter(job => job.id !== jobId)
    } catch (err) {
      error.value = err.message
    }
  }

  async function fetchAllUsers() {
    try {
      loading.value = true
      const response = await axios.get('/api/users')
      allUsers.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function banUser(userId) {
    try {
      await axios.put(`/api/users/${userId}/ban`)
      const user = allUsers.value.find(u => u.id === userId)
      if (user) user.status = 'banned'
    } catch (err) {
      error.value = err.message
    }
  }

  async function unbanUser(userId) {
    try {
      await axios.put(`/api/users/${userId}/unban`)
      const user = allUsers.value.find(u => u.id === userId)
      if (user) user.status = 'active'
    } catch (err) {
      error.value = err.message
    }
  }

  async function fetchComments(params) {
    try {
      loading.value = true
      const response = await axios.get('/api/comments', { params })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveComment(commentId) {
    try {
      await axios.put(`/api/comments/${commentId}/approve`)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function rejectComment(commentId) {
    try {
      await axios.put(`/api/comments/${commentId}/reject`)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteComment(commentId) {
    try {
      await axios.delete(`/api/comments/${commentId}`)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function fetchAnalytics(params) {
    try {
      loading.value = true
      const response = await axios.get('/api/analytics', { params })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    pendingJobs,
    allUsers,
    loading,
    error,
    fetchPendingJobs,
    approveJob,
    rejectJob,
    fetchAllUsers,
    banUser,
    unbanUser,
    fetchComments,
    approveComment,
    rejectComment,
    deleteComment,
    fetchAnalytics
  }
})