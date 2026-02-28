<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { videoApi } from '@/api/videohost'

export default defineComponent({
  name: 'UploadView',
  setup() { return { router: useRouter() } },
  data() {
    return {
      title: '', description: '',
      videoFile: null as File | null,
      thumbnailFile: null as File | null,
      videoPreview: null as string | null,
      thumbnailPreview: null as string | null,
      isPublic: true, uploading: false,
      error: null as string | null, success: false,
    }
  },
  methods: {
    onVideoChange(e: Event) {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) { this.videoFile = file; this.videoPreview = URL.createObjectURL(file) }
    },
    onThumbnailChange(e: Event) {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) { this.thumbnailFile = file; this.thumbnailPreview = URL.createObjectURL(file) }
    },
    async handleSubmit() {
      if (!this.videoFile) { this.error = 'Выберите видео файл'; return }
      this.uploading = true; this.error = null
      const formData = new FormData()
      formData.append('title', this.title)
      formData.append('description', this.description)
      formData.append('video', this.videoFile)
      formData.append('is_public', String(this.isPublic))
      if (this.thumbnailFile) formData.append('thumbnail', this.thumbnailFile)
      try {
        const response = await videoApi.uploadVideo(formData)
        this.success = true
        setTimeout(() => { this.router.push({ name: 'video', params: { id: response.data.video.id } }) }, 1500)
      } catch (e: any) {
        const errors = e.response?.data?.errors
        this.error = errors ? Object.values(errors).flat().join('\n') : e.response?.data?.message || 'Ошибка загрузки видео'
      } finally { this.uploading = false }
    },
  },
})
</script>

<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card glass border-0" style="border-radius:24px;">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <i class="bi bi-cloud-upload display-4" style="color:var(--primary);"></i>
              <h2 class="fw-bold mt-3 mb-2">Загрузка видео</h2>
              <p class="text-muted">Поделитесь своим творением с миром</p>
            </div>
            <div v-if="success" class="alert alert-success text-center"><i class="bi bi-check-circle me-2"></i>Видео успешно загружено! Перенаправление...</div>
            <div v-if="error" class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>{{ error }}</div>
            <form @submit.prevent="handleSubmit">
              <div v-if="videoPreview" class="mb-4">
                <div class="ratio ratio-16x9 rounded-4 overflow-hidden" style="border:2px solid var(--border-color);">
                  <video :src="videoPreview" controls></video>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold"><i class="bi bi-camera-video me-2" style="color:var(--primary);"></i>Видео файл *</label>
                <div class="text-center p-5" style="border:2px dashed var(--border-color);border-radius:16px;background:var(--bg-card);">
                  <input type="file" class="form-control" accept="video/*" @change="onVideoChange" required style="max-width:300px;margin:0 auto;"/>
                  <p class="text-muted small mt-3 mb-0">MP4, MOV, AVI, WMV, FLV, MKV (макс. 1GB)</p>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold"><i class="bi bi-image me-2" style="color:var(--accent);"></i>Обложка</label>
                <div class="d-flex gap-3 align-items-center">
                  <div v-if="thumbnailPreview" class="position-relative rounded-3 overflow-hidden" style="width:200px;height:112px;border:2px solid var(--border-color);">
                    <img :src="thumbnailPreview" class="w-100 h-100" style="object-fit:cover;" alt="Thumbnail"/>
                  </div>
                  <div v-else class="d-flex align-items-center justify-content-center" style="width:200px;height:112px;border:2px dashed var(--border-color);border-radius:12px;background:var(--bg-card);">
                    <i class="bi bi-image text-muted" style="font-size:2rem;"></i>
                  </div>
                  <div class="flex-grow-1">
                    <input type="file" class="form-control" accept="image/*" @change="onThumbnailChange"/>
                    <p class="text-muted small mt-1 mb-0">JPG, PNG, GIF (макс. 10MB)</p>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="title" class="form-label fw-bold"><i class="bi bi-fonts me-2" style="color:var(--secondary);"></i>Название *</label>
                <input id="title" v-model="title" type="text" class="form-control" placeholder="Введите название видео" required maxlength="255"/>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label fw-bold"><i class="bi bi-card-text me-2" style="color:var(--secondary);"></i>Описание</label>
                <textarea id="description" v-model="description" class="form-control" rows="4" placeholder="Расскажите о вашем видео..." maxlength="1000"></textarea>
              </div>
              <div class="mb-4 p-3 rounded-3" style="background:var(--bg-card);border:1px solid var(--border-color);">
                <div class="form-check form-switch">
                  <input id="isPublic" v-model="isPublic" class="form-check-input" type="checkbox" style="width:3em;height:1.5em;"/>
                  <label class="form-check-label fw-bold" for="isPublic"><i class="bi bi-eye me-2" style="color:var(--accent);"></i>Публичное видео</label>
                </div>
                <small class="text-muted">Публичные видео могут видеть все пользователи</small>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg py-3" :disabled="uploading || !videoFile" style="border-radius:12px;font-size:1.1rem;">
                  <span v-if="!uploading"><i class="bi bi-cloud-upload me-2"></i>Загрузить видео</span>
                  <span v-else><span class="spinner-border spinner-border-sm me-2" role="status"></span>Загрузка...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
