<script lang="ts">
import { defineComponent } from 'vue'
import { videoApi, type Video } from '@/api/videohost'
import VideoCard from '@/components/VideoCard.vue'

export default defineComponent({
  name: 'SearchView',
  components: { VideoCard },
  data() {
    return {
      query: (this.$route.query.q as string) || '',
      videos: [] as Video[],
      loading: false,
      error: null as string | null,
    }
  },
  watch: { '$route.query.q'(newQuery) { this.query = (newQuery as string) || ''; if (this.query) this.fetchVideos() } },
  mounted() { if (this.query) this.fetchVideos() },
  methods: {
    async fetchVideos() {
      this.loading = true; this.error = null
      try { const response = await videoApi.getVideos({ search: this.query, per_page: 12 }); this.videos = response.data.data }
      catch (e: any) { this.error = e.response?.data?.message || 'Ошибка поиска' }
      finally { this.loading = false }
    },
  },
})
</script>

<template>
  <div class="container py-4">
    <div class="mb-4">
      <h2 class="h3 fw-bold mb-2"><i class="bi bi-search me-2" style="color:var(--accent);"></i>Поиск: "<span class="text-gradient">{{ query }}</span>"</h2>
      <p class="text-muted">Найдено: {{ videos.length }} видео</p>
    </div>
    <div v-if="loading" class="row justify-content-center py-5">
      <div class="col-auto"><div class="spinner-border" role="status" style="color:var(--primary);width:3rem;height:3rem;"><span class="visually-hidden">Загрузка...</span></div></div>
    </div>
    <div v-else-if="error" class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>{{ error }}</div>
    <div v-else-if="videos.length === 0" class="text-center py-5">
      <i class="bi bi-search display-1" style="color:var(--text-muted);"></i>
      <p class="lead text-muted mb-3">Ничего не найдено по запросу "{{ query }}"</p>
      <router-link to="/" class="btn btn-primary"><i class="bi bi-house me-2"></i>На главную</router-link>
    </div>
    <div v-else class="row g-4">
      <div v-for="video in videos" :key="video.id" class="col-12 col-sm-6 col-lg-4 col-xl-3"><VideoCard :video="video"/></div>
    </div>
  </div>
</template>
