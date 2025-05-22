<template>
    <div class="payment-success">
      <h1>Thank you for your payment!</h1>
      <router-link to="/employer" class="btn btn-primary">Go to Dashboard</router-link>
      <p>{{ message }}</p>
      
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import axios from 'axios';
  
  const message = ref('Processing your payment...');
  
  onMounted(async () => {
    try {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const jobId = urlParams.get('job_id');
      const applicationId = urlParams.get('application_id');
  
      if (!jobId || !applicationId) {
        message.value = 'Missing required parameters. Please contact support.';
        return;
      }
  
      // Update job status to closed
      await axios.put(`http://localhost:8000/api/jobs/${jobId}`, {
        status: 'closed'
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
  
      // Update application status to accepted
      await axios.put(`http://localhost:8000/api/applications/${applicationId}/status`, {
        status: 'accepted'
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
  
      message.value = 'Payment successful! The job application has been accepted and the job has been closed.';
    } catch (error) {
      console.error('Error updating status:', error);
      message.value = 'Payment was successful, but we failed to update the job status. Please contact support.';
    }
  });
  </script>
  
  <style scoped>
  .payment-success {
    text-align: center;
    padding: 2rem;
  }
  
  h1 {
    color: #28a745;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: #6c757d;
  }
  </style>