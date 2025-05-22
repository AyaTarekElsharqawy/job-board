<template>
  <div class="register-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-box shadow-lg rounded-4 p-5 bg-white animate__animated animate__fadeIn">

      <!-- Logo Inside Card -->
      <div class="d-flex justify-content-center mb-3">
        <img
          src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/JobBoardLogo.png"
          alt="jobDev Logo"
          class="img-fluid"
          style="width: 700px;"
        />
      </div>

      <!-- Heading -->
      <h2 class="fw-bold text-center text-primary">Create an Account</h2>

      <!-- Alert -->
      <div
        v-if="successMessage"
        class="alert alert-success alert-dismissible fade show"
        role="alert"
      >
        {{ successMessage }}
        <button
          type="button"
          class="btn-close"
          @click="successMessage = null"
          aria-label="Close"
        ></button>
      </div>

       <!-- Alert -->
       <div
        v-if="errorMessage"
        class="alert alert-success alert-dismissible fade show"
        role="alert"
      >
        {{ errorMessage }}
        <button
          type="button"
          class="btn-close"
          @click="errorMessage = null"
          aria-label="Close"
        ></button>
      </div>

      <!-- Form -->
      <AuthForm :isLogin="false" :onSubmit="registerUser" />

      <!-- Footer Link -->
      <div class="text-center mt-3">
        <small class="text-muted">Already have an account?</small>
        <router-link to="/login" class="btn btn-link btn-sm">Log in</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AuthForm from './AuthForm.vue';
import bcrypt from 'bcryptjs';
import axios from 'axios';

export default {
  components: { AuthForm },
  data() {
    return {
      successMessage: null,
      errorMessage: null
    };
  },
  methods: {
      async registerUser(formData) {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 201) {
            this.successMessage = 'Registration successful! Redirecting…';
            setTimeout(() => {
              const { token, user } = response.data;

              // Save token and user data
              localStorage.setItem('token', token);
              localStorage.setItem('role', user.role);
              localStorage.setItem('user', JSON.stringify(user));

              // Redirect to appropriate dashboard
              if (user.role === 'employer') {
                this.$router.push('/employer/add-employer-profile');
              } else if (user.role === 'candidate') {
                this.$router.push('/candidate/add-profile');
              }
            });

          } else {
            this.errorMessage = 'Registration failed.';
          }
        } catch (err) {
          console.error(err);
          this.errorMessage = err.response?.data?.message || 'An error occurred.';
        }
      }
  }
};


</script>


<style scoped>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

/* Apply the same background as login page */
.register-page {
  background: linear-gradient(135deg, #f0f2f5, #e8ebf0);
  font-family: 'Segoe UI', sans-serif;
}

/* Form styling */
.auth-box {
  width: 100%;
  max-width: 550px;
}

/* Logo styling */
.img-fluid {
  max-width: 150px;
  height: 80px;
}

/* Input focus styling */
input.form-control:focus,
select.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  transition: all 0.3s ease;
}
.register-page {
  background: url('https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-business-simple-exhibition-board-jobs-image_22339.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: 'Segoe UI', sans-serif;
}


/* Button lettering */
button {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>