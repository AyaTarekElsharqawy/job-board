<template>
  <div>
    <h1>Manage Comments</h1>
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Comment</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment in comments" :key="comment.id">
          <td>{{ comment.user ? comment.user.name : 'Unknown' }}</td>
          <td>{{ comment.content }}</td>
          <td>{{ formatDate(comment.created_at) }}</td>
          <td>
            <button @click="deleteComment(comment.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../axios'; // Make sure your axios file is correctly configured with baseURL and Authorization headers

const comments = ref([]);
const message = ref('');

// Fetch comments from API
const fetchComments = async () => {
  try {
const res = await api.get('/admin/comments');
    comments.value = res.data.data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    message.value = 'Failed to fetch comments';
  }
};

// Delete a specific comment
const deleteComment = async (id) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  try {
    await api.delete(`/admin/comments/${id}`);
    message.value = 'Comment deleted successfully';
    await fetchComments(); // Update the list after deletion
  } catch (error) {
    console.error('Error deleting comment:', error);
    message.value = 'An error occurred while deleting the comment';
  }
};

onMounted(() => {
  fetchComments();
});
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