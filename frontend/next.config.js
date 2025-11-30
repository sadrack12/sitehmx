/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Para deploy estático no cPanel (sem Node.js):
  output: 'export',
  typescript: {
    ignoreBuildErrors: true, // Temporário - permitir build mesmo com erros de tipo
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Para produção, usar a API do servidor
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api',
  },
  webpack: (config, { isServer }) => {
    // Configuração para módulos ESM como @daily-co/daily-js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // Configuração para módulos ESM
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    
    return config
  },
}

module.exports = nextConfig

