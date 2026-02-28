<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getStorageUrl } from '@/api/index'

export default defineComponent({
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const isDark = ref(false)

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        isDark.value = true
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    })

    const toggleTheme = () => {
      isDark.value = !isDark.value
      if (isDark.value) {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
      }
    }

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.user)

    const logout = async () => {
      await authStore.logout()
      router.push({ name: 'home' })
    }

    const goToProfile = () => {
      router.push({ name: 'profile' })
    }

    return {
      isDark,
      toggleTheme,
      isAuthenticated,
      user,
      logout,
      goToProfile,
      getStorageUrl: getStorageUrl,
    }
  },
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-camera-video-fill me-2"></i>
        <span class="text-gradient">VideoHost</span>
      </router-link>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <form 
          class="d-flex mx-auto my-2 my-lg-0" 
          @submit.prevent="$router.push({ name: 'search', query: { q: ($event.target as HTMLFormElement).q.value } })"
        >
          <div class="position-relative">
            <input
              class="form-control"
              type="search"
              name="q"
              placeholder="Поиск видео..."
              aria-label="Search"
            />
            <i 
              class="bi bi-search position-absolute" 
              style="right: 15px; top: 50%; transform: translateY(-50%); opacity: 0.5;"
            ></i>
          </div>
        </form>

        <ul class="navbar-nav ms-auto align-items-center">
          <!-- Переключатель темы -->
          <li class="nav-item me-2">
            <button 
              class="theme-toggle" 
              @click="toggleTheme"
              :title="isDark ? 'Светлая тема' : 'Темная тема'"
            >
              <i v-if="isDark" class="bi bi-sun-fill"></i>
              <i v-else class="bi bi-moon-fill"></i>
            </button>
          </li>

          <template v-if="isAuthenticated">
            <li class="nav-item">
              <router-link to="/upload" class="nav-link">
                <i class="bi bi-plus-circle me-1"></i>
                <span class="d-none d-lg-inline">Загрузить</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/my-videos" class="nav-link">
                <i class="bi bi-collection-play me-1"></i>
                <span class="d-none d-lg-inline">Мои видео</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/liked" class="nav-link">
                <i class="bi bi-heart me-1"></i>
                <span class="d-none d-lg-inline">Понравилось</span>
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  v-if="user?.avatar_path"
                  :src="getStorageUrl(user.avatar_path) || undefined"
                  class="avatar me-2"
                  alt="Avatar"
                />
                <i v-else class="bi bi-person-circle me-2 fs-5"></i>
                <span class="d-none d-lg-inline">{{ user?.name }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link to="/profile" class="dropdown-item" @click="goToProfile">
                    <i class="bi bi-person me-2"></i>
                    Профиль
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <button class="dropdown-item" @click="logout" type="button">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    Выйти
                  </button>
                </li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link to="/login" class="nav-link">
                <i class="bi bi-box-arrow-in-right me-1"></i>
                <span class="d-none d-lg-inline">Войти</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="nav-link">
                <button class="btn btn-primary btn-sm">
                  <i class="bi bi-person-plus me-1"></i>
                  Регистрация
                </button>
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(15deg);
}
</style>
