import { appsFlyerService } from '@/non-fsd/services/apps-flyer/apps-flyer.service';
import { openUrl } from '@/non-fsd/utils/url-linking.util';

export const openPendingAppsFlyerDeeplink = async () => {
    const pendingDeepLink = appsFlyerService.getPendingDeepLink();

    if (!pendingDeepLink) {
        return;
    }

    await openUrl(pendingDeepLink);
    appsFlyerService.clearPendingDeepLink();
};
