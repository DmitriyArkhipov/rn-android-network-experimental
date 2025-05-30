import { getBundleId } from 'react-native-device-info';

export const createAndroidResourceUrl = (folder: 'drawable' | 'raw', resourceName: string) => {
    return `android.resource://${getBundleId()}/${folder}/${resourceName}`;
};
