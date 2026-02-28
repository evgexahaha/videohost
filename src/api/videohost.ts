import api from './index'

export interface Video {
  id: number
  user_id: number
  title: string
  description: string | null
  video_path: string
  thumbnail_path: string | null
  duration: string | null
  views: number
  is_public: boolean
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
    avatar_path: string | null
  }
  likes_count?: number
  comments_count?: number
  is_liked?: boolean
}

export interface Comment {
  id: number
  user_id: number
  video_id: number
  parent_id: number | null
  content: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    avatar_path: string | null
  }
  replies?: Comment[]
}

export interface User {
  id: number
  name: string
  email: string
  bio: string | null
  avatar_path: string | null
  created_at: string
  total_videos?: number
  total_views?: number
  subscribers_count?: number
}

export const videoApi = {
  // Получить список видео
  getVideos(params?: { search?: string; user_id?: number; page?: number; per_page?: number }) {
    return api.get('/videos', { params })
  },

  // Получить одно видео
  getVideo(id: number) {
    return api.get(`/videos/${id}`)
  },

  // Загрузить видео
  uploadVideo(formData: FormData) {
    return api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Обновить видео
  updateVideo(id: number, data: FormData | Record<string, any>) {
    const headers = data instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }
    return api.put(`/videos/${id}`, data, { headers })
  },

  // Удалить видео
  deleteVideo(id: number) {
    return api.delete(`/videos/${id}`)
  },

  // Популярные видео
  getTrending() {
    return api.get('/videos/trending')
  },

  // Комментарии к видео
  getComments(videoId: number) {
    return api.get(`/videos/${videoId}/comments`)
  },

  // Добавить комментарий
  addComment(videoId: number, content: string, parentId: number | null = null) {
    return api.post(`/videos/${videoId}/comments`, { content, parent_id: parentId })
  },

  // Обновить комментарий
  updateComment(id: number, content: string) {
    return api.put(`/comments/${id}`, { content })
  },

  // Удалить комментарий
  deleteComment(id: number) {
    return api.delete(`/comments/${id}`)
  },

  // Лайк
  toggleLike(videoId: number) {
    return api.post(`/videos/${videoId}/like`)
  },

  // Мои лайки
  getLikedVideos(params?: { page?: number; per_page?: number }) {
    return api.get('/likes', { params })
  },

  // Получить лайкнеров видео
  getVideoLikers(videoId: number) {
    return api.get(`/videos/${videoId}/likers`)
  },
}

export const authApi = {
  register(name: string, email: string, password: string, password_confirmation: string) {
    return api.post('/register', { name, email, password, password_confirmation })
  },

  login(email: string, password: string) {
    return api.post('/login', { email, password })
  },

  logout() {
    return api.post('/logout')
  },

  getUser() {
    return api.get('/user')
  },
}

export const subscriptionApi = {
  // Подписаться/отписаться
  toggle(channelId: number) {
    return api.post(`/channels/${channelId}/subscribe`)
  },

  // Проверить статус подписки
  getStatus(channelId: number) {
    return api.get(`/channels/${channelId}/subscription/status`)
  },

  // Список подписок
  getSubscriptions(params?: { page?: number; per_page?: number }) {
    return api.get('/subscriptions', { params })
  },

  // Получить подписчиков канала
  getSubscribers(channelId: number) {
    return api.get(`/channels/${channelId}/subscribers`)
  },
}

export const profileApi = {
  getProfile(userId?: number) {
    return api.get(`/profile${userId ? `/${userId}` : ''}`)
  },

  updateProfile(data: FormData | Record<string, any>) {
    const headers = data instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }
    return api.put('/profile', data, { headers })
  },

  getMyVideos(params?: { page?: number; per_page?: number }) {
    return api.get('/profile/videos/my', { params })
  },

  deleteAccount() {
    return api.delete('/profile/delete-account')
  },
}
