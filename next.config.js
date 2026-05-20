/** @type {import('next').NextConfig} */

const transpilePackages = [
  'react-native',
  'react-native-web',
  '@react-navigation/native',
  '@react-navigation/native-stack',
  '@react-native-async-storage/async-storage',
  'react-native-safe-area-context',
  'react-native-screens',
]

const webExtensions = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx']

const defaultExtensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json']

const nextConfig = {
  transpilePackages,
  // Turbopack (default for `npm run dev`) — fast HMR; mirrors webpack aliases below
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
    },
    resolveExtensions: [...webExtensions, ...defaultExtensions],
  },
  // Webpack (used for `next build` and `npm run dev:webpack`)
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [...webExtensions, ...config.resolve.extensions]
    return config
  },
}

module.exports = nextConfig
