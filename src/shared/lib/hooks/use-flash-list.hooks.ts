import { type RefObject, useMemo, useRef } from 'react';
import { type FlashList } from '@shopify/flash-list';

export type FlashListMethods<T> = Pick<
    FlashList<T>,
    'scrollToEnd' | 'scrollToIndex' | 'scrollToItem' | 'scrollToOffset'
>;

export const useFlashList = <T>(): {
    ref: RefObject<FlashList<T>>;
    methods: FlashListMethods<T>;
} => {
    const ref = useRef<FlashList<T>>(null);

    const methods: FlashListMethods<T> = useMemo(
        () => ({
            scrollToEnd: () => ref.current?.scrollToEnd(),
            scrollToIndex: (params) => ref.current?.scrollToIndex(params),
            scrollToItem: (params) => ref.current?.scrollToItem(params),
            scrollToOffset: (params) => ref.current?.scrollToOffset(params),
        }),
        [],
    );

    return {
        ref,
        methods,
    };
};
