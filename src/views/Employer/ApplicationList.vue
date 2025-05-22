<template>
  <div class="container">
    <h2 class="text-center mb-4">Job Applications</h2>

    <div v-if="applications.length" class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Applicant Name</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(app, index) in applications" :key="app.id">
            <td>{{ getGlobalIndex(index) }}</td>
            <td>{{ app.user.name }}</td>
            <td>{{ app.user.email }}</td>
            <td>{{ app.job.title }}</td>
            <td>
              <a v-if="app.resume_snapshot" :href="getResumeUrl(app.resume_snapshot)" target="_blank" download>
                View Resume
              </a>
              <span v-else class="text-muted">No resume</span>
            </td>
            <td>
              <span class="badge"
                    :class="{
                      'bg-warning text-dark': app.status === 'pending',
                      'bg-success': app.status === 'accepted',
                      'bg-danger': app.status === 'rejected'
                    }">
                {{ app.status }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-success me-2" 
                      @click="handleCheckout(app.job.id, app.job.salary * 0.15, app.id)"
                      :disabled="['accepted'].includes(app.status)"

              >
                Accept  
              </button>
              <!-- <PaymentButton 
              :jobId="app.job.id" 
              :amount="app.job.salary * 0.15" 
               
              @click="updateStatus(app.id, 'accepted')"
              :disabled="['accepted'].includes(app.status)"
              >
              
              </PaymentButton> -->
              <button class="btn btn-sm btn-outline-danger"
                      :disabled="['rejected'].includes(app.status)"
                      data-bs-toggle="modal" :data-bs-target="'#rejectModal' + app.id"> 
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
          </li>
          <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === lastPage }">
            <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>

    <div v-else class="text-center">
      <p>No applications received yet.</p>
    </div>

    <!-- Modals -->
    <div v-for="app in applications" :key="'modal-' + app.id">
      <div class="modal fade" :id="'rejectModal' + app.id" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reject Job</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to reject this job?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-danger" @click="updateStatus(app.id, 'rejected')" data-bs-dismiss="modal">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import PaymentButton from '@/components/Employer/PaymentButton.vue';
import { loadStripe } from '@stripe/stripe-js';
// import { getGlobalIndex} from 'vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf';

const router = useRouter();
const userRole = localStorage.getItem('role')
const applications = ref([])
const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(10)
const totalApplications = ref(0)

const currUser = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')

if (!currUser) {
  router.push('/login');
}
if (localStorage.getItem('role') !== 'employer') {
  router.push({ path: '/' });
}
if (currUser.role !== 'employer') {
  router.push({ path: '/' })
}

onMounted(() => {
  fetchApplications()
})

async function fetchApps() {
  try {
    const response = await axios.get(`http://localhost:8000/api/employer/applications/${currUser.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.message === 'No applications found for this employer.') {
      applications.value = [];
    } else {
      applications.value = response.data.data; // pagination: data موجودة جوا key اسمه data
    }

  } catch (error) {
    console.error('Error fetching applications:', error);
  }
}

async function updateStatus(id, newStatus) {
  try {
    await axios.put(`http://localhost:8000/api/applications/${id}/status`, {
      status: newStatus
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    fetchApplications()
  } catch (error) {
    console.error('Failed to update status:', error);
    alert('Failed to update status. Please try again.');
  }
}

async function fetchApplications() {
  try {
    const response = await axios.get(`http://localhost:8000/api/employer/applications/${currUser.id}?page=${currentPage.value}&per_page=${perPage.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data.message === 'No applications found for this employer.') {
      applications.value = []
    } else {
      console.log(response.data.data)
      applications.value = response.data.data
      currentPage.value = response.data.current_page
      lastPage.value = response.data.last_page
      perPage.value = response.data.per_page
      totalApplications.value = response.data.total_applications
    }
  } catch (error) {
    console.error('Error fetching applications:', error)
  }
}

async function handleCheckout(id, amount, application_id) {


  try {
    // Call your Laravel API to create checkout session
    console.log('Creating checkout session for job ID:', id, 'with amount:', amount);
    const response = await axios.post(`/api/stripe/checkout-session/${id}`, { amount, application_id: application_id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    const sessionId = response.data.id;

    // Load Stripe.js with your publishable key from env
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY);

    // Redirect to Stripe Checkout
    await stripe.redirectToCheckout({ sessionId });
  } catch (err) {
    // error.value = err.response?.data?.message || err.message || 'Error during checkout';
    console.error('Error during checkout:', err);
  } finally {
    console.log('Checkout process completed');
  }
}

// Pagination logic
const getGlobalIndex = (i) => (currentPage.value - 1) * perPage.value + i + 1

const goToPage = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page
    fetchApplications()
  }
}

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(lastPage.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function getResumeUrl(filename) {
  return `http://localhost:8000/storage/${filename}`
}
</script>

<style scoped>
table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

thead th {
  background-color: #007bff;
  color: #fff;
  text-align: center;
  vertical-align: middle;
}

tbody td {
  vertical-align: middle;
  text-align: center;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.75em;
  border-radius: 0.75rem;
}

button.btn {
  min-width: 80px;
}

.table td, .table th {
  padding: 1rem;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.modal-title {
  font-weight: bold;
}
</style>
