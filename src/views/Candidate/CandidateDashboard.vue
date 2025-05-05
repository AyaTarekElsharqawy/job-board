<template>
  <!-- Header Section -->
  <header class="header-area">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="navbar navbar-expand-lg">
            <router-link class="navbar-brand" to="/">
              <img src="https://i.ibb.co/0jQ7J3T/job-board-logo.png" alt="JobBoard Logo">
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </header>

  <!-- Candidate Dashboard Section -->
  <section class="dashboard section">
    <div class="container">
      <div class="row">
        <!-- Sidebar (Left Side) -->
        <div class="col-lg-3 col-md-4 col-12">
          <div class="dashboard-sidebar">
            <div class="user-image">
              <img src="https://i.ibb.co/0jQ7J3T/candidate-avatar.jpg" alt="User Image">
              <h3 class="name">{{ candidate.name }}</h3>
              <p class="email">{{ candidate.email }}</p>
            </div>
            
            <div class="dashboard-menu">
              <ul>
                <li v-for="(item, index) in menuItems" :key="index" 
                    :class="{active: $route.path === item.path}">
                  <router-link :to="item.path">
                    <i :class="item.icon"></i> {{ item.title }}
                  </router-link>
                </li>
                <li @click="logout">
                  <a href="#"><i class="lni lni-exit"></i> Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-lg-9 col-md-8 col-12">
          <div class="main-content">
            <!-- Statistics Widgets -->
            <div class="row dashboard-widgets">
              <div class="col-lg-4 col-md-6 col-12">
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
              
              <div class="col-lg-4 col-md-6 col-12">
                <div class="single-widget">
                  <div class="content">
                    <div class="icon">
                      <i class="lni lni-bookmark"></i>
                    </div>
                    <div class="info">
                      <h3 class="counter">{{ stats.shortlistedJobs }}</h3>
                      <p>Shortlisted</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-lg-4 col-md-6 col-12">
                <div class="single-widget">
                  <div class="content">
                    <div class="icon">
                      <i class="lni lni-envelope"></i>
                    </div>
                    <div class="info">
                      <h3 class="counter">{{ stats.messages }}</h3>
                      <p>Messages</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Applications -->
            <div class="dashboard-block recent-applications">
              <h3 class="block-title">Recently Applied Jobs</h3>
              <div class="applications-table table-responsive">
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
                        <router-link :to="'/jobs/' + application.jobId">{{ application.jobTitle }}</router-link>
                      </td>
                      <td class="company">{{ application.company }}</td>
                      <td class="date">{{ formatDate(application.appliedDate) }}</td>
                      <td>
                        <span :class="'status-' + application.status.toLowerCase()">
                          {{ application.status }}
                        </span>
                      </td>
                      <td class="action">
                        <router-link :to="'/jobs/' + application.jobId" class="btn-view">
                          <i class="lni lni-eye"></i> View
                        </router-link>
                        <button class="btn-cancel" @click="cancelApplication(application.jobId)">
                          <i class="lni lni-close"></i> Cancel
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Notifications -->
            <div class="dashboard-block notifications" v-if="notifications.length > 0">
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
</template>

