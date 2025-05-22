
<template>
  <div class="bg-gray-100 font-sans min-h-screen">
    <!-- Applications Section -->
    <section class="dashboard">
      <div class="container">
        <div class="row">
          <!-- Sidebar (Left Side) -->
          <div class="col-lg-3 col-md-4 col-12">
            <Sidebar />
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 col-md-8 col-12">
            <div class="main-content">
              <div class="dashboard-block">
                <div v-if="loading" class="text-center text-muted fs-5 mb-4">Loading applications...</div>
                <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

                <div v-else-if="applications.length === 0" class="text-center text-muted py-5 fs-5">
                  No applications found.
                </div>

                <div v-else class="table-responsive">
                  <h2 class="text-center mb-4">My Applications</h2>
                  <table class="table table-hover align-middle table-bordered table-striped shadow-sm">   
                    <thead class="table-dark">
                      <tr>
                        <th scope="col">Cover Letter</th>
                        <th scope="col">Work Type</th>
                        <th scope="col">Status</th>
                        <th scope="col">Location</th>
                        <th scope="col">Deadline</th>
                        <th scope="col" class="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="application in applications" :key="application.id">
                        <td>{{ application.cover_letter }}</td>
                        <td>{{ application.job.work_type }}</td>
                        <td><span :class="statusClass(application.status)">{{ application.status }}</span></td>
                        <td>{{ application.job.location }}</td>
                        <td>{{ new Date(application.job.deadline).toLocaleDateString() }}</td>
                        <td class="text-center">
                          <div class="d-flex justify-content-center gap-2">
                            <button @click="viewJobDetails(application.job.id)" class="btn btn-sm btn-outline-primary">
                              View
                            </button>
                            <button
                              v-if="application.status.toLowerCase() === 'pending'"
                              @click="openCancelModal(application.id)"
                              class="btn btn-sm btn-outline-danger"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Cancel Confirmation Modal -->
                <div class="modal fade" id="cancelModal" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="cancelModalLabel">Cancel Application</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        Are you sure you want to cancel this application?
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-danger" @click="confirmCancel">Yes, Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap'; // Import Bootstrap Modal
import { useApplicationStore } from '@/stores/applicationStore';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();
const applicationStore = useApplicationStore();

const applications = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedAppId = ref(null);
const cancelModal = ref(null);
let modalInstance = null;
const currentUserId = 'c7a6'; // Ideally, fetch this from auth store

onMounted(async () => {
  loading.value = true;
  try {
    await applicationStore.fetchByCandidate(currentUserId);
    applications.value = applicationStore.applications;
    // Initialize modal after component is mounted
    cancelModal.value = document.getElementById('cancelModal');
    modalInstance = new Modal(cancelModal.value);
  } catch (err) {
    error.value = 'Failed to load applications';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const viewJobDetails = (jobId) => {
  router.push({ name: 'JobDetails', params: { id: jobId } });
};

const openCancelModal = (applicationId) => {
  selectedAppId.value = applicationId;
  modalInstance.show();
};

const confirmCancel = async () => {
  try {
    await applicationStore.deleteApplication(selectedAppId.value);
    applications.value = applications.value.filter(app => app.id !== selectedAppId.value);
    modalInstance.hide();
  } catch (err) {
    error.value = 'Failed to cancel application';
    console.error(err);
  } finally {
    selectedAppId.value = null;
  }
};

const statusClass = (status) => {
  const s = status.toLowerCase();
  if (s === 'accepted') return 'badge bg-success';
  if (s === 'pending') return 'badge bg-warning text-dark';
  if (s === 'rejected') return 'badge bg-danger';
  return 'badge bg-secondary';
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

.dashboard {
  padding: 30px 0;
  background-color: var(--bg-color);
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

.table th,
.table td {
  vertical-align: middle;
}

.table-responsive {
  margin-bottom: 10%;
}

.table-dark {
  background-color: var(--primary-color);
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-block;
  font-weight: 500;
}

.bg-success {
  background-color: var(--success-color);
  color: white;
}

.bg-warning {
  background-color: var(--warning-color);
}

.text-dark {
  color: var(--text-color);
}

.bg-danger {
  background-color: var(--danger-color);
  color: white;
}

.bg-secondary {
  background-color: var(--secondary-color);
  color: var(--text-color);
}

.alert-danger {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--danger-color);
  padding: 15px;
  border-radius: 8px;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--light-text);
}

.fs-5 {
  font-size: 1.25rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-primary:hover {
  background-color: var(--primary-hover);
  color: white;
}

.btn-outline-danger {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.btn-outline-danger:hover {
  background-color: var(--danger-color);
  color: white;
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.gap-2 {
  gap: 0.5rem;
}

.modal-content {
  border-radius: 8px;
}

.modal-header {
  border-bottom: 1px solid var(--border-color);
}

.modal-footer {
  border-top: 1px solid var(--border-color);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: var(--danger-color);
  color: rgb(208, 5, 5);
  border: none;
}

.btn-danger:hover {
  background-color: #aeaaaa;
}
</style>
```