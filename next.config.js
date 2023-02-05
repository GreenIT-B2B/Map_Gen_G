/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  distDir: process.env.BUILD_DIR || '.next',
  webpack(config) {
    config.resolve.modules.push(__dirname); // 추가
    return config;
  },
  env: {
    KAKAOMAP_KEY: process.env.NEXT_PUBLIC_KAKAOMAP_KEY,
    WMG_API_URL: process.env.NEXT_PUBLIC_WMP_API_URL,
    MAP_WIDTH: process.env.MAP_SIZE_WIDTH,
    MAP_HEIGHT: process.env.MAP_SIZE_HEIGHT,
  },
};

module.exports = nextConfig;
