import type { Config } from 'jest';

const collectCoverageFrom = ['**/*.{ts,tsx,js,jsx}', '!**/coverage/**', '!**/node_modules/**', '!**/babel.config.js'];

const modulesToTransform = [
    'react-native',
    'react-native-reanimated',
    'react-native-input-scroll-view',
    '@react-native',
    '@react-navigation',
];

const jestConfig: Config = {
    displayName: 'setka',
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    roots: ['<rootDir>'],
    detectLeaks: false,
    setupFiles: ['./jest/jest-mocks.tsx', './node_modules/react-native-gesture-handler/jestSetup.js'],
    setupFilesAfterEnv: ['jest-extended/all'],
    collectCoverageFrom,
    transformIgnorePatterns: [`node_modules/(?!(?:${modulesToTransform.join('|')})/)`],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};

export default jestConfig;
