<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Add New Candidate Profile</h2>
    <div class="card shadow-lg p-4">
      <form @submit.prevent="submitProfile" novalidate>
        <div class="row g-3">
          <!-- Full Name -->
          <div class="col-md-6">
            <label for="name" class="form-label">Full Name</label>
            <input
              id="name"
              v-model="profile.name"
              type="text"
              class="form-control"
            />
            <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
          </div>

          <!-- Email -->
          <div class="col-md-6">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="profile.email"
              type="email"
              class="form-control"
            />
            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
          </div>

          <!-- Phone -->
          <div class="col-md-6">
            <label for="phone" class="form-label">Phone</label>
            <input
              id="phone"
              v-model="profile.phone"
              type="text"
              class="form-control"
            />
            <div v-if="errors.phone" class="text-danger">{{ errors.phone }}</div>
          </div>

          <!-- Location -->
          <div class="col-md-6">
            <label for="location" class="form-label">Location</label>
            <input
              id="location"
              v-model="profile.location"
              type="text"
              class="form-control"
            />
            <div v-if="errors.location" class="text-danger">{{ errors.location }}</div>
          </div>

          <!-- LinkedIn -->
          <div class="col-12">
            <label for="linkedin_profile" class="form-label">LinkedIn Profile URL</label>
            <input
              id="linkedin_profile"
              v-model="profile.linkedin_profile"
              type="url"
              class="form-control"
              placeholder="https://linkedin.com/in/..."
            />
            <div v-if="errors.linkedin_profile" class="text-danger">{{ errors.linkedin_profile }}</div>
          </div>

          <!-- Professional Title -->
          <div class="col-md-6">
            <label for="title" class="form-label">Professional Title</label>
            <input
              id="title"
              v-model="profile.title"
              type="text"
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
            <label for="skills" class="form-label">Skills (comma‑separated)</label>
            <input
              id="skills"
              v-model="profile.skills"
              type="text"
              class="form-control"
              placeholder="JavaScript, Vue.js, PHP"
            />
            <div v-if="errors.skills" class="text-danger">{{ errors.skills }}</div>
          </div>

          <!-- Profile Photo URL -->
          <div class="col-12">
            <label for="profile_photo" class="form-label">Profile Photo URL</label>
            <input
              id="profile_photo"
              v-model="profile.profile_photo"
              type="url"
              class="form-control"
              placeholder="https://example.com/photo.jpg"
            />
            <div v-if="errors.profile_photo" class="text-danger">{{ errors.profile_photo }}</div>
          </div>

          <!-- Experience Entries -->
          <div class="col-12">
            <label class="form-label">Experience</label>
            <div v-for="(exp, idx) in experienceList" :key="idx" class="mb-3 border p-3 rounded">
              <div class="row g-2">
                <div class="col-md-4">
                  <input
                    v-model="exp.title"
                    type="text"
                    placeholder="Job Title"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <input
                    v-model="exp.company"
                    type="text"
                    placeholder="Company"
                    class="form-control"
                  />
                </div>
                <div class="col-md-3">
                  <input
                    v-model="exp.duration"
                    type="text"
                    placeholder="e.g. 2019 - 2022"
                    class="form-control"
                  />
                </div>
                <div class="col-md-1">
                  <button @click.prevent="removeExperience(idx)" type="button" class="btn btn-danger w-100">—</button>
                </div>
              </div>
            </div>
            <button @click.prevent="addExperience" type="button" class="btn btn-secondary">+ Add Experience</button>
          </div>

          <!-- Education Entries -->
          <div class="col-12">
            <label class="form-label">Education</label>
            <div v-for="(edu, idx) in educationList" :key="idx" class="mb-3 border p-3 rounded">
              <div class="row g-2">
                <div class="col-md-5">
                  <input
                    v-model="edu.degree"
                    type="text"
                    placeholder="Degree"
                    class="form-control"
                  />
                </div>
                <div class="col-md-5">
                  <input
                    v-model="edu.institution"
                    type="text"
                    placeholder="Institution"
                    class="form-control"
                  />
                </div>
                <div class="col-md-2">
                  <button @click.prevent="removeEducation(idx)" type="button" class="btn btn-danger w-100">—</button>
                </div>
              </div>
            </div>
            <button @click.prevent="addEducation" type="button" class="btn btn-secondary">+ Add Education</button>
          </div>

          <!-- Submit -->
          <div class="col-12 text-end mt-4">
            <button type="submit" class="btn btn-primary">Create Profile</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

// reactive data
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

const experienceList = ref([
  { title: '', company: '', duration: '' }
])
const educationList = ref([
  { degree: '', institution: '' }
])

// validation errors
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

const urlRegex = /^(https?:\/\/)[^\s]+$/

function addExperience() {
  experienceList.value.push({ title: '', company: '', duration: '' })
}
function removeExperience(i) {
  if (experienceList.value.length > 1) experienceList.value.splice(i, 1)
}
function addEducation() {
  educationList.value.push({ degree: '', institution: '' })
}
function removeEducation(i) {
  if (educationList.value.length > 1) educationList.value.splice(i, 1)
}

async function submitProfile() {
  // reset errors
  Object.keys(errors).forEach(k => (errors[k] = ''))

  // simple validations
  if (!profile.name) errors.name = 'Required'
  if (!profile.email) errors.email = 'Required'
  if (!profile.phone) errors.phone = 'Required'
  if (!profile.location) errors.location = 'Required'
  if (profile.linkedin_profile && !urlRegex.test(profile.linkedin_profile))
    errors.linkedin_profile = 'Invalid URL'
  if (!profile.title) errors.title = 'Required'
  if (!profile.experience_level) errors.experience_level = 'Required'
  if (!profile.skills) errors.skills = 'Required'
  if (profile.profile_photo && !urlRegex.test(profile.profile_photo))
    errors.profile_photo = 'Invalid URL'

  // if any errors, abort
  if (Object.values(errors).some(e => e)) return

  // prepare payload
  const payload = {
    ...profile,
    skills: profile.skills.split(',').map(s => s.trim()),
    experience: experienceList.value.filter(e => e.title && e.company),
    education: educationList.value.filter(e => e.degree && e.institution)
  }

  try {
    await axios.post(
      'http://localhost:8000/api/candidate-profiles',
      payload,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    alert('Profile created successfully!')
    // optional redirect: router.push('/candidate/profile/...')
  } catch (err) {
    console.error(err)
    alert('Failed to create profile.')
  }
}
</script>

<style scoped>
.card { border-radius: 12px; }
</style>
