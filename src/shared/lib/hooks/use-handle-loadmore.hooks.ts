import { useCallback, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type UseHandleLoadMoreOutput = {
    onEndReached: () => void;
    onScrollBeginDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export const useHandleLoadMore = (loadMore: () => void): UseHandleLoadMoreOutput => {
    const handleEndReachedCalledDuringScrollBeginDrag = useRef(false);

    const handleScrollBeginDrag = useCallback(() => {
        handleEndReachedCalledDuringScrollBeginDrag.current = true;
    }, []);

    const handleEndReached = useCallback(() => {
        if (handleEndReachedCalledDuringScrollBeginDrag.current) {
            loadMore();
            handleEndReachedCalledDuringScrollBeginDrag.current = false;
        }
    }, [loadMore]);

    return {
        onEndReached: handleEndReached,
        onScrollBeginDrag: handleScrollBeginDrag,
    };
};
