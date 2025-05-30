import { useRef } from 'react';
import type { ViewabilityConfigCallbackPairs, ViewToken } from 'react-native';

import { debounce } from '@/shared/lib/services/lodash.util';

import { POST_SHOWN_TRESHOLD_PERCENT } from '@/non-fsd/constants/post-feed.constants';

export const useViewabilityFeed = (
    getOnViewableItemChanged: (element: ViewToken<string>) => void,
    addShownPostsToQueue: (viewableItems: ViewToken[]) => void,
) => {
    const viewabilityConfigCallbackPairs: ViewabilityConfigCallbackPairs = [
        {
            viewabilityConfig: {
                minimumViewTime: 1000,
                itemVisiblePercentThreshold: POST_SHOWN_TRESHOLD_PERCENT,
            },
            onViewableItemsChanged: debounce(
                ({ viewableItems }: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
                    viewableItems.forEach(getOnViewableItemChanged);
                },
                1000,
            ),
        },
        {
            viewabilityConfig: {
                itemVisiblePercentThreshold: POST_SHOWN_TRESHOLD_PERCENT,
            },
            onViewableItemsChanged(info) {
                addShownPostsToQueue(info.viewableItems);
            },
        },
    ];

    const viewabilityConfigCallbackPairsRef = useRef(viewabilityConfigCallbackPairs);

    return { viewabilityConfig: viewabilityConfigCallbackPairsRef.current };
};
