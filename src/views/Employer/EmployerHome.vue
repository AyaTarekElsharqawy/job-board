<template>
    <div>
        <div class="shadow-md bg-white rounded-lg p-4 mb-4 dashboard">
            <h1 class="">Welcome to Employer Dashboard</h1>
            <p>
                <br>
                Here you can manage your jobs, candidates, and more.
                <br>
            </p>
        </div>
        
    </div>
</template>

<script setup>
    import SideBar from './SideBar.vue';
    import { RouterLink } from 'vue-router';
</script>

<style>
    .dashboard {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
        padding: 25px;
        margin-bottom: 30px;
        border: 1px solid var(--border-color);
        transition: all 0.3s;
    }
    .dashboard h1 {
        color: #343a40;
        font-size: 24px;
        margin-bottom: 20px;
    }
</style>