/** @type {import('next').NextConfig} */
const packageJson = require('./package.json');

const allowedOrigins = process.env.ALLOWED_DEV_ORIGINS
   ? process.env.ALLOWED_DEV_ORIGINS.split(',').map(origin => origin.trim())
   : [];

const envPath = process.env.NEXT_PUBLIC_PATH ? process.env.NEXT_PUBLIC_PATH.toLowerCase() : '';

const basePath = envPath 
  ? envPath.startsWith('/') 
    ? envPath 
    : `/${envPath}`
  : '';

const nextConfig = {
  basePath: basePath,  
  allowedDevOrigins: allowedOrigins,
  typescript: {
     ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

module.exports = nextConfig;