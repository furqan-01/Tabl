/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'ai',
      '@ai-sdk/react',
      '@ai-sdk/google',
      'react-markdown',
    ],
  },
};

export default nextConfig;


