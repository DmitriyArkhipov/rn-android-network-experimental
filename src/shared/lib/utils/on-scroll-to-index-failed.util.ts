import { type MutableRefObject } from 'react';

import { sleep } from '@/shared/lib/utils/timeout.util';

export const onScrollToIndexFailed = async (
    listRef: MutableRefObject<any>,
    index: number,
    delay = 500,
    animated = true,
    viewPosition = 1,
) => {
    await sleep(delay);
    listRef.current.scrollToIndex({ index, animated, viewPosition });
};
