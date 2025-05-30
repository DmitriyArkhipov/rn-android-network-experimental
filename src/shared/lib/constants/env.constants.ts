import Config from 'react-native-config';

export const env = Config;

const currentEnvironment = env.ENVIRONMENT;

export const isDev = currentEnvironment === 'dev';

export const isStage = currentEnvironment === 'stage';

export const isProd = currentEnvironment === 'prod';
