import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { isAndroid } from '@/shared/lib/utils/platform-detection.util';

export const useAndroidBackDisabled = (gestureEnabled: boolean = false) => {
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && isAndroid && !gestureEnabled) {
            const unsubscribe = BackHandler.addEventListener('hardwareBackPress', () => true);

            return unsubscribe.remove;
        }

        return () => {};
    }, [isFocused, gestureEnabled]);
};
