import React, { useCallback, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { type Swipeable } from 'react-native-gesture-handler';

import { deviceWidthSpecValue } from '@/shared/lib/utils/layout/device-size.util';
import { Layout } from '@/shared/lib/utils/layout/layout-dimensions.constants';

import { Colors } from '../../../ui/design-system';
import { Text } from '../../../ui/ui-kit-legacy';

import { swipableStyles } from './use-swipable-delete-item.styles';

const inputMax = deviceWidthSpecValue({
    mini: 2.9,
    base: 3,
    max: 3.2,
});

type Direction = 'left' | 'right';

type UseSwipeableDeleteItemInput = {
    onDelete: () => void;
    // TODO: FSD Нужно бы переименовать в isDisabled
    is_support_account: Maybe<boolean>;
};

export const useSwipeableDeleteItem = ({ onDelete, is_support_account }: UseSwipeableDeleteItemInput) => {
    const progressValue = useRef<Animated.AnimatedInterpolation<number>>();
    const handleSwipeableOpen = useCallback(
        (direction: Direction, swipable: Swipeable) => {
            const swipeProgressValue = Number(JSON.stringify(progressValue.current));
            if (swipeProgressValue > 2.5 && direction === 'right') {
                swipable.close();
                onDelete();
            }
        },
        [onDelete],
    );

    const renderRightDeleteAction = useCallback(
        (progress: Animated.AnimatedInterpolation<number>, _: any) => {
            if (is_support_account) {
                return null;
            }

            const trans = progress.interpolate({
                inputRange: [0, 1, inputMax],
                outputRange: [0, 0, -(Layout.window.width / 2.5)],
            });

            progressValue.current = progress;

            return (
                <Animated.View
                    style={[
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={onDelete}
                        style={swipableStyles.containerItem}
                        testID="button_swipeable_delete"
                    >
                        <Text color={Colors.white}>Удалить</Text>
                    </TouchableOpacity>
                </Animated.View>
            );
        },
        [is_support_account, onDelete],
    );

    return {
        onSwipableOpen: handleSwipeableOpen,
        renderRightDeleteAction,
    };
};
