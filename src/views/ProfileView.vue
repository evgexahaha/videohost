<script lang="ts">
import { defineComponent } from 'vue'
import { profileApi, subscriptionApi, videoApi, type Video, type User } from '@/api/videohost'
import { getStorageUrl } from '@/api/index'
import { useAuthStore } from '@/stores/auth'
import VideoCard from '@/components/VideoCard.vue'
import UserListModal, { type UserItem } from '@/components/UserListModal.vue'

export default defineComponent({
  name: 'ProfileView',
  components: { VideoCard, UserListModal },
  data() {
    return {
      profileUser: null as User | null,
      videos: [] as Video[],
      isOwnProfile: false,
      editMode: false,
      name: '', bio: '',
      avatarFile: null as File | null,
      avatarPreview: null as string | null,
      currentPassword: '', newPassword: '', newPasswordConfirmation: '',
      loading: false, saving: false,
      error: null as string | null, success: null as string | null,
      showSubscribersModal: false,
      subscribers: [] as UserItem[],
      subscribersLoading: false,
    }
  },
  computed: { authStore() { return useAuthStore() } },
  mounted() { this.fetchProfile() },
  watch: { '$route.params.id'() { this.fetchProfile() } },
  methods: {
    async fetchProfile() {
      this.loading = true; this.error = null
      const userId = this.$route.params.id ? Number(this.$route.params.id) : undefined
      try {
        const response = await profileApi.getProfile(userId)
        this.profileUser = response.data.user
        this.videos = response.data.videos || []
        this.isOwnProfile = !userId || userId === this.authStore.user?.id
        if (this.isOwnProfile && this.profileUser) { this.name = this.profileUser.name; this.bio = this.profileUser.bio || '' }
      } catch (e: any) { this.error = e.response?.data?.message || 'Ошибка загрузки профиля' }
      finally { this.loading = false }
    },
    startEdit() { this.editMode = true; this.error = null; this.success = null },
    cancelEdit() {
      this.editMode = false
      this.name = this.profileUser?.name || ''
      this.bio = this.profileUser?.bio || ''
      this.avatarFile = null; this.avatarPreview = null
      this.currentPassword = ''; this.newPassword = ''; this.newPasswordConfirmation = ''
    },
    onAvatarChange(e: Event) {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) { this.avatarFile = file; this.avatarPreview = URL.createObjectURL(file) }
    },
    async saveProfile() {
      this.saving = true; this.error = null; this.success = null
      const formData = new FormData()
      formData.append('name', this.name); formData.append('bio', this.bio || '')
      if (this.avatarFile) formData.append('avatar', this.avatarFile)
      if (this.newPassword) {
        if (this.newPassword !== this.newPasswordConfirmation) { this.error = 'Пароли не совпадают'; this.saving = false; return }
        formData.append('current_password', this.currentPassword)
        formData.append('password', this.newPassword)
        formData.append('password_confirmation', this.newPasswordConfirmation)
      }
      try {
        const response = await profileApi.updateProfile(formData)
        this.profileUser = response.data.user
        this.authStore.updateUser(response.data.user)
        this.success = 'Профиль успешно обновлен'
        this.editMode = false; this.cancelEdit()
      } catch (e: any) { this.error = e.response?.data?.message || 'Ошибка обновления профиля' }
      finally { this.saving = false }
    },
    formatNumber(num: number) { return num >= 1000000 ? (num/1000000).toFixed(1)+'M' : num >= 1000 ? (num/1000).toFixed(1)+'K' : num.toString() },
    formatDate(ds: string) { return new Date(ds).toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' }) },
    getStorageUrl: getStorageUrl,
    async fetchSubscribers() {
      if (!this.profileUser) return
      this.showSubscribersModal = true; this.subscribersLoading = true
      try { const response = await subscriptionApi.getSubscribers(this.profileUser.id); this.subscribers = response.data.subscribers }
      catch (e: any) { console.error('Ошибка загрузки подписчиков:', e) }
      finally { this.subscribersLoading = false }
    },
  },
})
</script>

