import { useEffect, useRef } from 'react';
import { type AppStateStatus } from 'react-native';
import { useAppState } from '@react-native-community/hooks';

import { capitalize } from '@/shared/lib/utils/regex.util';

type AppStateHandler = (previousAppState: AppStateStatus | null) => void;

type AppStateStatusNarrowed = Extract<AppStateStatus, 'active' | 'background' | 'inactive'>;

type UseAppStateHandlersParams = {
    [key in `on${Capitalize<AppStateStatusNarrowed>}`]?: AppStateHandler;
};

export const useAppStateHandlers = (handlers: UseAppStateHandlersParams) => {
    const previousAppState = useRef<AppStateStatusNarrowed | null>(null);

    const appState = useAppState() as AppStateStatusNarrowed;

    useEffect(() => {
        if (appState === previousAppState.current) {
            return;
        }

        handlers[`on${capitalize(appState)}`]?.(previousAppState.current);

        previousAppState.current = appState;
    }, [appState, handlers]);
};
