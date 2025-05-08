cat > src/components/charts/UserDistributionChart.vue << 'EOL'
<template>
  <div class="chart-container">
    <!-- سيتم استبدال هذا بمخطط حقيقي لاحقاً -->
    <div class="mock-chart">
      <p>User Distribution Chart Placeholder</p>
      <p>Employers: {{ data?.employers || 0 }}</p>
      <p>Candidates: {{ data?.candidates || 0 }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
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