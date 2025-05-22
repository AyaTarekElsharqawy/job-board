<template>
  <div class="container">
    <h2 class="text-center mb-4">Post a new job</h2>
    <div class="card shadow p-4">
      <form @submit.prevent="submitJob">
        <div class="row g-3">
          <div class="col-md-6">
            <div>
              <label for="title" class="form-label">Job Title</label>
              <input type="text" id="title" v-model="job.title" class="form-control"  />
            </div>
            <div v-if="errors.title" class="text-danger">
              <p>
                {{ errors.title }}
              </p>
            </div>
            <div v-if="success.title" class="text-success">
              <p>
                {{ success.title }}
                </p>
            </div>
          </div>
          <div class="col-md-6">
            <div>
              <label for="salary" class="form-label">Job Salary</label>
              <input type="text" id="salary" v-model="job.salary" class="form-control" />
            </div>
            <div v-if="errors.salary" class="text-danger">
              {{ errors.salary }}
            </div>
            <div v-if="success.salary" class="text-success">
              {{ success.salary }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="deadline" class="form-label">Application Deadline</label>
              <input type="date" id="deadline" v-model="job.deadline" class="form-control" />
            </div>
            <div v-if="errors.deadline" class="text-danger">
              {{ errors.deadline }}
            </div>
            <div v-if="success.deadline" class="text-success">
              {{ success.deadline }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="experience_level" class="form-label">Experience Level</label>
              <select id="experience_level" v-model="job.experience_level" class="form-select">
                <option disabled value="">Select experience level</option>
                <option>Entry-level</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Lead</option>
                <option>Executive</option>
              </select>
            </div>
            <div v-if="errors.experience_level" class="text-danger">
              {{ errors.experience_level }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="description" class="form-label">Job Description</label>
              <textarea id="description" v-model="job.description" class="form-control" rows="3"></textarea>
            </div>
            <div v-if="errors.description" class="text-danger">
              {{ errors.description }}
            </div>
            <div v-if="success.description" class="text-success">
              {{ success.description }}
            </div>
          </div>
          <div class="col-md-6">
            <div>
              <label for="responsibilities" class="form-label">Job Responsibilities</label>
              <textarea id="responsibilities" v-model="job.responsibilities" class="form-control" rows="3"></textarea>
            </div>
            <div v-if="errors.responsibilities" class="text-danger">
              {{ errors.responsibilities }}
            </div>
            <div v-if="success.responsibilities" class="text-success">
              {{ success.responsibilities }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="requirements" class="form-label">Job Requirements</label>
              <textarea id="requirements" v-model="job.requirements" class="form-control" rows="3"></textarea>
            </div>
            <div v-if="errors.requirements" class="text-danger">
              {{ errors.requirements }}
            </div>
            <div v-if="success.requirements" class="text-success">
              {{ success.requirements }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="skills" class="form-label">Required Skills</label>
              <textarea id="skills" v-model="job.skills" class="form-control" rows="3"></textarea>
            </div>
            <div v-if="errors.skills" class="text-danger">
              {{ errors.skills }}
            </div>
            <div v-if="success.skills" class="text-success">
              {{ success.skills }}
            </div>
          </div>

          <div class="col-12">
            <div>
              <label for="benefits" class="form-label">Job Benefits</label>
              <textarea id="benefits" v-model="job.benefits" class="form-control" rows="3"></textarea>
            </div>
            <div v-if="errors.benefits" class="text-danger">
              {{ errors.benefits }}
            </div>
            <div v-if="success.benefits" class="text-success">
              {{ success.benefits }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="location" class="form-label">Job Location</label>
              <input type="text" id="location" v-model="job.location" class="form-control" />
            </div>
            <div v-if="errors.location" class="text-danger">
              {{ errors.location }}
            </div>
            <div v-if="success.location" class="text-success">
              {{ success.location }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="work_type" class="form-label">Work Type</label>
              <select id="work_type" v-model="job.work_type" class="form-select">
              <option disabled value="">Select a job type</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
            </div>
            <div v-if="errors.work_type" class="text-danger">
              {{ errors.work_type }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="technologies" class="form-label">Technologies</label>
              <input type="text" id="technologies" v-model="job.technologies" class="form-control" />
            </div>
            <div v-if="errors.technologies" class="text-danger">
              {{ errors.technologies }}
            </div>
            <div v-if="success.technologies" class="text-success">
              {{ success.technologies }}
            </div>
          </div>

          <div class="col-md-6">
            <div>
              <label for="category_id" class="form-label">Job Category</label>
              <select id="category_id" v-model="job.category_id" class="form-select">
              <option disabled value="">Select a category_id</option>
              <option 
                v-for="category_id in categories" 
                :key="category_id.id" 
                :value="category_id.id"
              >
                {{ category_id.name }}
              </option>
            </select>
            </div>
            <div v-if="errors.category_id" class="text-danger">
              {{ errors.category_id }}
            </div> 
          </div>

          <div class="col-12  mt-3">
            <button type="submit" class="btn px-5" style="background-color: #047fec; color: white;">Post Job</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { onMounted } from 'vue';
const errors = reactive({
  title: '',
  salary: '',
  deadline: '',
  experience_level: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: '',
  benefits: '',
  location: '',
  work_type: '',
  technologies: '',
  category_id: ''
});
const success = reactive({
  title: '',
  salary: '',
  deadline: '',
  experience_level: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: '',
  benefits: '',
  location: '',
  work_type: '',
  technologies: '',
  category_id: ''
});
const job = reactive({
  title: '',
  salary: '',
  deadline: '',
  experience_level: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: '',
  benefits: '',
  location: '',
  work_type: '',
  technologies: '',
  category_id: ''
});
const salaryRegex = /^(1000|[1-9]\d{3,8}|10{9})$/;
const categories = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/categories');
    console.log(response.data);
    categories.value = response.data.data;
    console.log(categories.value);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
})
const submitJob = () => {
  if(!job.title) {
    errors.title = 'Job title is required'
  } else if (job.title && job.title.length < 15) {
    errors.title = 'Job title must be at least 15 characters'
  }else {
    errors.title = ''
    success.title = 'Job title is valid'
  }

  if(!job.salary) {
    errors.salary = 'Job salary is required'
  } else if (job.salary && !salaryRegex.test(job.salary)) {
    errors.salary = 'Job salary must be a valid number which is at least 1000 and at most 1000000000'
  } else {
    errors.salary = ''
    success.salary = 'Job salary is valid'
  }

  if(!job.deadline) {
    errors.deadline = 'Application deadline is required'
  } else {
    const today = new Date();
    const deadlineDate = new Date(job.deadline);
    if(deadlineDate <= today) {
      errors.deadline = 'Deadline must be a future date'
    } else {
      errors.deadline = ''
      success.deadline = 'Deadline is valid'
    }
  }

  if(!job.experience_level) {
    errors.experience_level = 'Experience level is required'
  } else {
    errors.experience_level = ''
  }

  if(!job.description) {
    errors.description = 'Job description is required'
  } else if(job.description && job.description.length < 50) {
    errors.description = 'Job description must be at least 50 characters'
  } else {
    errors.description = ''
    success.description = 'Job description is valid'
  }

  if(!job.responsibilities) {
    errors.responsibilities = 'Job responsibilities are required'
  } else if(job.responsibilities && job.responsibilities.length < 50) {
    errors.responsibilities = 'Job responsibilities must be at least 50 characters'
  } else {
    errors.responsibilities = ''
    success.responsibilities = 'Job responsibilities are valid'
  }

  if(!job.requirements) {
    errors.requirements = 'Job requirements are required'
  }else if(job.requirements && job.requirements.length < 50) {
    errors.requirements = 'Job requirements must be at least 50 characters'
  } else {
    errors.requirements = ''
    success.requirements = 'Job requirements are valid'
  }

  if(!job.skills) {
    errors.skills = 'Required skills are required'
  } else if(job.skills && job.skills.length < 10) {
    errors.skills = 'Skills must be at least 10 characters'
  } else {
    errors.skills = ''
    success.skills = 'Skills are valid'
  }

  if(!job.benefits) {
    errors.benefits = 'Job benefits are required'
  } else if(job.benefits && job.benefits.length < 50) {
    errors.benefits = 'Job benefits must be at least 50 characters'
  } else {
    errors.benefits = ''
    success.benefits = 'Job benefits are valid'
  } 

  if(!job.location) {
    errors.location = 'Job location is required'
  }else if(job.location && job.location.length < 2) {
    errors.location = 'Job location must be at least 2 characters'
  } else {
    errors.location = ''
    success.location = 'Job location is valid'
  }

  if(!job.work_type) {
    errors.work_type = 'Work type is required'
  } else {
    errors.work_type = ''
  } 

  if(!job.technologies) {
    errors.technologies = 'Job technologies are required'
  }else {
    errors.technologies = ''
    success.technologies = 'Job technologies are valid'
  }

  if(!job.category_id) {
    errors.category_id = 'Job category is required'
  } else {
    errors.category_id = ''
  }

  job.salary = Number(job.salary)
  
  if(Object.values(errors).every(error => error === '')) {
    console.log(job);
    axios.post('http://localhost:8000/api/jobs', 
      job,  
      {
        headers: { 
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    .then(response => {
      console.log(response);
      alert('Job posted successfully')
      job.title = ''
      job.salary = ''
      job.deadline = ''
      job.experience_level = ''
      job.description = ''
      job.responsibilities = ''
      job.requirements = ''
      job.skills = ''
      job.benefits = ''
      job.location = ''
      job.work_type = ''
      job.technologies = ''
      job.category_id = ''
      errors.title = ''
      errors.salary = ''
      errors.deadline = ''
      errors.experience_level = ''
      errors.description = ''
      errors.responsibilities = ''
      errors.requirements = ''
      errors.skills = ''
      errors.benefits = ''
      errors.location = ''
      errors.work_type = ''
      errors.technologies = ''
      errors.category_id = ''
      success.title = ''
      success.salary = ''
      success.deadline = ''
      success.experience_level = ''
      success.description = ''
      success.responsibilities = ''
      success.requirements = ''
      success.skills = ''
      success.benefits = ''
      success.location = ''
      success.work_type = ''
      success.technologies = ''
      success.category_id = ''
    })
    .catch(error => {
      console.error('Error posting job:', error);
      alert('Failed to post job');
    });
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>