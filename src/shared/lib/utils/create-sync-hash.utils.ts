// @ts-expect-error - auto-ts-ignore

// import CryptoJs from 'crypto-js';

import { dateService } from '../services/date/date.service';

const concatObjectParams = <T extends object>(data?: T): string => {
    if (!data || typeof data !== 'object') {
        return '';
    }

    if (data instanceof FormData) {
        return '';
    }

    const stack: Array<object> = [data];
    const result: string[] = [];
    while (stack?.length > 0) {
        const currentObj = stack.pop();
        Object.entries(currentObj ?? {}).forEach(([key, value]: [string, any]) => {
            if (typeof value === 'object' && value !== null) {
                stack.push(value);
            } else if (value !== undefined && value !== null) {
                result.push(`${key}${value}`);
            }
        });
    }

    return result.sort((a: string, b: string): number => a.localeCompare(b)).join('');
};

const getConfusingRequestUrl = (requestUrl: string): string => {
    const url = new URL(requestUrl);
    const reverseURLPathname = (url.pathname ?? '').split('').reverse().join('');

    return `${url.origin}${reverseURLPathname}`;
};

export const getRequestPropAndDateHashSum = <T extends object>(requestUrl: string, data?: T) => {
    // const dataConcat = concatObjectParams(data);
    // const confusingRequestUrl = getConfusingRequestUrl(requestUrl);

    // const dateStr = dateService().utc().format('YYYY-MM-DD HH:mm');

    return '';
};
