/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-e63dc11b8830414dae41e7e0f122a7e7.r2.dev',
        pathname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_PI_SANDBOX: process.env.NEXT_PUBLIC_PI_SANDBOX,
  }
};

module.exports = nextConfig;
