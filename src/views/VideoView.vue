<script lang="ts">
import { defineComponent } from 'vue'
import { videoApi, subscriptionApi, type Video, type Comment } from '@/api/videohost'
import { getStorageUrl } from '@/api/index'
import { useAuthStore } from '@/stores/auth'
import VideoCard from '@/components/VideoCard.vue'
import UserListModal, { type UserItem } from '@/components/UserListModal.vue'

export default defineComponent({
  name: 'VideoView',
  components: { VideoCard, UserListModal },
  data() {
    return {
      video: null as Video | null,
      comments: [] as Comment[],
      newComment: '',
      loading: false,
      error: null as string | null,
      commentLoading: false,
      likeLoading: false,
      subscribeLoading: false,
      isSubscribed: false,
      showLikersModal: false,
      likers: [] as UserItem[],
      likersLoading: false,
    }
  },
  computed: {
    authStore() { return useAuthStore() },
    isAuthenticated() { return this.authStore.isAuthenticated },
    isLiked() { return this.video?.is_liked || false },
    videoUrl() { return getStorageUrl(this.video?.video_path || null) },
    avatarUrl() { return getStorageUrl(this.video?.user?.avatar_path || null) },
  },
  mounted() { this.fetchVideo(); this.fetchComments() },
  methods: {
    getStorageUrl: getStorageUrl,
    async fetchVideo() {
      this.loading = true; this.error = null
      try {
        const response = await videoApi.getVideo(Number(this.$route.params.id))
        this.video = response.data.video
        if (this.isAuthenticated && this.video?.user?.id) this.fetchSubscriptionStatus()
      } catch (e: any) { this.error = e.response?.data?.message || 'Ошибка загрузки видео' }
      finally { this.loading = false }
    },
    async fetchComments() {
      this.commentLoading = true
      try {
        const response = await videoApi.getComments(Number(this.$route.params.id))
        this.comments = response.data.comments
      } catch (e: any) { console.error('Ошибка загрузки комментариев:', e) }
      finally { this.commentLoading = false }
    },
    async toggleLike() {
      if (!this.isAuthenticated) { this.$router.push({ name: 'login' }); return }
      this.likeLoading = true
      try {
        const response = await videoApi.toggleLike(Number(this.$route.params.id))
        if (this.video) { this.video.is_liked = response.data.is_liked; this.video.likes_count = response.data.likes_count }
      } catch (e: any) { console.error('Ошибка лайка:', e) }
      finally { this.likeLoading = false }
    },
    async addComment() {
      if (!this.newComment.trim() || !this.isAuthenticated) return
      try { await videoApi.addComment(Number(this.$route.params.id), this.newComment); this.newComment = ''; await this.fetchComments() }
      catch (e: any) { console.error('Ошибка добавления комментария:', e) }
    },
    async deleteComment(commentId: number) {
      if (!confirm('Удалить комментарий?')) return
      try { await videoApi.deleteComment(commentId); await this.fetchComments() }
      catch (e: any) { console.error('Ошибка удаления комментария:', e) }
    },
    async fetchSubscriptionStatus() {
      if (!this.isAuthenticated || !this.video?.user?.id) return
      try { const response = await subscriptionApi.getStatus(this.video.user.id); this.isSubscribed = response.data.is_subscribed }
      catch (e: any) { console.error('Ошибка получения статуса подписки:', e) }
    },
    async toggleSubscribe() {
      if (!this.isAuthenticated) { this.$router.push({ name: 'login' }); return }
      if (!this.video?.user?.id) return
      this.subscribeLoading = true
      try {
        const response = await subscriptionApi.toggle(this.video.user.id)
        this.isSubscribed = response.data.is_subscribed
        if (this.video.user) (this.video.user as any).subscribers_count = response.data.subscribers_count
      } catch (e: any) { console.error('Ошибка подписки:', e.response?.data?.message || e) }
      finally { this.subscribeLoading = false }
    },
    async fetchLikers() {
      if (!this.video) return
      this.showLikersModal = true; this.likersLoading = true
      try { const response = await videoApi.getVideoLikers(Number(this.$route.params.id)); this.likers = response.data.likers }
      catch (e: any) { console.error('Ошибка загрузки лайкнеров:', e) }
      finally { this.likersLoading = false }
    },
    formatNumber(num: number) { return num >= 1000000 ? (num/1000000).toFixed(1)+'M' : num >= 1000 ? (num/1000).toFixed(1)+'K' : num.toString() },
    formatDate(ds: string) { return new Date(ds).toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' }) },
    share() { const url = window.location.href; navigator.clipboard.writeText(url); alert('Ссылка скопирована!') },
  },
})
</script>

<template>
  <div class="container py-4">
    <div v-if="loading" class="row justify-content-center py-5">
      <div class="col-auto"><div class="spinner-border text-primary" role="status" style="width:3rem;height:3rem;"><span class="visually-hidden">Загрузка...</span></div></div>
    </div>
    <div v-else-if="error" class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>{{ error }}</div>
    <div v-else-if="video" class="row">
      <div class="col-lg-8">
        <div class="card glass border-0 mb-4" style="border-radius:20px;">
          <div class="ratio ratio-16x9" style="background:#000;">
            <video v-if="videoUrl" :src="videoUrl" controls autoplay class="w-100 h-100"></video>
          </div>
        </div>
        <div class="card glass border-0 mb-4" style="border-radius:20px;">
          <div class="card-body p-4">
            <h1 class="h3 fw-bold mb-3" style="color:var(--text-primary);">{{ video.title }}</h1>
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div class="d-flex align-items-center">
                <router-link :to="`/profile/${video.user?.id}`" class="text-decoration-none d-flex align-items-center">
                  <img v-if="avatarUrl" :src="avatarUrl" class="avatar me-3" style="width:50px;height:50px;" :alt="video.user?.name"/>
                  <i v-else class="bi bi-person-circle me-3 fs-3" style="color:var(--text-muted);"></i>
                  <div><div class="fw-bold" style="color:var(--text-primary);">{{ video.user?.name }}</div><small class="text-muted">{{ formatNumber((video.user as any)?.subscribers_count||0) }} подписчиков</small></div>
                </router-link>
                <button v-if="video.user?.id !== authStore.user?.id" class="btn ms-3" :class="isSubscribed?'btn-secondary':'btn-primary'" @click="toggleSubscribe" :disabled="subscribeLoading" style="border-radius:50px;">
                  <span v-if="!subscribeLoading"><i :class="isSubscribed?'bi bi-check-lg':'bi bi-plus'" class="me-1"></i>{{ isSubscribed?'Вы подписаны':'Подписаться' }}</span>
                  <span v-else><span class="spinner-border spinner-border-sm me-1" role="status"></span>...</span>
                </button>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button class="btn" :class="isLiked?'btn-danger':'btn-outline-danger'" @click="toggleLike" :disabled="likeLoading" style="border-radius:50px;padding:0.5rem 1.25rem;">
                  <i :class="isLiked?'bi-heart-fill':'bi-heart'"></i><span class="ms-2" style="cursor:pointer;" @click.stop="fetchLikers" title="Посмотреть кто лайкнул">{{ formatNumber(video.likes_count||0) }}</span>
                </button>
                <button class="btn btn-outline-secondary" style="border-radius:50px;" @click="share"><i class="bi bi-share"></i></button>
                <button class="btn btn-outline-secondary" style="border-radius:50px;"><i class="bi bi-plus"></i></button>
              </div>
            </div>
            <hr style="border-color:var(--border-color);">
            <div class="d-flex gap-3 text-muted small mb-3">
              <span><i class="bi bi-eye me-1" style="color:var(--primary);"></i>{{ formatNumber(video.views) }} просмотров</span>
              <span><i class="bi bi-calendar me-1" style="color:var(--secondary);"></i>{{ formatDate(video.created_at) }}</span>
            </div>
            <p class="text-muted" style="line-height:1.7;">{{ video.description || 'Описание отсутствует' }}</p>
          </div>
        </div>
        <div class="card glass border-0" style="border-radius:20px;">
          <div class="card-body p-4">
            <h3 class="h5 mb-4"><i class="bi bi-chat-left-text me-2" style="color:var(--accent);"></i>Комментарии ({{ comments.length }})</h3>
            <div v-if="isAuthenticated" class="mb-4">
              <div class="d-flex gap-3">
                <img v-if="authStore.user?.avatar_path" :src="getStorageUrl(authStore.user.avatar_path) || undefined" class="avatar" alt="Avatar"/>
                <i v-else class="bi bi-person-circle fs-4" style="color:var(--text-muted);"></i>
                <div class="flex-grow-1">
                  <textarea v-model="newComment" class="form-control" rows="3" placeholder="Напишите комментарий..." style="border-radius:12px;"></textarea>
                  <button class="btn btn-primary btn-sm mt-2" @click="addComment" :disabled="!newComment.trim()" style="border-radius:50px;"><i class="bi bi-send me-1"></i>Отправить</button>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-info mb-4"><i class="bi bi-info-circle me-2"></i><router-link to="/login">Войдите</router-link>, чтобы оставить комментарий</div>
            <div v-if="commentLoading" class="text-center py-4"><div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div></div>
            <div v-else>
              <div v-for="comment in comments" :key="comment.id" class="d-flex gap-3 py-3" style="border-bottom:1px solid var(--border-color);">
                <router-link :to="`/profile/${comment.user?.id}`" class="text-decoration-none">
                  <img v-if="comment.user?.avatar_path" :src="getStorageUrl(comment.user.avatar_path) || undefined" class="avatar" :alt="comment.user?.name"/>
                  <i v-else class="bi bi-person-circle fs-4" style="color:var(--text-muted);"></i>
                </router-link>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center">
                    <router-link :to="`/profile/${comment.user?.id}`" class="text-decoration-none fw-bold" style="color:var(--text-primary);">{{ comment.user?.name }}</router-link>
                    <small class="text-muted">{{ formatDate(comment.created_at) }}</small>
                  </div>
                  <p class="mb-2 mt-1" style="color:var(--text-secondary);">{{ comment.content }}</p>
                  <button v-if="comment.user_id === authStore.user?.id" class="btn btn-sm btn-outline-danger" @click="deleteComment(comment.id)" style="border-radius:50px;"><i class="bi bi-trash"></i></button>
                </div>
              </div>
              <div v-if="comments.length === 0" class="text-center text-muted py-5"><i class="bi bi-chat-square-text display-6"></i><p class="mt-3">Комментариев пока нет</p></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <h3 class="h5 mb-3"><i class="bi bi-collection-play me-2" style="color:var(--secondary);"></i>Похожие видео</h3>
        <div class="text-muted text-center py-5"><i class="bi bi-film display-6"></i><p class="mt-3">Загрузка рекомендаций...</p></div>
      </div>
    </div>
    <UserListModal v-if="showLikersModal" title="Понравилось" :users="likers" :loading="likersLoading" @close="showLikersModal = false"/>
  </div>
</template>
