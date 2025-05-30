import { Platform } from 'react-native';

import config from '@/shared/api/config/config.util';
import { FULL_APP_VERSION } from '@/shared/lib/constants/device-info.constants';

export const getUserAgent = () => {
    const { appMetricaDeviceId, vendorDeviceId } = config.settings;

    return `${Platform.OS} (UUID: ${vendorDeviceId}) (DeviceID: ${appMetricaDeviceId}) (version: ${FULL_APP_VERSION})`;
};