<template>
  <div class="container py-4">
    <div v-if="loading" class="row justify-content-center py-5">
      <div class="col-auto"><div class="spinner-border" role="status" style="color:var(--primary);width:3rem;height:3rem;"><span class="visually-hidden">Загрузка...</span></div></div>
    </div>
    <div v-else-if="error" class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>{{ error }}</div>
    <div v-else-if="profileUser" class="row">
      <div class="col-lg-4">
        <div class="card glass border-0 text-center mb-4" style="border-radius:24px;">
          <div class="card-body p-5">
            <div class="position-relative d-inline-block mb-4">
              <div class="rounded-circle d-inline-flex align-items-center justify-content-center" style="width:150px;height:150px;background:var(--bg-card);border:4px solid var(--border-color);overflow:hidden;">
                <img v-if="avatarPreview" :src="avatarPreview" class="w-100 h-100" style="object-fit:cover;" alt="Avatar"/>
                <img v-else-if="profileUser.avatar_path" :src="getStorageUrl(profileUser.avatar_path) || undefined" class="w-100 h-100" style="object-fit:cover;" :alt="profileUser.name"/>
                <i v-else class="bi bi-person-circle" style="font-size:5rem;color:var(--text-muted);"></i>
              </div>
              <label v-if="editMode" for="avatarInput" class="position-absolute bottom-0 end-0 btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style="width:45px;height:45px;border:3px solid var(--bg-dark);cursor:pointer;" title="Загрузить фото">
                <i class="bi bi-camera"></i>
              </label>
              <input id="avatarInput" type="file" class="d-none" accept="image/*" @change="onAvatarChange"/>
            </div>
            <h3 class="h4 fw-bold mb-1" style="color:var(--text-primary);">{{ profileUser.name }}</h3>
            <p class="text-muted mb-3">{{ profileUser.email }}</p>
            <p v-if="profileUser.bio" class="mb-3" style="color:var(--text-secondary);">{{ profileUser.bio }}</p>
            <div class="d-flex justify-content-center gap-4 mb-4">
              <div class="text-center"><div class="fw-bold fs-5" style="color:var(--primary);">{{ videos.length }}</div><small class="text-muted">Видео</small></div>
              <div class="text-center"><div class="fw-bold fs-5" style="color:var(--secondary);">{{ formatNumber(profileUser.total_views||0) }}</div><small class="text-muted">Просмотров</small></div>
              <div class="text-center" style="cursor:pointer;" @click="fetchSubscribers">
                <div class="fw-bold fs-5" style="color:var(--accent);">{{ formatNumber(profileUser.subscribers_count||0) }}</div>
                <small class="text-muted">Подписчиков</small>
              </div>
            </div>
            <small class="text-muted"><i class="bi bi-calendar me-1"></i>На сайте с {{ formatDate(profileUser.created_at) }}</small>
            <hr style="border-color:var(--border-color);" v-if="isOwnProfile"/>
            <div v-if="isOwnProfile" class="d-grid gap-2 mt-3">
              <button v-if="!editMode" class="btn btn-primary" @click="startEdit" style="border-radius:50px;"><i class="bi bi-pencil me-2"></i>Редактировать профиль</button>
              <template v-else>
                <button class="btn btn-success" @click="saveProfile" :disabled="saving" style="border-radius:50px;">
                  <span v-if="!saving"><i class="bi bi-check-lg me-2"></i>Сохранить</span>
                  <span v-else><span class="spinner-border spinner-border-sm me-2" role="status"></span>Сохранение...</span>
                </button>
                <button class="btn btn-outline-secondary" @click="cancelEdit" style="border-radius:50px;"><i class="bi bi-x-lg me-2"></i>Отмена</button>
              </template>
            </div>
          </div>
        </div>
        <div v-if="editMode" class="card glass border-0 mb-4" style="border-radius:24px;">
          <div class="card-body p-4">
            <h5 class="mb-3 fw-bold"><i class="bi bi-sliders me-2" style="color:var(--accent);"></i>Изменить данные</h5>
            <div class="mb-3"><label for="name" class="form-label">Имя</label><input id="name" v-model="name" type="text" class="form-control" required/></div>
            <div class="mb-3"><label for="bio" class="form-label">О себе</label><textarea id="bio" v-model="bio" class="form-control" rows="3" maxlength="1000"></textarea></div>
            <hr style="border-color:var(--border-color);" class="my-4"/>
            <h6 class="mb-3 fw-bold"><i class="bi bi-key me-2" style="color:var(--primary);"></i>Смена пароля</h6>
            <div class="mb-3"><label for="currentPassword" class="form-label">Текущий пароль</label><input id="currentPassword" v-model="currentPassword" type="password" class="form-control"/></div>
            <div class="mb-3"><label for="newPassword" class="form-label">Новый пароль</label><input id="newPassword" v-model="newPassword" type="password" class="form-control" minlength="8"/></div>
            <div class="mb-3"><label for="newPasswordConfirmation" class="form-label">Подтверждение пароля</label><input id="newPasswordConfirmation" v-model="newPasswordConfirmation" type="password" class="form-control" minlength="8"/></div>
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="h4 fw-bold mb-0"><i class="bi bi-collection-play me-2" style="color:var(--gradient-1);"></i>Видео {{ isOwnProfile ? 'мои' : 'пользователя' }}</h3>
          <router-link v-if="isOwnProfile" to="/upload" class="btn btn-primary" style="border-radius:50px;"><i class="bi bi-plus-circle me-2"></i>Загрузить</router-link>
        </div>
        <div v-if="videos.length === 0" class="text-center py-5">
          <i class="bi bi-camera-video-off display-1" style="color:var(--text-muted);"></i>
          <p class="lead text-muted mt-3">{{ isOwnProfile ? 'Вы ещё не загрузили видео' : 'У пользователя нет видео' }}</p>
          <router-link v-if="isOwnProfile" to="/upload" class="btn btn-primary"><i class="bi bi-plus-circle me-2"></i>Загрузить первое видео</router-link>
        </div>
        <div v-else class="row g-4">
          <div v-for="video in videos" :key="video.id" class="col-12 col-sm-6 col-lg-4"><VideoCard :video="video"/></div>
        </div>
      </div>
    </div>
    <div v-if="success" class="position-fixed bottom-0 end-0 m-4">
      <div class="alert alert-success shadow" role="alert" style="border-radius:12px;"><i class="bi bi-check-circle me-2"></i>{{ success }}</div>
    </div>
    <UserListModal v-if="showSubscribersModal" title="Подписчики" :users="subscribers" :loading="subscribersLoading" @close="showSubscribersModal = false"/>
  </div>
</template>
