/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@babel/standalone',
    'react-native',
    'react-native-web',
    '@react-navigation/native',
    '@react-navigation/native-stack',
    '@react-native-async-storage/async-storage',
  ],
  webpack: (config, { dev }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]

    // Stale webpack cache in dev often needs `rm -rf .next` — disable to keep HMR reliable.
    if (dev) {
      config.cache = false
    }

    return config
  },
}

module.exports = nextConfig
