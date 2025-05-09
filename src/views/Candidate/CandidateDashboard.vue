<template>
  <div class="bg-gray-100 font-sans min-h-screen">
  

    <!-- Candidate Dashboard Section -->
    <section class="dashboard">
      <div class="container">
        <div class="row">
          <!-- Sidebar (Left Side) -->
          <div class="col-lg-3 col-md-4 col-12">
            <div class="dashboard-sidebar">
              <div class="user-image">
                <img :src="candidate.profile_picture || 'https://i.ibb.co/0jQ7J3T/candidate-avatar.jpg'" alt="User Image" class="w-24 h-24 rounded-full object-cover mx-auto">
                <h3 class="name text-center mt-2">{{ candidate.name }}</h3>
                <p class="email text-center text-gray-600">{{ candidate.email }}</p>
              </div>
              
              <div class="dashboard-menu mt-4">
                <ul class="space-y-2">
                  <li v-for="(item, index) in menuItems" :key="index" :class="{ 'active': $route.path === item.path }">
                    <router-link :to="item.path" class="block py-2 px-4 text-gray-700 hover:bg-blue-200 rounded">
                      <i :class="item.icon"></i> {{ item.title }}
                    </router-link>
                  </li>
                  <li>
                    <a href="#" @click.prevent="logout" class="block py-2 px-4 text-gray-700 hover:bg-red-200 rounded">
                      <i class="lni lni-exit"></i> Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 col-md-8 col-12">
            <div class="main-content">
              <!-- Statistics Widgets -->
              <div class="row dashboard-widgets gap-4">
                <div class="col-lg-12 col-md-12 col-12">
                  <div class="single-widget">
                    <div class="content">
                      <div class="icon">
                        <i class="lni lni-briefcase"></i>
                      </div>
                      <div class="info">
                        <h3 class="counter">{{ stats.appliedJobs }}</h3>
                        <p>Applied Jobs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Applications -->
              <div class="dashboard-block">
                <h3 class="block-title">Recently Applied Jobs</h3>
                <div class="applications-table" v-if="recentApplications.length > 0">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(application, index) in recentApplications" :key="index">
                        <td class="job">
                          <router-link :to="'/jobs/' + application.job_id" class="text-blue-500 hover:underline">{{ application.job_title }}</router-link>
                        </td>
                        <td class="company">{{ application.company }}</td>
                        <td class="date">{{ formatDate(application.created_at) }}</td>
                        <td>
                          <span :class="'status-' + application.status.toLowerCase()">
                            {{ application.status }}
                          </span>
                        </td>
                        <td class="action">
                          <router-link :to="'/jobs/' + application.job_id" class="btn-view">
                            <i class="lni lni-eye"></i> View
                          </router-link>
                          <button @click="cancelApplication(application.id)" class="btn-cancel" v-if="application.status.toLowerCase() === 'pending'">
                            <i class="lni lni-close"></i> Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else class="text-center text-gray-500 py-4">No recent applications found.</div>
              </div>

              <!-- Notifications -->
              <div class="dashboard-block" v-if="notifications.length > 0">
                <h3 class="block-title">Notifications</h3>
                <ul class="notification-list">
                  <li v-for="(notification, index) in notifications" :key="index">
                    <div class="notification-icon">
                      <i :class="notification.icon"></i>
                    </div>
                    <div class="notification-content">
                      <p>{{ notification.message }}</p>
                      <span class="notification-time">{{ formatTime(notification.time) }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useCandidateStore } from '@/stores/candidateStore';
