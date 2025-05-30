import config from '@/shared/api/config/config.util';
import { postShortener } from '@/shared/api/data/shortener.data';
import type { ShortenerRequest, ShortenerRequestTypeEnum } from '@/shared/api/types/api.types';
import { isNil, omitBy } from '@/shared/lib/services/lodash.util';

import { URLPathShortenerMap, UTM_CHAMPING } from './sharing-link.constants';
import { type SharedLinkContentType, type ShareLinkParams, type UTMDynamicParams } from './sharing-link.types';

const addUtmToLink = <OtherParams extends Record<string, string>>(
    link: string,
    params: UTMDynamicParams,
    otherParams?: OtherParams,
    isEncodeURIParams?: boolean,
): string => {
    const formattedLink = link.endsWith('?') ? link.slice(0, -1) : link;
    const isQueryParams = formattedLink.includes('?');

    const concatParams = { ...(params ?? {}), ...(otherParams ?? {}) };
    const existingParameters = omitBy(concatParams, isNil);

    const dynamicParamsStr = new URLSearchParams(existingParameters).toString();
    let paramsStr = `${dynamicParamsStr}&utm_campaign=${UTM_CHAMPING}`;

    if (isEncodeURIParams) {
        paramsStr = encodeURIComponent(paramsStr);
    }

    return `${formattedLink}${isQueryParams ? '&' : '?'}${paramsStr}`.toLowerCase();
};

const mapToPostShortenerApi = (url: string, type: ShortenerRequestTypeEnum | null): ShortenerRequest => ({
    urls: [{ url, type }],
});

const getShortenedLink = async (link: string, urlType: SharedLinkContentType): Promise<string | undefined> => {
    const requestData = mapToPostShortenerApi(link, URLPathShortenerMap[urlType]);
    const data = await postShortener(requestData);

    return data?.urls[link];
};

const addUtmToShareLink = (link: string, params: ShareLinkParams) => {
    const userId = config.account.accountId ?? undefined;
    const linkWithUtm = addUtmToLink(link, {
        ...params,
        utm_term: userId,
    });

    return linkWithUtm;
};

export const getShortenedOrOriginalShareLink = async (link: string, params: ShareLinkParams): Promise<string> => {
    const originalLink = addUtmToShareLink(link, params);
    try {
        const shortenedLink = await getShortenedLink(originalLink, params.utm_medium);

        return shortenedLink ?? originalLink;
    } catch (error) {
        console.error(error);
    }

    return originalLink;
};
