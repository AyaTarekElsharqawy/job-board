<template>
  <div class="bg-gray-100 font-sans min-h-screen">
    <!-- Candidate Profile Section -->
    <section class="profile container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Menu -->
        <div class="lg:w-1/4">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div class="text-center mb-6">
              <div class="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
                <img :src="candidate.profilePhoto || 'https://randomuser.me/api/portraits/men/32.jpg'" 
                     alt="Profile Photo" 
                     class="w-full h-full object-cover">
              </div>
              <h2 class="text-xl font-bold text-gray-800">{{ candidate.name }}</h2>
              <p class="text-gray-500">{{ candidate.title }}</p>
              <p class="text-gray-500 mt-2">{{ candidate.email }}</p>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:w-3/4">
          <div class="bg-white rounded-lg shadow-md p-8 mb-8">
            <div class="flex justify-end items-center mb-6">
              <button v-if="!isEditing" @click="editProfile" 
                      class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                <i class="lni lni-pencil mr-2"></i> Edit Profile
              </button>
            </div>

            <!-- Edit Profile Form -->
            <div v-if="isEditing" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-gray-700 mb-2">Full Name</label>
                  <input v-model="editForm.name" type="text" 
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-gray-700 mb-2">Email</label>
                  <input v-model="editForm.email" type="email" 
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-gray-700 mb-2">Phone</label>
                  <input v-model="editForm.phone" type="text" 
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
                        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button @click="saveProfile" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Save Changes
                </button>
              </div>
            </div>

            <!-- Profile Info -->
            <div v-else class="space-y-8">
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-gray-500">Full Name</p>
                    <p class="text-gray-800 font-medium">{{ candidate.name }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Phone</p>
                    <p class="text-gray-800 font-medium">{{ candidate.phone }}</p>
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
                    <span :class="['px-3 py-1 rounded-full text-sm', 
                                 candidate.experience_level === 'junior' ? 'bg-blue-100 text-blue-800' :
                                 candidate.experience_level === 'mid' ? 'bg-purple-100 text-purple-800' :
                                 'bg-green-100 text-green-800']">
                      {{ candidate.experience_level }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Work Experience</h3>
                <div class="space-y-6">
                  <div v-for="(job, index) in candidate.experience" :key="index" 
                       class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div class="flex justify-between">
                      <div>
                        <h4 class="font-bold text-gray-800">{{ job.position }}</h4>
                        <p class="text-blue-600">{{ job.company }}</p>
                      </div>
                      <span class="text-gray-500 text-sm">{{ job.duration }}</span>
                    </div>
                    <p class="text-gray-600 mt-2">{{ job.description }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Skills</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(skill, index) in candidate.skills" :key="index" 
                        class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {{ skill }}
                  </span>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Education</h3>
                <div class="space-y-6">
                  <div v-for="(edu, index) in candidate.education" :key="index" 
                       class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div class="flex justify-between">
                      <div>
                        <h4 class="font-bold text-gray-800">{{ edu.degree }}</h4>
                        <p class="text-blue-600">{{ edu.institution }}</p>
                      </div>
                      <span class="text-gray-500 text-sm">{{ edu.year }}</span>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: "CandidateProfile",
  setup() {
    const candidateStore = useCandidateStore();
    const router = useRouter();

    const isEditing = ref(false);
    const editForm = ref({});

    const candidate = computed(() => {
      const cand = candidateStore.candidates.find(c => c.user_id === 3) || {};
      return {
        name: cand.name || "John Doe",
        title: cand.title || "Software Engineer",
        email: cand.email || "johndoe@example.com",
        phone: cand.phone_number || "+1234567890",
        location: cand.location || "New York, USA",
        linkedin_profile: cand.linkedin_profile || "https://linkedin.com/in/candidate-a",
        experience_level: cand.experience_level || "junior",
        profilePhoto: cand.profilePhoto,
        experience: cand.experience || [
          {
            position: "Software Engineer",
            company: "Tech Corp",
            description: "Developed innovative software solutions.",
            duration: "2019 - Present"
          },
          {
            position: "Junior Developer",
            company: "Web Solutions",
            description: "Assisted in building and maintaining websites.",
            duration: "2017 - 2019"
          }
        ],
        skills: cand.skills || ["JavaScript", "Vue.js", "Node.js", "HTML", "CSS"],
        education: cand.education || [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "XYZ University",
            year: "2017"
          }
        ]
      };
    });

    onMounted(() => {
      candidateStore.fetchCandidateById(3);
    });

    const editProfile = () => {
      editForm.value = {
        name: candidate.value.name,
        title: candidate.value.title,
        email: candidate.value.email,
        phone: candidate.value.phone,
        location: candidate.value.location,
        linkedin_profile: candidate.value.linkedin_profile,
        experience_level: candidate.value.experience_level,
        profilePhoto: candidate.value.profilePhoto
      };
      isEditing.value = true;
    };

    const saveProfile = async () => {
      await candidateStore.updateCandidate(3, {
        user_id: 3,
        name: editForm.value.name,
        title: editForm.value.title,
        email: editForm.value.email,
        phone_number: editForm.value.phone,
        location: editForm.value.location,
        linkedin_profile: editForm.value.linkedin_profile,
        experience_level: editForm.value.experience_level,
        profilePhoto: editForm.value.profilePhoto
      });
      isEditing.value = false;
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const logout = () => {
      router.push('/login');
    };

    return {
      candidate,
      isEditing,
      editForm,
      editProfile,
      saveProfile,
      cancelEdit,
      logout
    };
  }
};
</script>

<style scoped>
@import url('https://cdn.lineicons.com/3.0/lineicons.css');

/* Base Styles */
.bg-gray-100 {
  background-color: #f8f9fa;
}

/* Card Styles */
.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Input Styles */
.border-gray-300 {
  border-color: #d1d5db;
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Button Styles */
.bg-blue-600 {
  background-color: #2563eb;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

/* Transition Effects */
.transition {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .lg\:w-1\/4 {
    width: 100%;
  }
  .lg\:w-3\/4 {
    width: 100%;
  }
}

/* Sticky Sidebar */
.sticky {
  position: -webkit-sticky;
  position: sticky;
}

/* Avatar Styles */
.w-32 {
  width: 8rem;
}
.h-32 {
  height: 8rem;
}

/* Navigation Styles */
.router-link-active {
  background-color: #eff6ff;
  color: #2563eb;
}
</style>