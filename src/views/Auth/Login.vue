<template>
  <div class="login-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-box shadow-lg rounded-4 p-5 bg-white animate__animated animate__fadeIn">

      <!-- Logo -->
      <div class="text-center mb-4">
        <img
          height="80px"
          src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/JobBoardLogo.png"
          alt="jobDev Logo"
          class="logo-img mb-2"
        />
        <h3 class="fw-bold text-primary">Welcome to job Board</h3>
      </div>

      <!-- Bootstrap Alert -->
      <div v-if="alertMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ alertMessage }}
        <button type="button" class="btn-close" @click="alertMessage = null" aria-label="Close"></button>
      </div>

      <!-- Auth Form -->
      <AuthForm :isLogin="true" :onSubmit="loginUser" />

      <!-- Create Account Link -->
      <div class="text-center mt-4">
        <span>Don't have an account?</span>
        <router-link to="/register" class="btn btn-outline-primary btn-sm ms-2">Create Account</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import bcrypt from 'bcryptjs';
import AuthForm from './AuthForm.vue';

export default {
  components: { AuthForm },
  data() {
    return {
      alertMessage: null
    };
  },
  methods: {
    async loginUser({ email, password }) {
      try {
        // Step 1: Get user by email only
        const response = await axios.get('http://localhost:3000/users', {
          params: { email }
        });

        const user = response.data[0];

        if (!user) {
          this.alertMessage = 'Invalid email or password.';
          return;
        }

        // Step 2: Compare entered password with hashed password in db
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          this.alertMessage = 'Invalid email or password.';
          return;
        }

        // Login success
        localStorage.setItem('token', 'fake-jwt-token');
        localStorage.setItem('role', user.role);
        this.$router.push(`/${user.role}/dashboard`);
      } catch (error) {
        this.alertMessage = 'Server error. Please try again later.';
        console.error(error);
      }
    }
  }
};
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

/* Body Background */
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
}

/* Login page container with background */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ensures the login form is vertically centered */
  background: url('https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-business-simple-exhibition-board-jobs-image_22339.jpg') no-repeat center center fixed;
  background-size: cover;
  background-attachment: fixed;
}

/* Auth box styling */
.auth-box {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9); /* Slight transparency to make the background visible */
  border-radius: 15px;
}

/* Logo styling */
.logo-img {
  height: 80px;
}

/* Focused input field styling */
input.form-control:focus,
select.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  transition: all 0.3s ease;
}

/* Button styling */
button {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
