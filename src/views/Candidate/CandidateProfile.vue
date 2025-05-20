<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Complete Candidate Profile</h2>
    <div class="card shadow p-4">
      <form @submit.prevent="submitProfile" novalidate>
        <div class="row g-3">
          <!-- Full Name -->
          <div class="col-md-6">
            <label for="name" class="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              v-model="profile.name"
              class="form-control"
            />
            <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
          </div>

          <!-- Email -->
          <div class="col-md-6">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              v-model="profile.email"
              class="form-control"
            />
            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
          </div>

          <!-- Phone -->
          <div class="col-md-6">
            <label for="phone" class="form-label">Phone</label>
            <input
              type="text"
              id="phone"
              v-model="profile.phone"
              class="form-control"
            />
            <div v-if="errors.phone" class="text-danger">{{ errors.phone }}</div>
          </div>

          <!-- Location -->
          <div class="col-md-6">
            <label for="location" class="form-label">Location</label>
            <input
              type="text"
              id="location"
              v-model="profile.location"
              class="form-control"
            />
            <div v-if="errors.location" class="text-danger">{{ errors.location }}</div>
          </div>

          <!-- LinkedIn URL -->
          <div class="col-12">
            <label for="linkedin_profile" class="form-label">LinkedIn Profile URL</label>
            <input
              type="url"
              id="linkedin_profile"
              v-model="profile.linkedin_profile"
              class="form-control"
              placeholder="https://linkedin.com/in/..."
            />
            <div v-if="errors.linkedin_profile" class="text-danger">{{ errors.linkedin_profile }}</div>
          </div>

          <!-- Professional Title -->
          <div class="col-md-6">
            <label for="title" class="form-label">Professional Title</label>
            <input
              type="text"
              id="title"
              v-model="profile.title"
              class="form-control"
            />
            <div v-if="errors.title" class="text-danger">{{ errors.title }}</div>
          </div>

          <!-- Experience Level -->
          <div class="col-md-6">
            <label for="experience_level" class="form-label">Experience Level</label>
            <select
              id="experience_level"
              v-model="profile.experience_level"
              class="form-select"
            >
              <option value="">Select one</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid‑Level</option>
              <option value="senior">Senior</option>
            </select>
            <div v-if="errors.experience_level" class="text-danger">{{ errors.experience_level }}</div>
          </div>

          <!-- Skills -->
          <div class="col-12">
            <label for="skills" class="form-label">Skills (comma-separated)</label>
            <input
              type="text"
              id="skills"
              v-model="profile.skills"
              class="form-control"
              placeholder="JavaScript, Vue.js, PHP"
            />
            <div v-if="errors.skills" class="text-danger">{{ errors.skills }}</div>
          </div>

          <!-- Profile Photo URL -->
          <div class="col-12">
            <label for="profile_photo" class="form-label">Profile Photo URL</label>
            <input
              type="url"
              id="profile_photo"
              v-model="profile.profile_photo"
              class="form-control"
              placeholder="https://example.com/photo.jpg"
            />
            <div v-if="errors.profile_photo" class="text-danger">{{ errors.profile_photo }}</div>
          </div>

          <!-- Submit Button -->
          <div class="col-12 text-end">
            <button type="submit" class="btn btn-primary">
              Create Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

// نموذج البيانات
const profile = reactive({
  user_id: authStore.user.id,
  name: '',
  email: '',
  phone: '',
  location: '',
  linkedin_profile: '',
  title: '',
  experience_level: '',
  skills: '',
  profile_photo: ''
})

// أخطاء التحقق
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  location: '',
  linkedin_profile: '',
  title: '',
  experience_level: '',
  skills: '',
  profile_photo: ''
})

// Regex بسيط للتحقق من رابط
const urlRegex = /^(https?:\/\/)[^\s]+$/

async function submitProfile() {
  // إعادة تهيئة الأخطاء
  Object.keys(errors).forEach(k => (errors[k] = ''))

  // التحقق البسيط
  if (!profile.name) errors.name = 'Name is required'
  if (!profile.email) errors.email = 'Email is required'
  if (!profile.phone) errors.phone = 'Phone is required'
  if (!profile.location) errors.location = 'Location is required'
  if (profile.linkedin_profile && !urlRegex.test(profile.linkedin_profile))
    errors.linkedin_profile = 'Enter a valid URL'
  if (!profile.title) errors.title = 'Title is required'
  if (!profile.experience_level) errors.experience_level = 'Select experience level'
  if (!profile.skills) errors.skills = 'At least one skill is required'
  if (profile.profile_photo && !urlRegex.test(profile.profile_photo))
    errors.profile_photo = 'Enter a valid URL'

  // إذا لم يكن هناك أخطاء
  if (!Object.values(errors).some(msg => msg)) {
    try {
      const payload = {
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim())
      }
      await axios.post(
        'http://localhost:8000/api/candidate-profiles',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      alert('Candidate profile created successfully')
      // توجيه اختياري بعد الإنشاء...
    } catch (e) {
      console.error(e)
      alert('Failed to create profile')
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
