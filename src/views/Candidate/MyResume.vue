<template>
  <div class="min-h-screen bg-blue-500 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <!-- Current Resume Section -->
      <div class="p-4 bg-gray-50 rounded-lg mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Current Resume</h3>
        <div v-if="resumeUrl" class="flex justify-between items-center">
          <a :href="resumeUrl" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
            <i class="lni lni-download mr-2"></i> Download Resume
          </a>
          <button @click="deleteResume" class="text-red-600 hover:text-red-800 flex items-center">
            <i class="lni lni-trash-can mr-2"></i> Delete
          </button>
        </div>
        <div v-else class="text-gray-600 flex items-center">
          <i class="lni lni-empty-file mr-2"></i> No resume uploaded yet
        </div>
      </div>

      <!-- Upload New Resume Section -->
      <div class="p-4 bg-gray-50 rounded-lg mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Upload New Resume</h3>
        <form @submit.prevent="uploadResume" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2 font-medium">Select PDF File:</label>
            <input type="file" accept="application/pdf" @change="handleFileChange" class="w-full border border-gray-300 rounded-lg p-2.5">
          </div>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center" :disabled="!selectedFile || isUploading">
            <i class="lni lni-upload mr-2"></i> {{ isUploading ? 'Uploading...' : 'Upload Resume' }}
          </button>
          <div v-if="uploadSuccess" class="bg-green-50 text-green-700 p-3 rounded-lg flex items-center">
            <i class="lni lni-checkmark-circle mr-2"></i> Resume uploaded successfully! Please copy the file to /public/resumes/ with the exact name a-e-cv.pdf.
          </div>
          <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded-lg flex items-center">
            <i class="lni lni-warning mr-2"></i> {{ error }}
          </div>
        </form>
      </div>

      <!-- LinkedIn Integration Section -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">LinkedIn Profile</h3>
        <div class="text-center">
          <p class="text-gray-600 mb-4">Connect your LinkedIn profile to import work experience</p>
          <button @click="connectWithLinkedIn" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
            <i class="lni lni-linkedin-original mr-2"></i> Connect with LinkedIn
          </button>
          <p v-if="linkedinProfile" class="text-blue-600 mt-2"><a :href="linkedinProfile" target="_blank">{{ linkedinProfile }}</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCandidateStore } from '@/stores/candidateStore';

export default {
  name: 'MyResume',
  setup() {
    const userId = 3;
    const candidateStore = useCandidateStore();
    const selectedFile = ref(null);
    const isUploading = ref(false);
    const uploadSuccess = ref(false);
    const error = ref(null);
    const isFileAccessible = ref(true);

    onMounted(() => {
      candidateStore.fetchCandidateById(userId);
    });

    const candidate = computed(() => {
      return candidateStore.candidates.find(c => c.user_id === userId) || { resume: null, linkedin_profile: null };
    });

    const resumeUrl = computed(() => {
      if (candidate.value?.resume) {
        const path = candidate.value.resume.startsWith('/')
          ? candidate.value.resume
          : `/resumes/${candidate.value.resume}`;
        const fullUrl = `http://localhost:5173${path}`;
        fetch(fullUrl, { method: 'HEAD', mode: 'no-cors' })
          .then(response => {
            isFileAccessible.value = response.ok || response.type === 'opaque';
          })
          .catch(err => {
            isFileAccessible.value = false;
          });
        return fullUrl;
      }
      return null;
    });

    const linkedinProfile = computed(() => candidate.value.linkedin_profile);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
        uploadSuccess.value = false;
        error.value = null;
      } else {
        error.value = 'Please select a valid PDF file.';
        selectedFile.value = null;
      }
    };

    const uploadResume = async () => {
      if (!selectedFile.value) {
        error.value = 'Please select a file to upload.';
        return;
      }

      isUploading.value = true;
      error.value = null;

      try {
        const safeFileName = selectedFile.value.name.replace(/\s+/g, '-').toLowerCase();
        const filePath = `/resumes/${safeFileName}`;
        await candidateStore.updateCandidate(userId, { resume: filePath, user_id: userId });

        uploadSuccess.value = true;
        selectedFile.value = null;
        isFileAccessible.value = true;
      } catch (err) {
        error.value = 'Upload failed. Please try again.';
      } finally {
        isUploading.value = false;
      }
    };

    const deleteResume = async () => {
      try {
        await candidateStore.updateCandidate(userId, { resume: null, user_id: userId });
        uploadSuccess.value = false;
        error.value = null;
        isFileAccessible.value = true;
      } catch (err) {
        error.value = 'Failed to delete resume. Please try again.';
      }
    };

    const connectWithLinkedIn = async () => {
      const linkedinUrl = 'https://www.linkedin.com';
      window.open(linkedinUrl, '_blank');
      const newLinkedinProfile = prompt('Enter your LinkedIn profile URL:', linkedinUrl);
      if (newLinkedinProfile) {
        await candidateStore.updateCandidate(userId, { linkedin_profile: newLinkedinProfile, user_id: userId });
      }
    };

    return {
      resumeUrl,
      selectedFile,
      handleFileChange,
      uploadResume,
      deleteResume,
      connectWithLinkedIn,
      isUploading,
      uploadSuccess,
      error,
      isFileAccessible,
      linkedinProfile
    };
  }
};
</script>

<style scoped>
@import url('https://cdn.lineicons.com/3.0/lineicons.css');

.bg-blue-500 {
  background-color: #00A0E1;
}

.max-w-3xl {
  max-width: 48rem;
}

.bg-white {
  background-color: #ffffff;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-6 {
  padding: 1.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.p-4 {
  padding: 1rem;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-lg {
  font-size: 1.125rem;
}

.font-semibold {
  font-weight: 600;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-600 {
  color: #4b5563;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.text-blue-600 {
  color: #2563eb;
}

.hover\:text-blue-800:hover {
  color: #1e40af;
}

.text-red-600 {
  color: #dc2626;
}

.hover\:text-red-800:hover {
  color: #991b1b;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.text-green-700 {
  color: #15803d;
}

.bg-red-50 {
  background-color: #fef2f2;
}

.text-red-700 {
  color: #b91c1c;
}

.w-full {
  width: 100%;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.rounded {
  border-radius: 0.25rem;
}

.p-2\.5 {
  padding: 0.625rem;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-blue-700 {
  background-color: #1d4ed8;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.text-white {
  color: #ffffff;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.transition {
  transition-property: all;
  transition-duration: 0.3s;
}

.lni {
  font-size: 1.2rem;
  vertical-align: middle;
}
</style>