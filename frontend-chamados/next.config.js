/** @type {import('next').NextStyle}.NextConfig */
const nextConfig = {
  basePath: '/scp',
  typescript: {
     ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;