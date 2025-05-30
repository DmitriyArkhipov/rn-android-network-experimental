import { type AxiosRequestConfig } from 'axios';

import appConfig from '@/shared/api/config/config.util';
import { getRequestPropAndDateHashSum } from '@/shared/lib/utils/create-sync-hash.utils';

export const getSecureRequestHeader = async <T extends object>(requestUrl: string, config: AxiosRequestConfig) => {
    let data: T | undefined = config?.data;

    if (config.method?.toLowerCase() === 'get') {
        data = config?.params;
    }

    const requestPropAndDateHash = await getRequestPropAndDateHashSum<T>(requestUrl, data);
    // eslint-disable-next-line no-useless-concat
    const headerKey = 'X' + '-' + 'S' + 'I' + 'G' + 'N' + 'A' + 'T' + 'U' + 'R' + 'E';

    if (appConfig.auth.isSAPEnabled) {
        return {
            [headerKey]: requestPropAndDateHash,
        };
    }

    return {};
};
