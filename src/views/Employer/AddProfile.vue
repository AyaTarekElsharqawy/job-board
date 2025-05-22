    <template>
        <div class="container">
        <h2 class="text-center mb-4">Complete your profile</h2>
        <div class="card shadow p-4">
            <form @submit.prevent="submitJob">
            <div class="row g-3">
                <div class="col-md-12 alert alert-danger text-center" v-if="errorMessage">
                    {{ errorMessage }}
                </div>
                <div class="col-md-12 alert alert-success text-center" v-if="successMessage">
                    {{ successMessage }}
                </div>
                <div class="col-md-6">
                <label for="company_name" class="form-label">Company Name</label>
                <input type="text" id="company_name" v-model="profile.company_name" class="form-control" />
                <div v-if="errors.company_name" class="text-danger">{{ errors.company_name }}</div>
                </div>

                <div class="col-md-6">
                <label for="company_website" class="form-label">Company Website</label>
                <input type="text" id="company_website" v-model="profile.company_website" class="form-control" placeholder="https://example.com"/>
                <div v-if="errors.company_website" class="text-danger">{{ errors.company_website }}</div>
                </div>

                <div class="col-12">
                <label for="bio" class="form-label">Company Bio</label>
                <textarea id="bio" v-model="profile.bio" class="form-control" rows="3"></textarea>
                <div v-if="errors.bio" class="text-danger">{{ errors.bio }}</div>
                </div>

                <div class="col-12">
                <label for="company_logo" class="form-label">Company Logo</label>
                <input type="file" id="company_logo" @change="handleFileUpload" class="form-control" />
                <div v-if="errors.company_logo" class="text-danger">{{ errors.company_logo }}</div>
                </div>

                <div class="col-12">
                    <button type="submit" class="btn btn-primary">Add Profile</button>
                </div>
            </div>
            </form>
        </div>
        </div>
    </template>
    
    <script setup>
    import { reactive, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import { onMounted } from 'vue';
    const successMessage = ref('');
    const errorMessage = ref('');
    const router = useRouter();
    const errors = reactive({
        company_name: '',
        company_website: '',
        bio: '',
        company_logo: ''
    });
    const success = reactive({
        company_logo: '',
        company_website: '',
        company_name: '',
        bio: ''
    });
    const profile = reactive({
        company_name: '',
        company_website: '',
        bio: '',
        company_logo: null,
    });
    
    const handleFileUpload = (event) => {
        profile.company_logo = event.target.files[0];
    };

    const urlRegex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

    const submitJob = async () => {
        // Basic validation
        errors.company_name = profile.company_name ? '' : 'Company name is required';
        if (!profile.company_website) {
            errors.company_website = 'Company website is required';
        } else if (profile.company_website && !urlRegex.test(profile.company_website)) {
            errors.company_website = 'Enter a valid website URL (e.g. https://example.com)';
        } else {
            errors.company_website = '';
            success.company_website = 'Company website is valid';
        }
        errors.bio = profile.bio ? '' : 'Bio is required';
        errors.company_logo = profile.company_logo ? '' : 'Company logo is required';

        if (
            errors.company_name === '' &&
            errors.company_website === '' &&
            errors.bio === '' &&
            errors.company_logo === ''
        ) {
            const formData = new FormData();
            formData.append('company_name', profile.company_name);
            formData.append('company_website', profile.company_website);
            formData.append('bio', profile.bio);
            formData.append('company_logo', profile.company_logo);

            try {
            const response = await axios.post('http://localhost:8000/api/employer-profile', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            console.log('Employer profile created:', response.data);
            successMessage.value = 'Employer profile created successfully';
            profile.company_name = '';
            profile.company_website = '';
            profile.bio = '';
            profile.company_logo = null;
            router.push({ path: '/employer' });

            } catch (error) {
            console.error('Failed to create employer profile:', error);
            errorMessage.value = 'Failed to create employer profile';
            }
        }
    };
    </script>   
    
    <style scoped>
    .card {
        border-radius: 12px;
    }
    </style>


    