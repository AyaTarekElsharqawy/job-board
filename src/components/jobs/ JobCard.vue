<template>
  <div class="job-card">
    <div class="card-header">
      <h3 class="job-title">{{ job.title }}</h3>
      <p class="location">{{ job.location }}</p>
      <span class="job-type">{{ job.type }}</span>
    </div>
    
    <div class="card-footer">
      <span class="deadline">Deadline: {{ job.deadline }}</span>
      <button class="apply-btn" @click="goToJobDetails">Apply Now</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  job: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'id' in value && 'title' in value
    }
  }
})

const goToJobDetails = () => {
  if (props.job?.id) {
    router.push(`/jobs/${props.job.id}`)
  } else {
    console.error('Job ID is missing')
  }
}
</script>

<style scoped>
.job-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  margin: 2%;
  overflow: hidden; /* يمنع المحتوى من الخروج خارج الكارد */
  word-wrap: break-word; /* يكسر الكلمات الطويلة إذا لزم الأمر */
  max-width: 100%; /* يضمن أن الكارد لن يتجاوز عرض الحاوية */
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 1rem;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #047fec;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* يحدد عدد الأسطر قبل القص */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* يظهر نقاط ... عند النهاية */
  max-height: 3em; /* ارتفاع مناسب لسطرين */
}

.location {
  color: #718096;
  margin-bottom: 1rem;
  white-space: nowrap; /* يمنع التفاف النص */
  overflow: hidden;
  text-overflow: ellipsis; /* يظهر نقاط ... إذا كان النص طويلاً */
  max-width: 100%; /* يضمن أن النص لن يتجاوز عرض الحاوية */
}

.job-type {
  background: #00e56c;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  width: 100%;
}

.deadline {
  color: #718096;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%; /* يترك مساحة للزر */
}

.apply-btn {
  background: #00e56c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap; /* يمنع التفاف نص الزر */
  flex-shrink: 0; /* يمنع تصغير حجم الزر */
}

.apply-btn:hover {
  background: #047fec;
}

/* للهواتف المحمولة */
@media (max-width: 768px) {
  .job-card {
    margin: 1rem 0;
    padding: 1rem;
  }
  
  .card-header h3 {
    font-size: 1.1rem;
  }
  
  .deadline {
    max-width: 50%;
  }
}
</style>