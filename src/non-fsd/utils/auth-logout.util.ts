import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import getStore from '@/app/model';

import { logout as logoutAction } from '@/entities/authorization/model/authorization.actions';

import config from '@/shared/api/config/config.util';
import { postRevokeSession } from '@/shared/api/data/authorization.data';
import { postPushUnsubscribe } from '@/shared/api/data/push.data';
import { queryClient } from '@/shared/api/react-query';
import { isStage } from '@/shared/lib/constants/env.constants';
import { clearRequestQueue } from '@/shared/lib/services/request-queue/request-queue.service';
import { isAndroid } from '@/shared/lib/utils/platform-detection.util';

import { resetNavigationState } from '@/navigation/navigation-methods.util';

import { cancelAllNotifications } from '@/non-fsd/services/push-notifications/push-notification.service';

const deactivatePushNotifications = async (): Promise<void> => {
    try {
        const { playServicesAvailability } = firebase.utils();

        if (isAndroid && !playServicesAvailability.isAvailable) {
            return;
        }

        const fcmToken = await messaging().getToken();

        if (config.auth.accessToken === null) {
            return;
        }

        await postPushUnsubscribe(fcmToken);
    } catch (e) {
        // Не выбрасываем ошибку для dev окружения чтобы не аффектить автотесты в BrowserStack, в котором всегда падает на обращении к messaging
        if (!isStage) {
            return Promise.reject(e);
        }
    }
};

export const clearAllAuthInfo = () => {
    getStore()?.dispatch(logoutAction());

    queryClient.removeQueries();
    clearRequestQueue();

    cancelAllNotifications();
    resetNavigationState();
};

export const logout = async () => {
    await deactivatePushNotifications();

    if (config.auth.accessToken) {
        await postRevokeSession();
    }

    clearAllAuthInfo();
};
