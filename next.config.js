/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // matching all API routes
        source: '/:path*',
        destination: 'https://deepurban.kaist.ac.kr/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
