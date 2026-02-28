<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    return { router, authStore }
  },
  data() {
    return {
      email: '',
      password: '',
      error: null as string | null,
      loading: false,
    }
  },
  methods: {
    async handleSubmit() {
      this.error = null
      this.loading = true
      try {
        await this.authStore.login(this.email, this.password)
        this.router.push({ name: 'home' })
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Ошибка входа'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow border-0">
          <div class="card-body p-5">
            <h2 class="text-center mb-4">
              <i class="bi bi-box-arrow-in-right text-gradient me-2"></i>
              Вход
            </h2>

            <div v-if="error" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Пароль</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                <span v-if="!loading">Войти</span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Вход...
                </span>
              </button>

              <p class="text-center mb-0">
                Нет аккаунта?
                <router-link to="/register" class="text-decoration-none">
                  Зарегистрироваться
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
