<template>
    <div class="bg-gray-100 font-sans min-h-screen">
      <!-- Employer Profile Section -->
      <section class="profile">
        <div class="container">
              <div class="main-content">
                <div class="dashboard-block p-6 bg-white rounded-lg shadow">
                  <div class="space-y-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Company Profile</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p class="text-gray-500">Company Name</p>
                        <p class="text-gray-800 font-medium">{{ employer.company_name }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Email</p>
                        <p class="text-gray-800 font-medium">{{ employer.user.email }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Bio</p>
                        <p class="text-gray-800 font-medium">{{ employer.bio || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Website</p>
                        <a :href="employer.company_website" class="text-blue-600 hover:underline" target="_blank">
                          {{ employer.company_website || 'N/A' }}
                        </a>
                      </div>
                    </div>
                  </div>
                  <!-- Optional edit button or other actions -->
                </div>
              </div>
            </div>

      </section>
    </div>
  </template>
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        employer: {
          company_name: '',
          company_website: '',
          company_logo: '',
          bio: '',
          user_id: '',
          created_at: '',
          updated_at: '',
          user: {

          }
        },

      };
    },
    mounted() {
      axios
        .get('http://localhost:8000/api/employer-profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          this.employer = response.data.data;
          console.log(this.employer)
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
        });
    },
    methods: {
      logout() {
        // Add your logout logic here
        console.log("Logging out...");
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://cdn.lineicons.com/3.0/lineicons.css');
  
  :root {
    --primary-color: #00a0e1;
    --primary-hover: #0088c7;
    --secondary-color: #f8f9fa;
    --text-color: #333333;
    --light-text: #777777;
    --border-color: #eaeaea;
    --success-color: #4caf50;
    --warning-color: #ff9800;
    --danger-color: #f44336;
    --bg-color: #f5f7fa;
  }
  
  body {
    background-color: var(--bg-color);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .profile {
    padding: 30px 0;
    background-color: var(--bg-color);
  }
  
  .dashboard-sidebar {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-bottom: 30px;
    border: 1px solid var(--border-color);
    transition: box-shadow 0.3s;
  }
  
  .dashboard-sidebar:hover {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }
  
  .user-image {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 20px;
  }
  
  .user-image img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 3px solid var(--border-color);
    transition: all 0.3s;
  }
  
  .user-image img:hover {
    border-color: var(--primary-color);
    transform: rotate(5deg);
  }
  
  .user-image .name {
    font-size: 18px;
    margin-bottom: 5px;
    color: var(--text-color);
    font-weight: 600;
  }
  
  .user-image .title,
  .user-image .email {
    color: var(--light-text);
    font-size: 14px;
  }
  
  .dashboard-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .dashboard-menu li {
    margin-bottom: 5px;
  }
  
  .dashboard-menu li a {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    color: var(--text-color);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 14px;
  }
  
  .dashboard-menu li a:hover {
    background: rgba(0, 160, 225, 0.1);
    color: var(--primary-hover);
    transform: translateX(5px);
  }
  
  .dashboard-menu li.active a {
    background: var(--primary-color);
    color: white;
    font-weight: 500;
  }
  
  .dashboard-menu li a i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
    font-size: 16px;
  }
  
  .dashboard-block {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    padding: 25px;
    margin-bottom: 30px;
    border: 1px solid var(--border-color);
    transition: all 0.3s;
  }
  
  .dashboard-block:hover {
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
  }
  
  .block-title {
    font-size: 18px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-color);
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  
  .block-title i {
    margin-right: 10px;
    color: var(--primary-color);
  }
  
  .bg-gray-50 {
    background-color: #f9fafb;
  }
  
  .bg-blue-700 {
    background-color: #1d4ed8;
  }
  
  .bg-blue-800 {
    background-color: #1e40af;
  }
  
  .bg-green-600 {
    background-color: #16a34a;
  }
  
  .bg-green-700 {
    background-color: #15803d;
  }
  
  .bg-red-600 {
    background-color: #dc2626;
  }
  
  .bg-red-700 {
    background-color: #b91c1c;
  }
  
  .text-white {
    color: white;
  }
  
  .rounded-lg {
    border-radius: 8px;
  }
  
  .px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .transition {
    transition: all 0.3s;
  }
  
  .flex {
    display: flex;
  }
  
  .items-center {
    align-items: center;
  }
  
  .space-x-2 > :not(:last-child) {
    margin-right: 0.5rem;
  }
  
  .mr-2 {
    margin-right: 0.5rem;
  }
  
  .ml-2 {
    margin-left: 0.5rem;
  }
  
  .grid {
    display: grid;
  }
  
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
  
  .md\:grid-cols-2 {
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .gap-6 {
    gap: 1.5rem;
  }
  
  .text-gray-700 {
    color: #374151;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .border {
    border-width: 1px;
  }
  
  .border-gray-300 {
    border-color: #d1d5db;
  }
  
  .focus\:ring-2:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  .focus\:ring-blue-500:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  .focus\:border-blue-500:focus {
    border-color: #3b82f6;
  }
  
  .justify-end {
    justify-content: flex-end;
  }
  
  .space-x-4 > :not(:last-child) {
    margin-right: 1rem;
  }
  
  .btn-cancel {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s;
    border: 1px solid var(--border-color);
    color: white;
  }
  
  .space-y-8 > :not(:last-child) {
    margin-bottom: 2rem;
  }
  
  .text-gray-500 {
    color: var(--light-text);
  }
  
  .text-gray-800 {
    color: var(--text-color);
  }
  
  .font-medium {
    font-weight: 500;
  }
  
  .text-blue-600 {
    color: var(--primary-color);
  }
  
  .hover\:underline:hover {
    text-decoration: underline;
  }
  
  .status-label {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    display: inline-block;
    font-weight: 500;
  }
  
  .status-pending {
    color: var(--warning-color);
    background: rgba(255, 152, 0, 0.1);
  }
  
  .status-viewed {
    color: var(--primary-color);
    background: rgba(0, 160, 225, 0.1);
  }
  
  .status-accepted {
    color: var(--success-color);
    background: rgba(76, 175, 80, 0.1);
  }
  
  .font-bold {
    font-weight: 700;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .mt-1 {
    margin-top: 0.25rem;
  }
  
  .mt-2 {
    margin-top: 0.5rem;
  }
  
  .text-gray-600 {
    color: #4b5563;
  }
  
  .border-b {
    border-bottom-width: 1px;
  }
  
  .border-gray-200 {
    border-color: #e5e7eb;
  }
  
  .pb-6 {
    padding-bottom: 1.5rem;
  }
  
  .last\:border-b-0:last-child {
    border-bottom-width: 0;
  }
  
  .last\:pb-0:last-child {
    padding-bottom: 0;
  }
  
  .flex-wrap {
    flex-wrap: wrap;
  }
  
  .gap-2 {
    gap: 0.5rem;
  }
  
  @media (max-width: 768px) {
    .dashboard-sidebar {
      margin-bottom: 20px;
    }
  }
  </style>