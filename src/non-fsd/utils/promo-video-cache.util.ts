import ReactNativeBlobUtil from 'react-native-blob-util';
import convertToProxyURL, { clearCache } from 'react-native-video-cache-control';

import { Layout } from '@/shared/lib/utils/layout/layout-dimensions.constants';

// Отключил эти правила так как еслинт ругается на for of и await внутри циклов, которые необходимы для реализации ретраев кэширования видео сеток
/* eslint-disable no-restricted-syntax, no-await-in-loop, @typescript-eslint/no-loop-func */

enum ResolutionType {
    High = '860x1664',
    Short = '720x1084',
}

const { width, height } = Layout.window;

const videoDomainPath = 'https://cdn-public.setka.ru/launch-stories';

const getUrlVideoByResolution = (type: ResolutionType) => [
    `${videoDomainPath}/${type}/01.mp4`,
    `${videoDomainPath}/${type}/02.mp4`,
    `${videoDomainPath}/${type}/03.mp4`,
    `${videoDomainPath}/${type}/04.mp4`,
];

const getDeviceResolutionType = () => {
    if (height > 812 && width > 375) {
        // > iphone mini
        return ResolutionType.High;
    }

    return ResolutionType.Short;
};

const getAllVideoUrls = () => {
    const resolutionType = getDeviceResolutionType();

    return getUrlVideoByResolution(resolutionType);
};

const downloadVideo = (url: string) =>
    ReactNativeBlobUtil.fetch('GET', url)
        .then(() => Promise.resolve())
        .catch((err) => Promise.reject(err));

const getDownloadRequests = async (urls: string[]) => {
    const downloadRequests = [];

    for (const url of urls) {
        const downloadCompleted = await ReactNativeBlobUtil.fs.exists(url);

        if (!downloadCompleted) {
            downloadRequests.push(downloadVideo(url));
        }
    }

    return downloadRequests;
};

const downloadAllPromoVideo = async () => {
    // Делаем максимум 2 ретрая при загрузке видео в кэш
    const RETRY_COUNT_LIMIT = 2;
    let RETRY_COUNTER = 0;

    const videoUrls = getAllVideoUrls();
    const proxyUrls = videoUrls.map((url) => convertToProxyURL({ url }));

    let downloadRequests = await getDownloadRequests(proxyUrls);

    while (RETRY_COUNTER <= RETRY_COUNT_LIMIT) {
        const downloadResult = await Promise.allSettled(downloadRequests);

        downloadRequests = downloadResult.reduce((result, res, index) => {
            if (res.status === 'rejected') {
                // @ts-expect-error - auto-ts-ignore

                result.push(downloadRequests[index]);
            }

            return result;
        }, []);

        if (downloadRequests.length === 0) {
            return;
        }

        RETRY_COUNTER += 1;
    }
};

export { clearCache, downloadAllPromoVideo, getAllVideoUrls };
