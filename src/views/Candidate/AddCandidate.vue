<template>
  <div class="container mt-5">
    <div class="alert alert-success text-center" v-if="successMessage">
      {{ successMessage }}
    </div>
    <div class="alert alert-danger text-center" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div class="card shadow-lg">
      <div class="card-body">
        <h2 class="card-title mb-4 text-primary">Add Candidate Profile</h2>
        <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }">
          <!-- Location -->
          <div class="mb-3">
            <label class="form-label">Location</label>
            <input type="text" v-model="form.location" class="form-control" required />
            <div class="invalid-feedback">Location is required.</div>
          </div>

          <!-- LinkedIn Profile -->
          <div class="mb-3">
            <label class="form-label">LinkedIn Profile URL</label>
            <input type="url" v-model="form.linkedin_profile" class="form-control" required/>
            <div class="invalid-feedback">Valid LinkedIn URL is required.</div>
          </div>

          <!-- Education -->
          <div class="mb-3">
            <label class="form-label">Education</label>
            <textarea v-model="form.education" class="form-control" rows="3" required></textarea>
            <div class="invalid-feedback">Education is required.</div>
          </div>

          <!-- Skills -->
          <div class="mb-3">
            <label class="form-label">Skills (comma-separated)</label>
            <input type="text" v-model="form.skills" class="form-control" required />
            <div class="invalid-feedback">At least one skill is required.</div>
          </div>

          <!-- Experience Level -->
          <div class="mb-3">
            <label class="form-label">Experience Level</label>
            <select v-model="form.experience_level" class="form-select" required>
              <option value="">Select level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
            </select>
            <div class="invalid-feedback">Experience level is required.</div>
          </div>

          <button type="submit" class="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
  name: 'CandidateProfileForm',
  data() {
    return {
      wasValidated: false,
      form: {
        location: '',
        linkedin_profile: '',
        education: '',
        skills: '',
        experience_level: '',
      },
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    async submitForm() {
      this.wasValidated = true;
      const formEl = this.$el.querySelector('form');
      if (!formEl.checkValidity()) return;

      try {
        const payload = {
          ...this.form,
          skills: this.form.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
        };
        await axios.post('http://localhost:8000/api/candidates', payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        this.successMessage = 'Profile added successfully!';
        this.errorMessage = '';
        this.form = {
          location: '',
          linkedin_profile: '',
          education: '',
          skills: '',
          experience_level: '',
        };
        this.$router.push('/candidate/dashboard');
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Failed to add profile. Please try again.';
        this.successMessage = '';
        if (error.response && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Server error. Please try again later.';
        }
        this.successMessage = '';
        this.form = {
          location: '',
          linkedin_profile: '',
          education: '',
          skills: '',
          experience_level: '',
        };
      }
    }
  }
};
</script>
