/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-e63dc11b8830414dae41e7e0f122a7e7.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'minepi.com',
      },
    ],
  },
};

module.exports = nextConfig;
