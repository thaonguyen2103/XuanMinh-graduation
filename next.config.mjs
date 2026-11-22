/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
