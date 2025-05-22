<template>
    <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light">
      <div>
        <h1 class="display-1 fw-bold text-danger">404</h1>
        <p class="fs-3">
          <span class="text-danger">Oops!</span> Page not found.
        </p>
        <p class="lead">The page you’re looking for doesn’t exist or has been moved.</p>
        <button class="btn btn-primary mt-3" @click="goHome">Go Home</button>
      </div>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
router.push({ path: '/' }) 
}
</script>

<style scoped>

</style>  