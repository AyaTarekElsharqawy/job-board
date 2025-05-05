<template>
  <div class="candidate-profile">
    <div class="profile-header">
      <h2>{{ candidate.name }}'s Profile</h2>
      <p class="email">{{ candidate.email }}</p>
    </div>

    <div class="profile-content">
      <section class="personal-info">
        <h3>Personal Information</h3>
        <div>
          <strong>Full Name:</strong> {{ candidate.name }}
        </div>
        <div>
          <strong>Email:</strong> {{ candidate.email }}
        </div>
        <div>
          <strong>Phone:</strong> {{ candidate.phone }}
        </div>
        <div>
          <strong>Location:</strong> {{ candidate.location }}
        </div>
      </section>

      <section class="experience">
        <h3>Work Experience</h3>
        <div v-for="(job, index) in candidate.experience" :key="index" class="experience-item">
          <strong>{{ job.position }}</strong> at {{ job.company }}
          <p>{{ job.description }}</p>
          <span>{{ job.duration }}</span>
        </div>
      </section>

      <section class="skills">
        <h3>Skills</h3>
        <ul>
          <li v-for="(skill, index) in candidate.skills" :key="index">{{ skill }}</li>
        </ul>
      </section>

      <section class="education">
        <h3>Education</h3>
        <div v-for="(edu, index) in candidate.education" :key="index" class="education-item">
          <strong>{{ edu.degree }}</strong> from {{ edu.institution }}
          <span>{{ edu.year }}</span>
        </div>
      </section>
    </div>

    <div class="actions">
      <button @click="editProfile">Edit Profile</button>
      <button @click="changePassword">Change Password</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CandidateProfile",
  data() {
    return {
      candidate: {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "+1234567890",
        location: "New York, USA",
        experience: [
          {
            position: "Software Engineer",
            company: "Tech Corp",
            description: "Developed innovative software solutions.",
            duration: "2019 - Present"
          },
          {
            position: "Junior Developer",
            company: "Web Solutions",
            description: "Assisted in building and maintaining websites.",
            duration: "2017 - 2019"
          }
        ],
        skills: ["JavaScript", "Vue.js", "Node.js", "HTML", "CSS"],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "XYZ University",
            year: "2017"
          }
        ]
      }
    };
  },
  methods: {
    editProfile() {
      console.log("Edit Profile clicked");
      // Add functionality to edit profile
    },
    changePassword() {
      console.log("Change Password clicked");
      // Add functionality to change password
    }
  }
};
</script>

<style scoped>
.candidate-profile {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-header h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.profile-header .email {
  font-size: 16px;
  color: gray;
}

.profile-content {
  margin-top: 20px;
}

section {
  margin-bottom: 30px;
}

section h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

section div, section ul {
  margin-left: 20px;
}

section .experience-item, section .education-item {
  margin-bottom: 10px;
}

.actions {
  text-align: center;
  margin-top: 20px;
}

.actions button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
}

.actions button:hover {
  background-color: #45a049;
}
</style>
