<template>
    <div class="container my-5 main-section">
        <div class="row">
            <SideBar class="col-md-3"></SideBar>
            <router-view class="col-md-9"></router-view>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';  
import SideBar from './SideBar.vue';

</script>

<style>
   
</style>