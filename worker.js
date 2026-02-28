// Cloudflare Worker для проксирования запросов
// Размести этот код на https://workers.cloudflare.com/

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    
    // Твой backend URL
    const backendUrl = 'http://a1238201.xsph.ru'
    
    // Создаём новый URL для backend
    const targetUrl = new URL(url.pathname + url.search, backendUrl)
    
    // Создаём новый запрос
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })
    
    // Отправляем запрос на backend
    const response = await fetch(newRequest)
    
    // Добавляем CORS заголовки
    const newResponse = new Response(response.body, response)
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return newResponse
  },
}
