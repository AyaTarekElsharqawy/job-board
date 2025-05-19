<!-- src/views/Admin/AdminComments.vue -->
<template>
  <div class="admin-dashboard">
    <font-awesome-icon :icon="['fas', 'tachometer-alt']" />
    <font-awesome-icon :icon="['fas', 'credit-card']" />

    <!-- Navbar -->
    <nav class="main-navbar">
      <!-- … (كما في القالب الأصلي) … -->
    </nav>

    <!-- Main Content -->
    <div class="comments-container">
      <div class="header-section">
        <h2 class="page-title">
          <span class="icon">📝</span>
          Manage Comments
        </h2>
      </div>

      <div class="table-wrapper">
        <table class="comments-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Job</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in comments" :key="comment.id">
              <td>{{ comment.user?.name || '—' }}</td>
              <td>{{ comment.job?.title || '—' }}</td>
              <td class="comment-text">{{ comment.comment_text || '—' }}</td>
              <td>
                {{ comment.created_at 
                    ? new Date(comment.created_at).toLocaleString() 
                    : '—' 
                }}
              </td>
              <td>
                <button @click="deleteComment(comment.id)" class="delete-btn">
                  <FontAwesomeIcon :icon="['fas', 'trash-alt']" />
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="comments.length === 0">
              <td colspan="5" style="text-align: center;">No comments found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../../../axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const comments = ref([])
const message = ref('')

const fetchComments = async () => {
  try {
    const token = localStorage.getItem('token')
    // استدعاء المسار الجديد: /api/admin/comments
    const res = await axios.get('/api/admin/comments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    comments.value = res.data.data || []
  } catch (e) {
    console.error('Fetch failed', e)
    comments.value = []
  }
}

const deleteComment = async (id) => {
  try {
    const token = localStorage.getItem('token')
    // المسار الأصلي في الـ backend: /api/admin/comments/{id}
    await axios.delete(`/api/admin/comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    message.value = 'Comment deleted successfully'
    await fetchComments()
  } catch (e) {
    console.error('Delete failed', e)
    message.value = 'Error deleting comment'
  }
}

const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

onMounted(() => {
  fetchComments()
})
</script>


<style scoped>
/* Navbar Styles - Same as previous */
.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #2a3f54;
  color: white;
  height: 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
  border-radius: 4px;
}

.app-name {
  font-weight: bold;
  font-size: 1.2rem;
}

.navbar-menu {
  display: flex;
  flex-grow: 1;
  justify-content: center;
}

.nav-link {
  padding: 0 15px;
  height: 60px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.nav-link:hover, .nav-link.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  border-bottom: 3px solid #00bcd4;
}

.nav-icon {
  margin-right: 8px;
  font-size: 0.9rem;
}

.nav-text {
  font-size: 0.9rem;
}

.navbar-user {
  display: flex;
  align-items: center;
}

.welcome-msg {
  margin-right: 15px;
  font-size: 0.9rem;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Main Content Styles */
.comments-container {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.header-section {
  margin-bottom: 20px;
}

.page-title {
  color: #2a3f54;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 1.8rem;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.comments-table {
  width: 100%;
  border-collapse: collapse;
}

.comments-table th {
  background-color: #2f93f7;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
}

.comments-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e6f1;
  color: #2a3f54;
  vertical-align: top;
}

.comments-table tr:last-child td {
  border-bottom: none;
}

.comments-table tr:hover {
  background-color: rgba(0, 188, 212, 0.05);
}

.comment-text {
  max-width: 300px;
  word-wrap: break-word;
}

.delete-btn {
  padding: 6px 12px;
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.delete-btn:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.message {
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 4px;
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

@media (max-width: 768px) {
  .main-navbar {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  
  .navbar-menu {
    flex-direction: column;
    width: 100%;
    margin: 10px 0;
  }
  
  .nav-link {
    width: 100%;
    justify-content: center;
    height: 45px;
  }
  
  .navbar-user {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .table-wrapper {
    overflow-x: auto;
  }
  
  .comment-text {
    max-width: 200px;
  }
}
</style>