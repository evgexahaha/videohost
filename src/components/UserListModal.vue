<script lang="ts">
import { defineComponent } from 'vue'
import { getStorageUrl } from '@/api/index'

export interface UserItem {
  id: number
  name: string
  email: string
  avatar_path: string | null
  subscribers_count?: number
}

export default defineComponent({
  name: 'UserListModal',
  props: {
    title: {
      type: String,
      required: true,
    },
    users: {
      type: Array as () => UserItem[],
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  methods: {
    getStorageUrl,
    close() {
      this.$emit('close')
    },
    goToProfile(userId: number) {
      this.$router.push({ name: 'profile', params: { id: userId } })
      this.close()
    },
  },
})
</script>

<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="btn-close" @click="close"></button>
      </div>
      <div class="modal-body">
        <div v-if="loading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
        </div>
        <div v-else-if="users.length === 0" class="empty-state">
          <i class="bi bi-emoji-frown display-4 text-muted"></i>
          <p class="text-muted mt-3">Пусто</p>
        </div>
        <div v-else class="users-list">
          <div
            v-for="user in users"
            :key="user.id"
            class="user-item"
            @click="goToProfile(user.id)"
          >
            <img
              v-if="user.avatar_path"
              :src="getStorageUrl(user.avatar_path) || undefined"
              class="user-avatar"
              :alt="user.name"
            />
            <i v-else class="bi bi-person-circle user-avatar-icon"></i>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-subscribers" v-if="user.subscribers_count !== undefined">
                <i class="bi bi-people"></i>
                {{ user.subscribers_count }} подписчиков
              </div>
            </div>
            <i class="bi bi-chevron-right user-arrow"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.modal-body {
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.users-list {
  padding: 10px 0;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.user-item:hover {
  background: var(--bg-card-hover);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.user-avatar-icon {
  width: 48px;
  height: 48px;
  font-size: 2.5rem;
  color: var(--text-muted);
  margin-right: 15px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.user-subscribers {
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-arrow {
  color: var(--text-muted);
  font-size: 1rem;
}
</style>
