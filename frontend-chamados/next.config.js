/** @type {import('next').NextStyle}.NextConfig */
const nextConfig = {
  basePath: '/tickets',
  typescript: {
     ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;