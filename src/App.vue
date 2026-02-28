<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from '@/components/Navbar.vue'

export default defineComponent({
  name: 'App',
  components: { Navbar },
})
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Navbar />
    <main class="flex-grow-1">
      <router-view />
    </main>
    <footer>
      <div class="container text-center">
        <div class="mb-3">
          <router-link to="/" class="text-decoration-none">
            <span class="text-gradient" style="font-size:1.5rem;font-weight:700;">
              <i class="bi bi-camera-video-fill me-2"></i>VideoHost
            </span>
          </router-link>
        </div>
        <p class="mb-2" style="color:var(--text-secondary);opacity:0.8;">&copy; 2026 VideoHost. Платформа для ваших видео</p>
      </div>
    </footer>
  </div>
</template>

<style>
#app { min-height: 100vh; }
</style>
