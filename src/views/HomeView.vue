<script lang="ts">
import { defineComponent } from 'vue'
import { videoApi, type Video } from '@/api/videohost'
import VideoCard from '@/components/VideoCard.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    VideoCard,
  },
  data() {
    return {
      videos: [] as Video[],
      loading: false,
      error: null as string | null,
    }
  },
  mounted() {
    this.fetchVideos()
  },
  methods: {
    async fetchVideos() {
      this.loading = true
      this.error = null
      try {
        const response = await videoApi.getVideos({ per_page: 12 })
        this.videos = response.data.data
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Ошибка загрузки видео'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>

<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="display-5 fw-bold mb-3">
          <i class="bi bi-fire text-danger me-2"></i>
          <span class="text-gradient">Популярные видео</span>
        </h1>
      </div>
    </div>

    <div v-if="loading" class="row justify-content-center py-5">
      <div class="col-auto">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <div v-else-if="videos.length === 0" class="text-center py-5">
      <i class="bi bi-camera-video-off display-1 text-muted"></i>
      <p class="lead text-muted mt-3">Видео пока нет</p>
      <router-link to="/upload" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>
        Загрузить первое видео
      </router-link>
    </div>

    <div v-else class="row g-4">
      <div v-for="video in videos" :key="video.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <VideoCard :video="video" />
      </div>
    </div>
  </div>
</template>
