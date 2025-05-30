import { type DependencyList, useEffect, useState } from 'react';
import type { AppStateStatus } from 'react-native';
import { useAppState } from '@react-native-community/hooks';

export const useIsExitingBackground = (callback?: () => void | Promise<void>, deps: DependencyList = []) => {
    const appStateState: AppStateStatus = useAppState();
    const [isBackgroundThread, setBackgroundThread] = useState<boolean>(false);

    useEffect(() => {
        if (typeof callback === 'function') {
            if (appStateState === 'active') {
                if (isBackgroundThread) {
                    callback();
                }
                setBackgroundThread(false);
            } else {
                setBackgroundThread(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appStateState, isBackgroundThread, deps]);
};
