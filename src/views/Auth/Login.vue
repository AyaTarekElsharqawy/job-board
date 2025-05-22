<template>
  <div class="login-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-box shadow-lg rounded-4 p-5 bg-white animate__animated animate__fadeIn">

     
      <div class="text-center mb-4">
        <img
          src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/JobBoardLogo.png"
          alt="jobDev Logo"
          class="img-fluid"
          style="width: 200px;"
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
        console.log('Login attempt with:', email, password);
        // Validate input
        const response = await axios.post('http://localhost:8000/api/login', {
          email,
          password
        });

        const { token, user } = response.data;

        // Save token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to appropriate dashboard
        if(user.role === 'admin') {
          this.$router.push('/admin/jobs');
        } else if (user.role === 'employer') {
          this.$router.push('/employer');
        } else if (user.role === 'candidate') {
          this.$router.push('/candidate/dashboard');
        } else {
          this.alertMessage = 'Invalid user role.';
          return;
        }
        // this.$router.push(`/${user.role}/dashboard`);
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
<style scoped>
  .login-page {
  background: url('https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-business-simple-exhibition-board-jobs-image_22339.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: 'Segoe UI', sans-serif;
}
</style>