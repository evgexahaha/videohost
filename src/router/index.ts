import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/videohost/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/videohost/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/videohost/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/videohost/video/:id',
      name: 'video',
      component: () => import('@/views/VideoView.vue'),
    },
    {
      path: '/videohost/upload',
      name: 'upload',
      component: () => import('@/views/UploadView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/videohost/profile/:id?',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/videohost/liked',
      name: 'liked',
      component: () => import('@/views/LikedView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/videohost/my-videos',
      name: 'my-videos',
      component: () => import('@/views/MyVideosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/videohost/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
  
  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
