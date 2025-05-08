<template>
  <div class="notification-center">
    <button class="notification-icon" @click="toggleNotifications">
      <i class="fas fa-bell"></i>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>
    
    <div v-if="showNotifications" class="notification-dropdown">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button @click="markAllAsRead">Mark All as Read</button>
      </div>
      
      <div v-if="notifications.length === 0" class="empty-notifications">
        No notifications
      </div>
      
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.read }"
        @click="handleNotificationClick(notification)"
      >
        <div class="notification-icon">
          <i :class="getNotificationIcon(notification.type)"></i>
        </div>
        <div class="notification-content">
          <p class="notification-message">{{ notification.message }}</p>
          <p class="notification-time">{{ formatTime(notification.timestamp) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useNotificationStore } from '../stores/notification'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const notificationStore = useNotificationStore()
    const router = useRouter()
    const showNotifications = ref(false)
    
    const notifications = computed(() => notificationStore.notifications)
    const unreadCount = computed(() => notificationStore.unreadCount)
    
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
    }
    
    const markAllAsRead = () => {
      notificationStore.markAllAsRead()
    }
    
    const handleNotificationClick = (notification) => {
      if (!notification.read) {
        notificationStore.markAsRead(notification.id)
      }
      handleNotificationAction(notification)
      showNotifications.value = false
    }
    
    const handleNotificationAction = (notification) => {
      switch (notification.type) {
        case 'new_user':
          router.push('/admin/users')
          break
        case 'new_job':
          router.push('/admin/jobs')
          break
        case 'new_comment':
          router.push('/admin/comments')
          break
        case 'warning':
          // Handle warning
          break
        case 'info':
          // Handle info
          break
      }
    }
    
    const getNotificationIcon = (type) => {
      const icons = {
        new_user: 'fas fa-user-plus',
        new_job: 'fas fa-briefcase',
        new_comment: 'fas fa-comment',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icons[type] || 'fas fa-bell'
    }
    
    const formatTime = (date) => {
      const now = new Date()
      const diff = now - new Date(date)
      
      const minute = 60 * 1000
      const hour = 60 * minute
      const day = 24 * hour
      
      if (diff < minute) return 'Just now'
      if (diff < hour) return `${Math.floor(diff / minute)} minutes ago`
      if (diff < day) return `${Math.floor(diff / hour)} hours ago`
      return new Date(date).toLocaleDateString('en-US')
    }
    
    return {
      showNotifications,
      notifications,
      unreadCount,
      toggleNotifications,
      markAllAsRead,
      handleNotificationClick,
      getNotificationIcon,
      formatTime
    }
  }
}
</script>

<style scoped>
.notification-center {
  position: relative;
  margin-left: auto;
}

.notification-icon {
  position: relative;
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  color: #555;
  padding: 8px;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  max-height: 500px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.notification-header h3 {
  margin: 0;
  font-size: 1.1em;
}

.notification-header button {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  font-size: 0.9em;
}

.empty-notifications {
  padding: 20px;
  text-align: center;
  color: #777;
}

.notification-item {
  display: flex;
  gap: 10px;
  padding: 10px 15px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.notification-item.unread {
  background: #f8f9fa;
}

.notification-item:hover {
  background: #f1f1f1;
}

.notification-icon {
  font-size: 1.2em;
  color: #42b983;
  padding-top: 3px;
}

.notification-content {
  flex: 1;
}

.notification-message {
  margin: 0;
  font-size: 0.9em;
}

.notification-time {
  margin: 5px 0 0;
  font-size: 0.8em;
  color: #777;
}
</style>