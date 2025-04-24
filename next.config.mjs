/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  hostname: '0.0.0.0',
  port: 3000,
}

export default nextConfig