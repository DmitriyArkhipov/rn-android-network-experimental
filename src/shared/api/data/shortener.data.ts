import apiClientService from '@/shared/api/api-client/api-client.service';
import {
    type LongUrlShortenerResponse,
    type ShortenerRequest,
    type ShortenerResponse,
} from '@/shared/api/types/api.types';

export const postShortener = (data: ShortenerRequest) =>
    apiClientService.request<ShortenerResponse>({
        url: `v2/shortener`,
        method: 'post',
        data,
    });

export const getLongUrl = (shortId: string) =>
    apiClientService.request<LongUrlShortenerResponse>({
        url: `v2/shortener/${shortId}`,
        method: 'get',
    });
