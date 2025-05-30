import { useCallback, useState } from 'react';
import { type LayoutRectangle, type ViewProps } from 'react-native';
import {
    clamp,
    Easing,
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { type PagerViewProps } from '@/shared/ui/components/pager-view/pager-view.types';

const getHeaderTopOffset = (scrollOffset: number, stickyOffset: number) => {
    'worklet';

    return clamp(scrollOffset, 0, stickyOffset);
};

export const useLastCompanyScreenHeader = () => {
    const [headerHeight, setHeaderHeight] = useState<number | undefined>(undefined);

    const scrollOffset = useSharedValue(0);
    const headerOffset = useSharedValue(0);
    const pagerLeftOffset = useSharedValue(0);
    const currentPage = useSharedValue(0);
    const headerLayout = useSharedValue<Pick<LayoutRectangle, 'width' | 'height'>>({ width: 0, height: 0 });
    const stickyTopOffset = useSharedValue<number>(0);

    useAnimatedReaction(
        () => currentPage.value,
        (value) => {
            headerOffset.value = withTiming(
                getHeaderTopOffset(value === 0 ? scrollOffset.value : 0, stickyTopOffset.value),
                {
                    duration: 150,
                    easing: Easing.inOut(Easing.ease),
                },
            );
        },
    );

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollOffset.value = event.contentOffset.y;

        headerOffset.value = getHeaderTopOffset(scrollOffset.value, stickyTopOffset.value);
    });

    const headerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: -headerOffset.value }],
        };
    });

    const searchBarStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: -pagerLeftOffset.value }],
        };
    });

    const scrollStyle = {
        paddingTop: headerHeight,
    };

    const containerStyle = {
        opacity: headerHeight ? 1 : 0,
    };

    const containerProps: ViewProps = {
        pointerEvents: headerHeight ? 'auto' : 'none',
    };

    const onPageScroll: NonNullable<PagerViewProps['onPageScroll']> = useCallback(
        (e) => {
            'worklet';

            const { offset, position } = e;

            const headerWidth = headerLayout.value.width;

            pagerLeftOffset.value = headerWidth * position + headerWidth * offset;

            if (position + offset >= 0.95) {
                currentPage.value = position === 0 ? 1 : position;
            } else {
                currentPage.value = 0;
            }
        },
        [currentPage, headerLayout, pagerLeftOffset],
    );

    const setHeaderLayout = (layout: LayoutRectangle) => {
        setHeaderHeight(layout.height);

        headerLayout.value = layout;
    };

    const setStickyTopOffset = (offset: number) => {
        stickyTopOffset.value = offset;
    };

    return {
        containerProps,
        containerStyle,
        headerStyle,
        onPageScroll,
        onScroll,
        scrollStyle,
        searchBarStyle,
        setStickyTopOffset,
        setHeaderLayout,
    };
};
