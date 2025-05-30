import { useCallback, useRef } from 'react';
import { usePrevious } from 'react-use';

/**
 * Создаёт keyExtractor, который учитывает потенциальное дублирование элементов списка.
 *
 * Рекомендуется применять только в тех случаях, когда большинство элементов списка гарантированно уникальны, в ином случае лучше использовать обычный keyExtractor.
 */
export const useKeyExtractorWithCollisions = <T>(
    items: T[],
    keyExtractor: (item: T, index: number) => string,
    isEnabled: boolean,
) => {
    const keys = useRef<Record<string, string>>({});
    const keysCounter = useRef<Record<string, number>>({});

    const previousItems = usePrevious(isEnabled ? items : undefined);

    if (items !== previousItems && isEnabled) {
        keys.current = {};
        keysCounter.current = {};

        for (let index = 0; index < items.length; index++) {
            const item = items[index];

            if (item) {
                const key = keyExtractor(item, index);

                if (keysCounter.current[key]) {
                    keysCounter.current[key]++;
                } else {
                    keysCounter.current[key] = 1;
                }

                keys.current[index] = `${key}-${keysCounter.current[key]}`;
            }
        }
    }

    const keyExtractorWithCollisions = useCallback(
        (item: T, index: number) => keys.current[index] || keyExtractor(item, index),
        [keyExtractor],
    );

    return isEnabled ? keyExtractorWithCollisions : keyExtractor;
};
