<template>
  <div class="login-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-box shadow-lg rounded-4 p-5 bg-white animate__animated animate__fadeIn">

     
      <div class="text-center mb-4">
        <img
          height="80px"
          src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/JobBoardLogo.png"
          alt="jobDev Logo"
          class="logo-img mb-2"
        />
        <h3 class="fw-bold text-primary">Welcome to job Board</h3>
      </div>

    
      <div v-if="alertMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ alertMessage }}
        <button type="button" class="btn-close" @click="alertMessage = null" aria-label="Close"></button>
      </div>

     
      <AuthForm :isLogin="true" :onSubmit="loginUser" />

     
      <div class="text-center mt-4">
        <span>Don't have an account?</span>
        <router-link to="/register" class="btn btn-outline-primary btn-sm ms-2">Create Account</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
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
        const response = await axios.post('http://localhost:8000/api/login', {
          email,
          password
        });

        const { token, user } = response.data;

        // Save token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);

        // Redirect to appropriate dashboard
        this.$router.push(`/${user.role}/dashboard`);
      } catch (error) {
        if (error.response && error.response.data.message) {
          this.alertMessage = error.response.data.message;
        } else {
          this.alertMessage = 'Server error. Please try again later.';
        }
        console.error(error);
      }
    }
  }
};
</script>