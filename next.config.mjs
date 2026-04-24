/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: false,
  distDir: 'dist',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Keeps your static export working
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Whitelists the crop images
      },
    ],
  },
}

export default nextConfig