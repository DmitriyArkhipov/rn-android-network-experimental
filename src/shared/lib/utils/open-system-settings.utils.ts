import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { isIos } from '@/shared/lib/utils/platform-detection.util';

export const openSystemNotificationSettings = () => {
    const bundleId = DeviceInfo.getBundleId();

    if (isIos) {
        Linking.openURL('app-settings://notification');

        return;
    }

    Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', [
        {
            key: 'android.provider.extra.APP_PACKAGE',
            value: bundleId,
        },
    ]);
};
