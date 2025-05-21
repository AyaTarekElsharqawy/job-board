import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useCommentStore = defineStore('comment', () => {
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiUrl = 'http://localhost:8000/api';

  const fetchComments = async (jobId: number) => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get(`${apiUrl}/jobs/${jobId}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    comments.value = res.data.data; 
  } catch (err) {
    error.value = 'Failed to load comments';
  } finally {
    loading.value = false;
  }
};

const addComment = async (jobId: number, content: string) => {
  try {
    const res = await axios.post(`${apiUrl}/jobs/${jobId}/comments`, { content }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    comments.value.unshift(res.data.data);
  } catch (err) {
    error.value = 'Failed to add comment';
  }
};

const deleteComment = async (id: number) => {
  try {
    await axios.delete(`${apiUrl}/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    comments.value = comments.value.filter(c => c.id !== id);
  } catch (err) {
    error.value = 'Failed to delete comment';
  }
};


  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    deleteComment
  }
})
