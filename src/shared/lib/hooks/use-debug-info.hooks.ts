import { useEffect } from 'react';
import RNShake from 'react-native-shake';

import { isStage } from '@/shared/lib/constants/env.constants';

import { navigate } from '@/navigation/navigation-methods.util';
import { Screens } from '@/navigation/screens.constants';

export const useDebugInfo = () => {
    useEffect(() => {
        if (!isStage) {
            return undefined;
        }
        const subscription = RNShake.addListener(() => {
            navigate(Screens.DEV_INFO);
        });

        return () => subscription.remove();
    }, []);
};
