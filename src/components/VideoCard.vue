<script lang="ts">
import { defineComponent } from 'vue'
import type { Video } from '@/api/videohost'
import { getStorageUrl } from '@/api/index'

export default defineComponent({
  name: 'VideoCard',
  props: {
    video: {
      type: Object as () => Video,
      required: true,
    },
  },
  computed: {
    videoUrl(): string {
      return `/video/${this.video.id}`
    },
    profileUrl(): string {
      return `/profile/${this.video.user?.id}`
    },
    thumbnailUrl(): string | null {
      return getStorageUrl(this.video.thumbnail_path)
    },
    avatarUrl(): string | null {
      return getStorageUrl(this.video.user?.avatar_path || null)
    },
    formattedViews(): string {
      return this.formatNumber(this.video.views)
    },
    formattedLikes(): string {
      return this.formatNumber(this.video.likes_count || 0)
    },
  },
  methods: {
    formatNumber(num: number): string {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    },
  },
})
</script>

<template>
  <div class="video-card h-100">
    <router-link :to="videoUrl" class="text-decoration-none">
      <div class="position-relative">
        <img
          v-if="thumbnailUrl"
          :src="thumbnailUrl"
          class="video-thumbnail"
          :alt="video.title"
        />
        <div 
          v-else 
          class="video-thumbnail d-flex align-items-center justify-content-center"
          style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
        >
          <i class="bi bi-camera-video text-white" style="font-size: 3rem;"></i>
        </div>
        <span
          v-if="video.duration"
          class="position-absolute bottom-0 end-0 bg-dark bg-opacity-75 text-white px-2 py-1 m-2 rounded small"
        >
          {{ video.duration }}
        </span>
      </div>
    </router-link>
    <div class="card-body">
      <h6 class="card-title text-truncate mb-2">
        <router-link :to="videoUrl" class="text-decoration-none">
          {{ video.title }}
        </router-link>
      </h6>
      <div class="d-flex align-items-center mb-2">
        <router-link :to="profileUrl" class="text-decoration-none">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            class="avatar me-2"
            :alt="video.user?.name"
          />
          <i v-else class="bi bi-person-circle me-2 fs-6 text-muted"></i>
        </router-link>
        <router-link :to="profileUrl" class="text-decoration-none text-muted small">
          {{ video.user?.name }}
        </router-link>
      </div>
      <div class="d-flex justify-content-between align-items-center text-muted small">
        <span>
          <i class="bi bi-eye me-1"></i>{{ formattedViews }}
        </span>
        <span>
          <i class="bi bi-heart me-1"></i>{{ formattedLikes }}
        </span>
        <span>
          <i class="bi bi-chat-left me-1"></i>{{ video.comments_count || 0 }}
        </span>
      </div>
    </div>
  </div>
</template>
