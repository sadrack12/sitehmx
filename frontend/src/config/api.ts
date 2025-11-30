// Configuração da URL da API
// Para build estático, usar URL fixa para produção
export const API_URL = (() => {
  // Se está no navegador (cliente)
  if (typeof window !== 'undefined') {
    // Tentar variável global (pode ser definida no HTML)
    const globalApiUrl = (window as any).__API_URL__
    if (globalApiUrl) return globalApiUrl
    
    // Tentar env (se definido no build)
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL
    }
    
    // URL fixa para produção (hardcoded)
    return 'https://clamatec.com/api'
  }
  
  // Server-side: localhost para desenvolvimento
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
})()

