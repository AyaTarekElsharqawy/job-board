<template>
  <div class="pagination">
    <button 
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="page-nav"
    >
      Previous
    </button>
    
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      :class="{ active: page === currentPage }"
      class="page-number"
    >
      {{ page }}
    </button>
    
    <button 
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="page-nav"
    >
      Next
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    maxVisible: {
      type: Number,
      default: 5
    }
  },
  emits: ['page-changed'],
  setup(props, { emit }) {
    const visiblePages = computed(() => {
      const half = Math.floor(props.maxVisible / 2)
      let start = Math.max(1, props.currentPage - half)
      let end = Math.min(props.totalPages, start + props.maxVisible - 1)
      
      if (end - start + 1 < props.maxVisible) {
        start = Math.max(1, end - props.maxVisible + 1)
      }
      
      const pages = []
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const goToPage = (page) => {
      if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit('page-changed', page)
      }
    }

    return { visiblePages, goToPage }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 20px;
}

.page-nav, .page-number {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  min-width: 40px;
}

.page-number.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.page-nav:disabled, .page-number:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .page-nav {
    display: none;
  }
  
  .page-number {
    padding: 6px 10px;
    min-width: 30px;
  }
}
</style>