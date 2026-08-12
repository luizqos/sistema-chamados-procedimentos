/** @type {import('next').NextConfig} */
const allowedOrigins = process.env.ALLOWED_DEV_ORIGINS 
  ? process.env.ALLOWED_DEV_ORIGINS.split(',').map(origin => origin.trim()) 
  : [];

const nextConfig = {
  allowedDevOrigins: allowedOrigins,

  typescript: {
     ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;