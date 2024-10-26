/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/conversations',
        permanent: true, // Use true for a 308 permanent redirect, false for a 307 temporary redirect
      },
    ];
  },
};
