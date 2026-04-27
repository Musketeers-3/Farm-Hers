// next.config.mjs
var nextConfig = {
  // output: 'export',
  reactStrictMode: false,
  distDir: "dist",
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true,
    // Keeps your static export working
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
        // Whitelists the crop images
      }
    ]
  }
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
