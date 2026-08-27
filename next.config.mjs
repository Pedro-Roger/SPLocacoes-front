/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || 'https://sp-api.linkdecadastro.com.br';

const nextConfig = {
  images: {
    // Otimização de imagens: formatos modernos desde o Estágio 1
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Ajustar para o host real das imagens (S3/Cloudinary/etc.)
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Proxy para o backend: resolve o problema de cookie sameSite em produção,
  // pois frontend e backend passam a ter a mesma origem (via Vercel rewrites).
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
