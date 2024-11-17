/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
