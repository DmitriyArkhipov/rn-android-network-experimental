import { useCallback } from 'react';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { useFocusEffect } from '@react-navigation/native';

import { isAndroid } from '@/shared/lib/utils/platform-detection.util';

export const useAndroidKeyboardAdjustResize = () => {
    useFocusEffect(
        useCallback(() => {
            if (isAndroid) {
                setTimeout(() => {
                    AvoidSoftInput.setAdjustResize();
                    AvoidSoftInput.setEnabled(true);
                });
            }

            return () => {
                if (isAndroid) {
                    AvoidSoftInput.setEnabled(false);
                    AvoidSoftInput.setDefaultAppSoftInputMode();
                }
            };
        }, []),
    );
};
