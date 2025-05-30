import { isNumber, isString } from '@/shared/lib/services/lodash.util';

import { generateUniqueId } from './generate-unique-id.util';

const keyExtractorByKey =
    <Entities, Key extends keyof Entities = keyof Entities>(key: Key) =>
    (item?: Entities): string =>
        `${item?.[key] ?? generateUniqueId()}`;

/**
 * @todo Удалить когда бек будет поставлять стабильные данные.
 * @deprecated
 */
const safeKeyExtractorByKey =
    <Entities, Key extends keyof Entities = keyof Entities>(key: Key) =>
    (item: Entities, index: number): string => {
        // eslint-disable-next-line prefer-template
        const value = isNumber(item[key]) ? '' + item[key] : item[key];

        if (!isString(value)) {
            // eslint-disable-next-line prefer-template
            return '' + index;
        }

        // eslint-disable-next-line prefer-template
        return value.length > 0 ? value : '' + index;
    };

export const keyExtractorById = keyExtractorByKey<{ id: string }>('id');
export const keyExtractorByItem = (item: string) => item;
export const keyExtractorByUuid = keyExtractorByKey<{ uuid: string }>('uuid');

/**
 * @todo Сходить к беку и найти решение которое дает стабильную строку
 * @deprecated
 */
export const safeKeyExtractorById = safeKeyExtractorByKey<{ id: Maybe<string> }>('id');
