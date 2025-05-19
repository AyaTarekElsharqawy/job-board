<template>
  <div class="container mt-5">
    <div class="card shadow-lg">
      <div class="card-body">
        <h2 class="card-title mb-4 text-primary">Add New Candidate</h2>
        <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }">
          <div class="row g-3">
            <!-- Full Name -->
            <div class="col-md-6">
              <label class="form-label">Full Name</label>
              <input type="text" v-model="form.name" class="form-control" required />
              <div class="invalid-feedback">Full name is required.</div>
            </div>

            <!-- Email -->
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input type="email" v-model="form.email" class="form-control" required />
              <div class="invalid-feedback">Valid email is required.</div>
            </div>

            <!-- Phone -->
            <div class="col-md-6">
              <label class="form-label">Phone</label>
              <input type="text" v-model="form.phone" class="form-control" required />
              <div class="invalid-feedback">Phone number is required.</div>
            </div>

            <!-- Location -->
            <div class="col-md-6">
              <label class="form-label">Location</label>
              <input type="text" v-model="form.location" class="form-control" required />
              <div class="invalid-feedback">Location is required.</div>
            </div>

            <!-- LinkedIn -->
            <div class="col-md-6">
              <label class="form-label">LinkedIn Profile</label>
              <input type="url" v-model="form.linkedin_profile" class="form-control" required />
              <div class="invalid-feedback">Valid LinkedIn URL is required.</div>
            </div>

            <!-- Experience Level -->
            <div class="col-md-6">
              <label class="form-label">Experience Level</label>
              <select v-model="form.experience_level" class="form-select" required>
                <option value="">Select level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
              </select>
              <div class="invalid-feedback">Experience level is required.</div>
            </div>

            <!-- Title -->
            <div class="col-md-6">
              <label class="form-label">Professional Title</label>
              <input type="text" v-model="form.title" class="form-control" required />
              <div class="invalid-feedback">Title is required.</div>
            </div>

            <!-- Profile Photo URL -->
            <div class="col-md-6">
              <label class="form-label">Profile Photo URL</label>
              <input type="url" v-model="form.profile_photo" class="form-control" required />
              <div class="invalid-feedback">Valid photo URL is required.</div>
            </div>

            <!-- Skills -->
            <div class="col-12">
              <label class="form-label">Skills (comma-separated)</label>
              <input type="text" v-model="form.skills" class="form-control" required />
              <div class="invalid-feedback">At least one skill is required.</div>
            </div>

            <!-- Experience -->
            <div class="col-12">
              <label class="form-label">Experience</label>
              <textarea v-model="form.experience" class="form-control" rows="3" required></textarea>
              <div class="invalid-feedback">Experience is required and must be valid JSON.</div>
            </div>

            <!-- Education -->
            <div class="col-12">
              <label class="form-label">Education</label>
              <textarea v-model="form.education" class="form-control" rows="3" required></textarea>
              <div class="invalid-feedback">Education is required and must be valid JSON.</div>
            </div>
          </div>

          <div class="mt-4">
            <button type="submit" class="btn btn-primary w-100">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddCandidate',
  data() {
    return {
      wasValidated: false,
      form: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin_profile: '',
        experience_level: '',
        profile_photo: '',
        title: '',
        skills: '',
        experience: '',
        education: '',
      }
    };
  },
  methods: {
    isValidJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    },
    async submitForm() {
      this.wasValidated = true;

      const formEl = this.$el.querySelector('form');

      // Manual validation for JSON fields
      const experienceValid = this.isValidJSON(this.form.experience);
      const educationValid = this.isValidJSON(this.form.education);

      // Set custom validity for JSON fields if needed
      const expField = formEl.querySelector('[v-model="form.experience"]');
      const eduField = formEl.querySelector('[v-model="form.education"]');

      if (!experienceValid) expField.setCustomValidity("Invalid JSON");
      else expField.setCustomValidity("");

      if (!educationValid) eduField.setCustomValidity("Invalid JSON");
      else eduField.setCustomValidity("");

      if (!formEl.checkValidity()) {
        return;
      }

      try {
        const payload = {
          ...this.form,
          skills: this.form.skills.split(',').map(s => s.trim()),
          experience: JSON.parse(this.form.experience),
          education: JSON.parse(this.form.education),
        };
        await axios.post('/api/candidates', payload);
        alert('Candidate added successfully!');
        this.$router.push('/candidates');
      } catch (error) {
        console.error(error);
        alert('Error adding candidate.');
      }
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
