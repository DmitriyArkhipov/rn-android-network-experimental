const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration for React Native
 * * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const { resolve } = require('path');

module.exports = mergeConfig(defaultConfig, {
        resetCache: true,
        projectRoot: resolve('./'),
        transformer: {
            babelTransformerPath: require.resolve('react-native-svg-transformer'),
            minifierPath: 'metro-minify-terser',
            minifierConfig: {
                compress: {
                    drop_console: true,
                    keep_infinity: true,
                },
            },
            inlineRequires: true,
        },
        resolver: {
            assetExts: assetExts.filter((ext) => ext !== 'svg'),
            sourceExts: [...sourceExts, 'svg'],
        },
    });
