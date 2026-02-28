<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    return { router, authStore }
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      error: null as string | null,
      loading: false,
    }
  },
  methods: {
    async handleSubmit() {
      this.error = null
      this.loading = true

      try {
        await this.authStore.register(
          this.name,
          this.email,
          this.password,
          this.password_confirmation
        )
        this.router.push({ name: 'home' })
      } catch (e: any) {
        const errors = e.response?.data?.errors
        if (errors) {
          this.error = Object.values(errors).flat().join(', ')
        } else {
          this.error = e.response?.data?.message || 'Ошибка регистрации'
        }
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
              <i class="bi bi-person-plus text-gradient me-2"></i>
              Регистрация
            </h2>

            <div v-if="error" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Имя</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-control"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

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

              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  minlength="8"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="password_confirmation" class="form-label">
                  Подтверждение пароля
                </label>
                <input
                  id="password_confirmation"
                  v-model="password_confirmation"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  minlength="8"
                  required
                />
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                <span v-if="!loading">Зарегистрироваться</span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Регистрация...
                </span>
              </button>

              <p class="text-center mb-0">
                Уже есть аккаунт?
                <router-link to="/login" class="text-decoration-none">
                  Войти
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