<script>
import { useCandidateStore } from '@/stores/candidate';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'CandidateDashboard',
  setup() {
    const candidateStore = useCandidateStore();
    const router = useRouter();

    // Candidate data
    const candidate = ref({
      name: "Mohamed Ahmed",
      title: "UI/UX Designer",
      email: "mohamed@example.com",
      phone: "+20123456789"
    });

    // Dashboard statistics
    const stats = ref({
      appliedJobs: 12,
      shortlistedJobs: 5,
      messages: 3
    });

    // Sidebar menu items
    const menuItems = ref([
      { path: '/candidate/dashboard', icon: 'lni lni-dashboard', title: 'Dashboard' },
      { path: '/candidate/profile', icon: 'lni lni-user', title: 'Profile' },
      { path: '/candidate/resume', icon: 'lni lni-file', title: 'My Resume' },
      { path: '/candidate/applied-jobs', icon: 'lni lni-briefcase', title: 'Applied Jobs' },
      { path: '/candidate/shortlist-jobs', icon: 'lni lni-bookmark', title: 'Shortlisted Jobs' },
      { path: '/candidate/alert-jobs', icon: 'lni lni-alarm', title: 'Job Alerts' },
      { path: '/candidate/cv-manager', icon: 'lni lni-files', title: 'CV Manager' },
      { path: '/candidate/change-password', icon: 'lni lni-lock', title: 'Change Password' }
    ]);

    // Recent job applications (modified according to the attached image)
    const recentApplications = ref([
      {
        jobId: 1,
        jobTitle: "Senior UI/UX Designer",
        company: "Tech Solutions Ltd.",
        appliedDate: new Date('2023-05-15'),
        status: "Under Review"
      },
      {
        jobId: 2,
        jobTitle: "Frontend Developer",
        company: "Web Company",
        appliedDate: new Date('2023-05-10'),
        status: "Viewed"
      },
      {
        jobId: 3,
        jobTitle: "UI/UX Designer",
        company: "Design Studio",
        appliedDate: new Date('2023-05-05'),
        status: "Rejected"
      }
    ]);

    // Notifications (modified according to the attached image)
    const notifications = ref([
      {
        message: "Your application for Senior UI/UX Designer has been viewed",
        icon: "lni lni-eye",
        time: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        message: "New job matches your profile: Full Stack Developer",
        icon: "lni lni-briefcase",
        time: new Date(Date.now() - 86400000) // 1 day ago
      }
    ]);

    // Helper functions
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const formatTime = (date) => {
      const now = new Date();
      const diff = now - date;
      
      const minute = 60000;
      const hour = 3600000;
      const day = 86400000;
      
      if (diff < hour) {
        return `${Math.floor(diff / minute)} minutes ago`;
      } else if (diff < day) {
        return `${Math.floor(diff / hour)} hours ago`;
      } else {
        return `${Math.floor(diff / day)} days ago`;
      }
    };

    const cancelApplication = (jobId) => {
      // Here will be the implementation to cancel job application
      console.log('Cancelled application for job ID:', jobId);
    };

    const logout = () => {
      candidateStore.logout();
      router.push('/login');
    };

    // Fetch candidate data when component mounts
    onMounted(() => {
      candidateStore.fetchCandidateProfile()
        .then(profile => {
          candidate.value = { ...candidate.value, ...profile };
        });
      
      candidateStore.fetchApplications()
        .then(applications => {
          recentApplications.value = applications;
        });
    });

    return {
      candidate,
      stats,
      menuItems,
      recentApplications,
      notifications,
      formatDate,
      formatTime,
      cancelApplication,
      logout
    };
  }
};
</script>

<style scoped>
/* Styling adjusted for the requested theme */
@import url('https://cdn.lineicons.com/3.0/lineicons.css');

:root {
  --primary-color: #00a0e1; /* Light blue color from the template */
  --primary-hover: #0088c7;
  --secondary-color: #f8f9fa;
  --text-color: #333333;
  --light-text: #777777;
  --border-color: #eaeaea;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --danger-color: #f44336;
  --bg-color: #f5f7fa; /* New background color */
}

body {
  background-color: var(--bg-color);
}

.header-area {
  padding: 15px 0;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.navbar-brand img {
  max-height: 40px;
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
  display: block;
  padding: 10px 15px;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 14px;
}

.dashboard-menu li a:hover,
.dashboard-menu li.active a {
  background: rgba(0, 160, 225, 0.1);
  color: var(--primary-color);
}

.dashboard-menu li a i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

/* Statistics Widgets */
.single-widget {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid var(--border-color);
}

.single-widget .content {
  display: flex;
  align-items: center;
}

.single-widget .icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: #fff;
  background: var(--primary-color);
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

/* Recent Applications */
.dashboard-block {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
}

.block-title {
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  font-weight: 600;
}

.applications-table table {
  width: 100%;
  border-collapse: collapse;
}

.applications-table th {
  background: var(--secondary-color);
  color: var(--light-text);
  font-weight: 600;
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

.applications-table .job a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.applications-table .job a:hover {
  color: var(--primary-color);
}

.status-pending {
  color: var(--warning-color);
  background: rgba(255, 152, 0, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.status-viewed {
  color: var(--primary-color);
  background: rgba(0, 160, 225, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.status-rejected {
  color: var(--danger-color);
  background: rgba(244, 67, 54, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.status-accepted {
  color: var(--success-color);
  background: rgba(76, 175, 80, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.action .btn-view,
.action .btn-cancel {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 13px;
  margin-left: 5px;
  display: inline-block;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.action .btn-view {
  color: var(--primary-color);
  background: rgba(0, 160, 225, 0.1);
}

.action .btn-cancel {
  color: var(--danger-color);
  background: rgba(244, 67, 54, 0.1);
}

.action .btn-view:hover,
.action .btn-cancel:hover {
  opacity: 0.8;
}

/* Notifications */
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
}

.notification-content {
  flex: 1;
  text-align: left;
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
</style>