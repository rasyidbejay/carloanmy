/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/carloanmy",
  assetPrefix: "/carloanmy/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
