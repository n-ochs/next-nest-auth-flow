module.exports = {
  experimental: {
      jsconfigPaths: true
  },
  eslint: {
      // Warning: Dangerously allow production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true
  },
  images: {
      loader: 'akamai',
      path: '/'
  }
};