<template>
  <div class="min-h-screen bg-gray-100 py-10 px-4">
    <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
 

      <!-- Current Resume Section -->
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Current Resume</h3>
        
        <div v-if="resumeUrl" class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded">
          <div>
            <p class="text-gray-600 mb-2">Uploaded Resume:</p>
            <a :href="resumeUrl" target="_blank" 
               class="text-blue-500 hover:text-blue-900 flex items-center">
              <i class="lni lni-download mr-2"></i> Download Resume
            </a>
            <p v-if="!isFileAccessible" class="text-red-500 text-sm mt-1">
              <i class="lni lni-warning mr-1"></i> File not found. Please verify the file exists in /public/resumes/ with the exact name a-e-cv.pdf.
            </p>
          </div>
          <button @click="deleteResume" 
                  class="mt-2 sm:mt-0 text-red-500 hover:text-red-700 flex items-center">
            <i class="lni lni-trash-can mr-2"></i> Delete
          </button>
        </div>

        <div v-else class="bg-gray-50 p-4 rounded text-center">
          <p class="text-gray-600">
            <i class="lni lni-empty-file mr-2"></i> No resume uploaded yet
          </p>
        </div>
      </div>

      <!-- Upload New Resume Section -->
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Upload New Resume</h3>
        
        <form @submit.prevent="uploadResume" class="space-y-4">
          <div>
            <label class="block text-gray-600 mb-2">Select PDF File:</label>
            <input type="file" accept="application/pdf" @change="handleFileChange"
                   class="block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <button type="submit" 
                  class="w-full bg-blue-500 hover:bg-blue-900 text-white py-2 px-4 rounded flex items-center justify-center"
                  :disabled="!selectedFile || isUploading">
            <i class="lni lni-upload mr-2"></i>
            {{ isUploading ? 'Uploading...' : 'Upload Resume' }}
          </button>

          <div v-if="uploadSuccess" class="bg-green-50 text-green-700 p-3 rounded flex items-center">
            <i class="lni lni-checkmark-circle mr-2"></i>
            Resume uploaded successfully! Please copy the file to /public/resumes/ with the exact name a-e-cv.pdf.
          </div>
          <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded flex items-center">
            <i class="lni lni-warning mr-2"></i>
            {{ error }}
          </div>
        </form>
      </div>

      <!-- LinkedIn Integration Section -->
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">LinkedIn Profile</h3>
        
        <div class="bg-gray-50 p-4 rounded text-center">
          <p class="text-gray-600 mb-4">Connect your LinkedIn profile to import work experience</p>
          <button @click="connectWithLinkedIn"
                  class="bg-blue-500 hover:bg-blue-900 text-white py-2 px-6 rounded-full flex items-center justify-center mx-auto">
            <i class="lni lni-linkedin-original mr-2"></i>
            Connect with LinkedIn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
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

    const candidate = computed(() => {
      const candidateData = candidateStore.candidates.find(c => c.user_id === userId) || { resume: null };
      console.log('Candidate data:', candidateData);
      return candidateData;
    });

    const resumeUrl = computed(() => {
      if (candidate.value?.resume) {
        const path = candidate.value.resume.startsWith('/')
          ? candidate.value.resume
          : `/resumes/${candidate.value.resume}`;
        const fullUrl = `http://localhost:5173${path}`;
        console.log('Generated resume URL:', fullUrl);
        fetch(fullUrl, { method: 'HEAD', mode: 'no-cors' })
          .then(response => {
            isFileAccessible.value = response.ok || response.type === 'opaque';
            console.log('File accessibility check:', isFileAccessible.value);
          })
          .catch(err => {
            isFileAccessible.value = false;
            console.error('Fetch error:', err);
          });
        return fullUrl;
      }
      return null;
    });

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
        uploadSuccess.value = false;
        error.value = null;
        console.log('Selected file:', file.name);
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
        console.log('Saving file path:', filePath);

        await candidateStore.updateCandidate(userId, { resume: filePath, user_id: userId });

        uploadSuccess.value = true;
        selectedFile.value = null;
        isFileAccessible.value = true;
      } catch (err) {
        error.value = 'Upload failed. Please try again.';
        console.error('Upload error:', err);
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
        console.log('Resume deleted successfully');
      } catch (err) {
        error.value = 'Failed to delete resume. Please try again.';
        console.error('Delete error:', err);
      }
    };

    const connectWithLinkedIn = () => {
      window.open('https://www.linkedin.com', '_blank');
      console.log('LinkedIn connect clicked');
    };

    onMounted(() => {
      candidateStore.fetchCandidateById(userId);
      console.log('Mounted, using local candidate data for userId:', userId);
    });

    // مراقبة التغييرات في candidates للتأكد من التحديث
    watch(() => candidateStore.candidates, (newCandidates) => {
      console.log('Candidates updated:', newCandidates);
    }, { deep: true });

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
      isFileAccessible
    };
  }
};
</script>

<style scoped>
@import url('https://cdn.lineicons.com/3.0/lineicons.css');

/* Base Styles */
.bg-blue-900 {
  background-color: #003087;
}
.bg-blue-500 {
  background-color: #0052cc;
}
.hover\:bg-blue-900:hover {
  background-color: #003087;
}
.text-blue-500 {
  color: #0052cc;
}
.text-blue-900 {
  color: #003087;
}
.text-red-500 {
  color: #dc3545;
}
.text-red-700 {
  color: #b91c1c;
}
.bg-green-50 {
  background-color: #f0fdf4;
}
.text-green-700 {
  color: #15803d;
}

/* Card Styles */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Input Styles */
.border-gray-300 {
  border-color: #d1d5db;
}
.focus\:ring-blue-500:focus {
  --tw-ring-color: rgba(37, 99, 235, 0.5);
  box-shadow: 0 0 0 3px var(--tw-ring-color);
}

/* Button Styles */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Transition Effects */
button, a {
  transition: all 0.2s ease;
}

/* Responsive Design */
@media (max-width: 640px) {
  .flex-col {
    flex-direction: column;
  }
}

/* Icons */
.lni {
  font-size: 1rem;
  vertical-align: middle;
}
</style>