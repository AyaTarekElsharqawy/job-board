
  <template>
    <div class="login-container">
      <div class="login-card">
        <div class="logo-container">
          <img src="https://egyprojects.info/wp-content/webp-express/webp-images/uploads/2020/12/2020-12-26_011735.png.webp" 
               alt="Job Logo" 
               class="logo">
        </div>
        
        <h1 class="title">Find Your Dream Job</h1>
        
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <input
              type="email"
              class="form-input"
              placeholder="Email Address"
              v-model="email"
              required
              :class="{ 'input-error': error }"
            />
          </div>
          
          <div class="form-group">
            <input
              type="password"
              class="form-input"
              placeholder="Password"
              v-model="password"
              required
              :class="{ 'input-error': error }"
            />
          </div>
          
          <p class="error-message" v-if="error">{{ error }}</p>
          
          <button type="submit" class="login-button">
            Login
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="icon">
              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from '../../../axios';  
  import router from '../../router';
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  
  const login = async () => {
    error.value = '';
    try {
      const response = await axios.post('/api/login', {
        email: email.value,
        password: password.value
      });
  
      localStorage.setItem('token', response.data.token);
      
      router.push('/dashboard');
    } catch (err) {
      error.value = 'Invalid email or password'; 
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #00bcd4;
    background-image: linear-gradient(135deg, #00bcd4, #0097a7);
    padding: 20px;
  }
  
  .login-card {
    background: white;
    border-radius: 12px;
    padding: 40px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .logo-container {
    margin-bottom: 20px;
  }
  
  .logo {
    width: 120px;
    height: auto;
  }
  
  .title {
    color: #2a3f54;
    font-size: 24px;
    margin-bottom: 30px;
    font-weight: 600;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    text-align: left;
  }
  
  .form-input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e0e6f1;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;
  }
  
  .form-input:focus {
    border-color: #00bcd4;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.2);
  }
  
  .input-error {
    border-color: #ff5252;
  }
  
  .error-message {
    color: #ff5252;
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: left;
  }
  
  .login-button {
    background-color: #2a3f54;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s;
  }
  
  .login-button:hover {
    background-color: #1e2e3f;
    transform: translateY(-2px);
  }
  
  .icon {
    transition: transform 0.3s;
  }
  
  .login-button:hover .icon {
    transform: translateX(3px);
  }
  
  @media (max-width: 480px) {
    .login-card {
      padding: 30px 20px;
    }
    
    .title {
      font-size: 20px;
    }
  }
  </style>