<template>
  <div class="job-comments-section">
    <h3>Comments</h3>
    
    <!-- Display Comments -->
    <div v-if="commentStore.comments.length > 0" class="comments-list">
  <div v-for="comment in commentStore.comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.user.name }}</span>
          <span class="comment-date">{{ new Date(comment.created_at).toLocaleDateString() }}</span>
          <button v-if="isAuthenticated && userId === comment.user_id" @click="deleteComment(comment.id)" class="delete-btn">×</button>
        </div>
        <p class="comment-text">{{ comment.content }}</p>
      </div>
    </div>
    <p v-else class="no-comments">No comments yet.</p>

    <!-- Add Comment Form -->
    <div v-if="isAuthenticated" class="add-comment-section">
      <textarea v-model="newComment" placeholder="Write your comment..." class="comment-input" rows="3" @keyup.enter="addComment"></textarea>
      <button @click="addComment" class="add-comment-btn" :disabled="!newComment.trim()">Add Comment</button>
    </div>
    <p v-else class="login-prompt">Please <router-link to="/login">log in</router-link> to add a comment.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCommentStore } from '@/stores/commentStore'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const commentStore = useCommentStore()
const authStore = useAuthStore()

const newComment = ref('')
const jobId = Number(route.params.id)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userId = computed(() => authStore.user?.id)

onMounted(() => {
  commentStore.fetchComments(jobId)
})

const addComment = async () => {
  if (!newComment.value.trim()) return;
  await commentStore.addComment(jobId, newComment.value);
  newComment.value = '';
}

const deleteComment = async (id) => {
  if (confirm('Are you sure you want to delete this comment?')) {
    await commentStore.deleteComment(id);
  }
}

onMounted(fetchComments)
</script>

<style scoped>
.job-comments-section {
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #047fec;
  margin-bottom: 1rem;
}

.comments-list {
  margin-bottom: 1.5rem;
}

.comment-item {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: #333;
}

.comment-date {
  color: #666;
  font-size: 0.9rem;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #f5222d;
  cursor: pointer;
}

.comment-text {
  color: #444;
  line-height: 1.5;
}

.no-comments {
  color: #666;
  text-align: center;
}

.add-comment-section {
  margin-top: 1rem;
}

.comment-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.add-comment-btn {
  background: #047fec;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-comment-btn:hover {
  background: #0366c4;
}

.add-comment-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-prompt {
  color: #666;
  text-align: center;
}

.login-prompt a {
  color: #047fec;
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}
</style>