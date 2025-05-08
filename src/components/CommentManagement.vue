<template>
  <div class="comment-management">
    <h2>Comment Management</h2>
    
    <!-- Filter Controls -->
    <div class="filter-controls">
      <select v-model="filterStatus" @change="fetchComments">
        <option value="all">All Comments</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      
      <select v-model="filterType" @change="fetchComments">
        <option value="all">All Types</option>
        <option value="job">Job Comments</option>
        <option value="profile">Profile Comments</option>
      </select>
    </div>
    
    <!-- Comment List -->
    <div class="comment-list">
      <div v-if="loading" class="loading">Loading comments...</div>
      
      <div v-if="error" class="error">{{ error }}</div>
      
      <div v-if="!loading && comments.length === 0" class="no-comments">
        No comments to display
      </div>
      
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <img :src="comment.user.avatar" :alt="comment.user.name" class="user-avatar">
          <div class="user-info">
            <h4>{{ comment.user.name }}</h4>
            <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
          </div>
          <span class="comment-type" :class="comment.type">
            {{ comment.type === 'job' ? 'Job' : 'Profile' }}
          </span>
        </div>
        
        <div class="comment-content">
          <p>{{ comment.content }}</p>
          
          <div v-if="comment.job" class="related-job">
            <span>On job:</span>
            <router-link :to="`/jobs/${comment.job.id}`">{{ comment.job.title }}</router-link>
          </div>
        </div>
        
        <div class="comment-actions">
          <span class="comment-status" :class="comment.status">
            {{ getStatusText(comment.status) }}
          </span>
          
          <button 
            v-if="comment.status !== 'approved'"
            @click="approveComment(comment.id)"
            class="approve-btn"
          >
            Approve
          </button>
          
          <button 
            v-if="comment.status !== 'rejected'"
            @click="rejectComment(comment.id)"
            class="reject-btn"
          >
            Reject
          </button>
          
          <button 
            @click="deleteComment(comment.id)"
            class="delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
      
      <!-- Pagination -->
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="changePage"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import Pagination from '../components/Pagination.vue'

export default {
  components: { Pagination },
  setup() {
    const adminStore = useAdminStore()
    const comments = ref([])
    const loading = ref(false)
    const error = ref('')
    const filterStatus = ref('pending')
    const filterType = ref('all')
    const currentPage = ref(1)
    const totalPages = ref(1)

    const fetchComments = async () => {
      try {
        loading.value = true
        error.value = ''
        
        const params = {
          status: filterStatus.value,
          type: filterType.value,
          page: currentPage.value
        }
        
        const response = await adminStore.fetchComments(params)
        comments.value = response.data
        totalPages.value = response.meta.last_page
      } catch (err) {
        error.value = 'Failed to load comments: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const approveComment = async (commentId) => {
      try {
        await adminStore.approveComment(commentId)
        fetchComments()
      } catch (err) {
        error.value = 'Failed to approve comment: ' + err.message
      }
    }

    const rejectComment = async (commentId) => {
      try {
        await adminStore.rejectComment(commentId)
        fetchComments()
      } catch (err) {
        error.value = 'Failed to reject comment: ' + err.message
      }
    }

    const deleteComment = async (commentId) => {
      try {
        await adminStore.deleteComment(commentId)
        fetchComments()
      } catch (err) {
        error.value = 'Failed to delete comment: ' + err.message
      }
    }

    const changePage = (page) => {
      currentPage.value = page
      fetchComments()
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusText = (status) => {
      const statusMap = {
        pending: 'Pending Review',
        approved: 'Approved',
        rejected: 'Rejected'
      }
      return statusMap[status] || status
    }

    onMounted(fetchComments)

    return {
      comments,
      loading,
      error,
      filterStatus,
      filterType,
      currentPage,
      totalPages,
      fetchComments,
      approveComment,
      rejectComment,
      deleteComment,
      changePage,
      formatDate,
      getStatusText
    }
  }
}
</script>
