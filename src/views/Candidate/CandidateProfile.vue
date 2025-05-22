```vue
<template>
  <div class="bg-gray-100 font-sans min-h-screen">
    <!-- Candidate Profile Section -->
    <section class="profile">
      <div class="container">
        <div class="row">
          <!-- Sidebar Menu -->
          <div class="col-lg-3 col-md-4 col-12">
            <Sidebar />
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 col-md-8 col-12">
            <div class="main-content">
              <div class="dashboard-block">
                <div class="flex justify-end items-center mb-6">
                  <button v-if="!isEditing" @click="editProfile" 
                          class="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition flex items-center">
                    <i class="lni lni-pencil mr-2"></i> Edit Profile
                  </button>
                </div>

                <!-- Edit Profile Form -->
                <div v-if="isEditing" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-gray-700 mb-2">Education</label>
                      <input v-model="editForm.education" type="text" 
                             class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                      <label class="block text-gray-700 mb-2">Skills (comma-separated)</label>
                      <input v-model="editForm.skills" type="text" 
                             class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    
                    <div>
                      <label class="block text-gray-700 mb-2">Location</label>
                      <input v-model="editForm.location" type="text" 
                             class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                      <label class="block text-gray-700 mb-2">LinkedIn Profile</label>
                      <input v-model="editForm.linkedin_profile" type="text" 
                             class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                      <label class="block text-gray-700 mb-2">Experience Level</label>
                      <select v-model="editForm.experience_level" 
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="junior">Junior</option>
                        <option value="mid">Mid-Level</option>
                        <option value="senior">Senior</option>
                      </select>
                    </div>
                  </div>

                  <div class="flex justify-end space-x-4">
                    <button @click="cancelEdit" 
                            class="btn-cancel bg-red-600 text-white hover:bg-red-700">
                      Cancel
                    </button>
                    <button @click="saveProfile" 
                            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                      Save Changes
                    </button>
                  </div>
                </div>

                <!-- Profile Info -->
                <div v-else class="space-y-8">
                  <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="block-title">Personal Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p class="text-gray-500">Full Name</p>
                        <p class="text-gray-800 font-medium">{{ candidate.user?.name }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Phone</p>
                        <p class="text-gray-800 font-medium">{{ candidate.user?.phone }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Location</p>
                        <p class="text-gray-800 font-medium">{{ candidate.location }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">LinkedIn</p>
                        <a :href="candidate.linkedin_profile" target="_blank" 
                           class="text-blue-600 hover:underline flex items-center">
                          {{ candidate.linkedin_profile || 'Not provided' }}
                          <i class="lni lni-exit-up ml-1"></i>
                        </a>
                      </div>
                      <div>
                        <p class="text-gray-500">Experience Level</p>
                        <span :class="['status-label', 
                                     candidate.experience_level === 'junior' ? 'status-pending' :
                                     candidate.experience_level === 'mid' ? 'status-viewed' :
                                     'status-accepted']">
                          {{ candidate.experience_level }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="block-title">Skills</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(skill, index) in candidate.skills" :key="index" 
                            class="status-label status-viewed">
                        {{ skill }}
                      </span>
                    </div>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="block-title">Education</h3>
                    <div class="space-y-6">
                      <div class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <div class="flex items-center space-x-2">
                          <div>
                          </div>
                        </div>
                        <div class="mt-2">
                          <p class="text-gray-800 font-medium">{{ candidate.education }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: "CandidateProfile",
  components: {
    Sidebar
  },
  setup() {
    const candidateStore = useCandidateStore();
    const router = useRouter();
    const candidate = ref({});
    const isEditing = ref(false);
    const editForm = ref({});
    const currUser = JSON.parse(localStorage.getItem('user'));
    if (!currUser) {
      router.push('/login');
    }

    onMounted(() => {
      axios.get('http://localhost:8000/api/candidates/user/' + currUser.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then(response => {
        const candidateData = response.data.data;
        candidate.value = {
          education: candidateData.education,
          skills: candidateData.skills,
          location: candidateData.location,
          linkedin_profile: candidateData.linkedin_profile,
          experience_level: candidateData.experience_level,
          user: candidateData.user,
          id: candidateData.id
        };
        console.log('Candidate:', candidate.value);
      }).catch(error => {
        console.error(error);
      });
    });

    const editProfile = () => {
      editForm.value = {
        education: candidate.value.education,
        skills: candidate.value.skills.join(', '),
        location: candidate.value.location,
        linkedin_profile: candidate.value.linkedin_profile,
        experience_level: candidate.value.experience_level,
      };
      isEditing.value = true;
    };

    const saveProfile = async () => {
      const payload = {
        ...editForm.value,
        skills: editForm.value.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      };
      try {
        await axios.put('http://localhost:8000/api/candidates/' + candidate.value.id, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        candidate.value.education = payload.education;
        candidate.value.skills = payload.skills;
        candidate.value.location = payload.location;
        candidate.value.linkedin_profile = payload.linkedin_profile;
        candidate.value.experience_level = payload.experience_level;
        isEditing.value = false;
      } catch (error) {
        console.error(error);
      }
      isEditing.value = false;
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const logout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    };

    const formatDateRange = (duration) => {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const [start, end] = duration.split(' - ');
      let formattedStart = start;
      let formattedEnd = end;

      if (!isNaN(start)) {
        const date = new Date(parseInt(start), 0);
        formattedStart = `${months[date.getMonth()]} ${start}`;
      }
      if (end === 'Present') {
        formattedEnd = 'Present';
      } else if (!isNaN(end)) {
        const date = new Date(parseInt(end), 0);
        formattedEnd = `${months[date.getMonth()]} ${end}`;
      }

      return `${formattedStart} - ${formattedEnd}`;
    };

    const formatYear = (year) => {
      const date = new Date(parseInt(year), 0);
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      return `${months[date.getMonth()]} ${year}`;
    };

    return {
      candidate,
      isEditing,
      editForm,
      editProfile,
      saveProfile,
      cancelEdit,
      logout,
      formatDateRange,
      formatYear
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

.profile {
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

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-blue-700 {
  background-color: #1d4ed8;
}

.bg-blue-800 {
  background-color: #1e40af;
}

.bg-green-600 {
  background-color: #16a34a;
}

.bg-green-700 {
  background-color: #15803d;
}

.bg-red-600 {
  background-color: #dc2626;
}

.bg-red-700 {
  background-color: #b91c1c;
}

.text-white {
  color: white;
}

.rounded-lg {
  border-radius: 8px;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.transition {
  transition: all 0.3s;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-2 > :not(:last-child) {
  margin-right: 0.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.ml-1 {
  margin-left: 0.25rem;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

.md\:grid-cols-2 {
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.gap-6 {
  gap: 1.5rem;
}

.text-gray-700 {
  color: #374151;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.w-full {
  width: 100%;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:border-blue-500:focus {
  border-color: #3b82f6;
}

.justify-end {
  justify-content: flex-end;
}

.space-x-4 > :not(:last-child) {
  margin-right: 1rem;
}

.btn-cancel {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s;
  border: 1px solid var(--border-color);
  color: white;
}

.space-y-8 > :not(:last-child) {
  margin-bottom: 2rem;
}

.text-gray-500 {
  color: var(--light-text);
}

.text-gray-800 {
  color: var(--text-color);
}

.font-medium {
  font-weight: 500;
}

.text-blue-600 {
  color: var(--primary-color);
}

.hover\:underline:hover {
  text-decoration: underline;
}

.status-label {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-block;
  font-weight: 500;
}

.status-pending {
  color: var(--warning-color);
  background: rgba(255, 152, 0, 0.1);
}

.status-viewed {
  color: var(--primary-color);
  background: rgba(0, 160, 225, 0.1);
}

.status-accepted {
  color: var(--success-color);
  background: rgba(76, 175, 80, 0.1);
}

.font-bold {
  font-weight: 700;
}

.text-sm {
  font-size: 0.875rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.text-gray-600 {
  color: #4b5563;
}

.border-b {
  border-bottom-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.pb-6 {
  padding-bottom: 1.5rem;
}

.last\:border-b-0:last-child {
  border-bottom-width: 0;
}

.last\:pb-0:last-child {
  padding-bottom: 0;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-2 {
  gap: 0.5rem;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-block;
  font-weight: 500;
}
</style>
```