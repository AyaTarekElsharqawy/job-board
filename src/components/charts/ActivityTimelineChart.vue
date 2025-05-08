cat > src/components/charts/ActivityTimelineChart.vue << 'EOL'
<template>
  <div class="chart-container">
    <!-- سيتم استبدال هذا بمخطط حقيقي لاحقاً -->
    <div class="mock-chart">
      <p>Activity Timeline Chart Placeholder</p>
      <div v-for="(item, index) in data" :key="index">
        {{ item.date }}: {{ item.count }} activities
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  }
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mock-chart {
  border: 1px dashed #ccc;
  padding: 20px;
  text-align: center;
}
</style>
EOL