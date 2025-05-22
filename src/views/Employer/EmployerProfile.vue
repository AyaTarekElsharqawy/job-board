<template>
  <div class="bg-gray-100 font-sans min-h-screen">
    <!-- Employer Profile Section -->
    <section class="profile">
      <div class="container px-4">
        <div class="main-content">
          <div class="dashboard-block p-6 bg-white rounded-lg shadow">
            <div class="space-y-6">
              <div class="flex items-center space-x-6 mb-6">
                <div class="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
                  <img
                    :src="employer.company_logo || fallbackLogo"
                    alt="Company Logo"
                    class="w-full h-full object-cover"
                    @error="onLogoError"
                  />
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-gray-800">{{ employer.company_name }}</h3>
                  <p class="text-gray-500">{{ employer.user.email }}</p>
                </div>
              </div>


              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-gray-500">Bio</p>
                  <p class="text-gray-800 font-medium">{{ employer.bio || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Website</p>
                  <a
                    :href="employer.company_website"
                    class="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    {{ employer.company_website || 'N/A' }}
                  </a>
                </div>
              </div>
            </div>
            <!-- Optional edit button or other actions -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

if (localStorage.getItem('role') !== 'employer') {
  router.push({ path: '/' })
}

const employer = ref({
  company_name: '',
  company_website: '',
  company_logo: '',
  bio: '',
  user_id: '',
  created_at: '',
  updated_at: '',
  user: {}
})

const fallbackLogo = 'https://via.placeholder.com/150?text=No+Logo'

const onLogoError = (event) => {
  event.target.src = fallbackLogo
}

onMounted(() => {
  axios
    .get('http://localhost:8000/api/employer-profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      employer.value = response.data.data
    })
    .catch((error) => {
      console.error('Error fetching profile:', error)
    })
})
</script>


<style scoped>
.profile {
  padding: 30px 0;
  background-color: #f5f7fa;
}

.dashboard-block {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid #eaeaea;
  transition: all 0.3s;
}

.dashboard-block:hover {
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
}

img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}
</style>