import { useApplicationStore } from '@/stores/applicationStore';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'CandidateDashboard',
  setup() {
    const candidateStore = useCandidateStore();
    const applicationStore = useApplicationStore();
    const router = useRouter();

    const loading = computed(() => candidateStore.loading);
    const error = computed(() => candidateStore.error);
    const candidate = computed(() => ({
      name: "John Doe",
      email: "johndoe@example.com",
      profile_picture: "https://i.ibb.co/0jQ7J3T/candidate-avatar.jpg",
      applications: candidateStore.candidates[0]?.applications || []
    }));
    const recentApplications = computed(() => {
      const apps = [...candidate.value.applications];
      return apps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
    });
    const notifications = ref([]);
    const stats = ref({ appliedJobs: 0 });

    const menuItems = ref([
      { path: '/candidate/dashboard', icon: 'lni lni-dashboard', title: 'Dashboard' },
      { path: '/candidate/profile', icon: 'lni lni-user', title: 'Profile' },
      { path: '/candidate/resume', icon: 'lni lni-file', title: 'My Resume' },
      { path: '/candidate/my-applications', icon: 'lni lni-list', title: 'My Job Applications' },
    ]);

    onMounted(async () => {
      try {
        await candidateStore.fetchCandidates();
        const fetchedStats = await candidateStore.fetchStats();
        stats.value = { ...stats.value, ...fetchedStats, appliedJobs: candidate.value.applications.length };
        notifications.value = await candidateStore.fetchNotifications();
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (date) => {
      const now = new Date();
      const diff = now - date;
      const minute = 60000;
      const hour = 3600000;
      const day = 86400000;
      if (diff < hour) return `${Math.floor(diff / minute)} minutes ago`;
      if (diff < day) return `${Math.floor(diff / hour)} hours ago`;
      return `${Math.floor(diff / day)} days ago`;
    };

    const cancelApplication = async (id) => {
      if (confirm('Are you sure you want to cancel this application?')) {
        try {
          await applicationStore.deleteApplication(id);
          candidate.value.applications = candidate.value.applications.filter(app => app.id !== id);
        } catch (err) {
          console.error('Failed to cancel application:', err);
        }
      }
    };

    const logout = () => {
      router.push('/login');
    };

    return {
      loading,
      error,
      candidate,
      recentApplications,
      notifications,
      stats,
      menuItems,
      formatDate,
      formatTime,
      cancelApplication,
      logout
    };
  }
};
</script>

<style scoped>
@import url('https://cdn.lineicons.com/3.0/lineicons.css');

:root {
  --primary-color: #00a0e1;
  --primary-hover: #0088c7;
  --secondary-color: #f8f9fa;
  --text-color: #333333;
  --light-text: #777777;
  --border-color: #eaeaea;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --danger-color: #f44336;
  --bg-color: #f5f7fa;
}

body {
  background-color: var(--bg-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-area {
  padding: 15px 0;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-brand img {
  max-height: 40px;
  transition: transform 0.3s;
}

.navbar-brand:hover img {
  transform: scale(1.05);
}

.dashboard {
  padding: 30px 0;
  background-color: var(--bg-color);
}

.dashboard-sidebar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
  transition: box-shadow 0.3s;
}

.dashboard-sidebar:hover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.user-image {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.user-image img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 3px solid var(--border-color);
  transition: all 0.3s;
}

.user-image img:hover {
  border-color: var(--primary-color);
  transform: rotate(5deg);
}

.user-image .name {
  font-size: 18px;
  margin-bottom: 5px;
  color: var(--text-color);
  font-weight: 600;
}

.user-image .email {
  color: var(--light-text);
  font-size: 14px;
}

.dashboard-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dashboard-menu li {
  margin-bottom: 5px;
}

.dashboard-menu li a {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.dashboard-menu li a:hover {
  background: rgba(0, 160, 225, 0.1);
  color: var(--primary-hover);
  transform: translateX(5px);
}

.dashboard-menu li.active a {
  background: var(--primary-color);
  color: white;
  font-weight: 500;
}

.dashboard-menu li a i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
  font-size: 16px;
}

.single-widget {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  text-align: center;
}

.single-widget:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
}

.single-widget .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.single-widget .icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 24px;
  color: #fff;
  background: var(--primary-color);
  transition: all 0.3s;
}

.single-widget:hover .icon {
  background: var(--primary-hover);
  transform: scale(1.1);
}

.single-widget .info h3 {
  font-size: 24px;
  margin: 0 0 5px;
  color: var(--text-color);
  font-weight: 600;
}

.single-widget .info p {
  margin: 0;
  color: var(--light-text);
  font-size: 14px;
}

.dashboard-block {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
}

.dashboard-block:hover {
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
}

.block-title {
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  font-weight: 600;
  display: flex;
  align-items: center;
}

.block-title i {
  margin-right: 10px;
  color: var(--primary-color);
}

.applications-table {
  overflow-x: auto;
}

.applications-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.applications-table th {
  background: var(--primary-color);
  color: white;
  font-weight: 500;
  padding: 12px 15px;
  text-align: left;
  font-size: 14px;
}

.applications-table td {
  padding: 12px 15px;
  border-top: 1px solid var(--border-color);
  text-align: left;
  font-size: 14px;
}

.applications-table tr:hover td {
  background-color: rgba(0, 160, 225, 0.05);
}

.applications-table .job a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.applications-table .job a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.status-pending {
  color: var(--warning-color);
  background: rgba(255, 152, 0, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-block;
  font-weight: 500;
}

.status-viewed {
  color: var(--primary-color);
  background: rgba(0, 160, 225, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-block;
  font-weight: 500;
}

.status-rejected {
  color: var(--danger-color);
  background: rgba(244, 67, 54, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-block;
  font-weight: 500;
}

.status-accepted {
  color: var(--success-color);
  background: rgba(76, 175, 80, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-block;
  font-weight: 500;
}

.action .btn-view,
.action .btn-cancel {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.action .btn-view {
  color: var(--primary-color);
  background: rgba(0, 160, 225, 0.1);
}

.action .btn-view:hover {
  color: white;
  background: var(--primary-hover);
}

.action .btn-cancel {
  color: var(--danger-color);
  background: rgba(244, 67, 54, 0.1);
}

.action .btn-cancel:hover {
  color: white;
  background: var(--danger-color);
}

.action .btn-view i,
.action .btn-cancel i {
  margin-right: 5px;
}

/* تحسينات الإشعارات */
.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-list li {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: all 0.3s;
}

.notification-list li:hover {
  background-color: rgba(0, 160, 225, 0.05);
  transform: translateX(5px);
}

.notification-list li:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 160, 225, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: var(--primary-color);
  font-size: 18px;
  transition: all 0.3s;
}

.notification-list li:hover .notification-icon {
  background: var(--primary-color);
  color: white;
}

.notification-content {
  flex: 1;
}

.notification-content p {
  margin: 0 0 5px;
  color: var(--text-color);
  font-size: 14px;
}

.notification-time {
  font-size: 12px;
  color: var(--light-text);
}

.counter {
  transition: all 0.5s ease-out;
}

@media (max-width: 768px) {
  .dashboard-sidebar {
    margin-bottom: 20px;
  }
  
  .single-widget {
    margin-bottom: 15px;
  }
  
  .dashboard-widgets {
    flex-direction: column;
  }
}
</style>