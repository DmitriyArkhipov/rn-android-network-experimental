module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
      [
          'module-resolver',
          {
              root: ['./src'],
              extensions: [
                  '.ios.ts',
                  '.android.ts',
                  '.ts',
                  '.ios.tsx',
                  '.android.tsx',
                  '.tsx',
                  '.jsx',
                  '.js',
                  '.json',
              ],
              alias: {
                  '@/shared': './src/shared',
                  '@/entities': './src/entities',
                  '@/features': './src/features',
                  '@/widgets': './src/widgets',
                  '@/pages': './src/pages',
                  '@/app': './src/app',
                  '@/navigation': './src/navigation',
                  '@/non-fsd': './src/non-fsd',
                  utils: './src/utils',
                  views: './src/views',
                  hooks: './src/hooks',
                  constants: './src/constants',
                  'form-kit': './src/form-kit',
              },
          },
      ],
      [
          'transform-inline-environment-variables',
          {
              whitelist: ['CI_TEST'],
          },
      ],
  ],
};
