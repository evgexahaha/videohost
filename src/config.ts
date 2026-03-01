// Конфигурация приложения
export const config = {
  // БАЗОВЫЙ URL API - МЕНЯТЬ ТОЛЬКО ЭТУ ПЕРЕМЕННУЮ!
  
  // Для хостинга (Railway - HTTPS):
  apiBaseUrl: 'https://videohost-api-production.up.railway.app',
  storageUrl: 'https://videohost-api-production.up.railway.app/storage',
  
  // Для локальной разработки (раскомментируй):
  // apiBaseUrl: 'http://localhost:8000',
  // storageUrl: 'http://localhost:8000/storage',
}

// Экспортируем вспомогательные функции
export function getApiUrl(endpoint: string): string {
  return `${config.apiBaseUrl}${endpoint}`
}

export function getStorageUrl(path: string | null): string | null {
  if (!path) return null
  return `${config.storageUrl}/${path}`
}
