/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.mux.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mxn-cms-qa.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig
