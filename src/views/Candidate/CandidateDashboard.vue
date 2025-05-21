```vue
<template>
  <div class="bg-gray-100 font-sans min-h-screen">
    <!-- Candidate Dashboard Section -->
    <section class="dashboard">
      <div class="container">
        <div class="row">
          <!-- Sidebar (Left Side) -->
          <div class="col-lg-3 col-md-4 col-12">
            <Sidebar />
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 col-md-8 col-12">
            <div class="main-content">
              <!-- Custom Sentence -->
              <div class="dashboard-block">
                <h3 class="block-title">Welcome to Your Dashboard</h3>
                <p class="text-gray-700 text-lg">
                  Explore new opportunities and manage your career journey with ease!
                </p>
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
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'CandidateDashboard',
  components: {
    Sidebar
  },
  setup() {
    const candidateStore = useCandidateStore();
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    };

    return {
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

.dashboard {
  padding: 30px 0;
  background-color: var(--bg-color);
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

.text-gray-700 {
  color: #374151;
}

.text-lg {
  font-size: 1.125rem;
}
</style>
```