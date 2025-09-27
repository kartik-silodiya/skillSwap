/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};
 /**
   * Custom webpack configuration.
   * @param {import('webpack').Configuration} config
   */
  webpack: (config) => {
    // This is a workaround for a known issue with the Supabase realtime-js client.
    // It prevents a warning from being thrown during the build process by telling
    // Webpack to not try and bundle the 'ws' library for the client.
    config.externals.push('ws');
    return config;
  },

module.exports = nextConfig;
