declare module 'react-native-config' {
    export interface NativeConfig {
        ENVIRONMENT?: 'dev' | 'stage' | 'prod';

        DEV_STAGE_KEY?: string;
    }

    export const Config: NativeConfig;
    export default Config;
}
