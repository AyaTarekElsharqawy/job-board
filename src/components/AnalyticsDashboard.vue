cat > src/components/AnalyticsDashboard.vue << 'EOL'
<template>
  <div class="analytics-dashboard">
    <h2>Analytics & Statistics</h2>
    
    <!-- Date Filters -->
    <div class="date-filters">
      <div class="filter-group">
        <label>From:</label>
        <input type="date" v-model="startDate" @change="fetchAnalytics">
      </div>
      
      <div class="filter-group">
        <label>To:</label>
        <input type="date" v-model="endDate" @change="fetchAnalytics">
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p>{{ stats.total_users || 0 }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Total Jobs</h3>
        <p>{{ stats.total_jobs || 0 }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Total Applications</h3>
        <p>{{ stats.total_applications || 0 }}</p>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="charts-container">
      <div class="chart">
        <h3>User Distribution</h3>
        <UserDistributionChart :data="stats.users_distribution" />
      </div>
      
      <div class="chart">
        <h3>Platform Activity</h3>
        <ActivityTimelineChart :data="stats.activity_timeline" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import UserDistributionChart from './charts/UserDistributionChart.vue'
import ActivityTimelineChart from './charts/ActivityTimelineChart.vue'

export default {
  components: { UserDistributionChart, ActivityTimelineChart },
  setup() {
    const adminStore = useAdminStore()
    const stats = ref({})
    const startDate = ref('')
    const endDate = ref('')

    const fetchAnalytics = async () => {
      try {
        const params = {
          start_date: startDate.value,
          end_date: endDate.value
        }
        
        // بيانات وهمية للعرض التوضيحي
        stats.value = {
          total_users: 1254,
          total_jobs: 543,
          total_applications: 2317,
          users_distribution: {
            employers: 324,
            candidates: 930
          },
          activity_timeline: [
            { date: '2023-01-01', count: 120 },
            { date: '2023-01-02', count: 230 },
            { date: '2023-01-03', count: 190 }
          ]
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
      }
    }

    onMounted(() => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 30)
      
      startDate.value = start.toISOString().split('T')[0]
      endDate.value = end.toISOString().split('T')[0]
      
      fetchAnalytics()
    })

    return {
      stats,
      startDate,
      endDate,
      fetchAnalytics
    }
  }
}
</script>

<style scoped>
.analytics-dashboard {
  padding: 20px;
}

.date-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
}
</style>
EOL