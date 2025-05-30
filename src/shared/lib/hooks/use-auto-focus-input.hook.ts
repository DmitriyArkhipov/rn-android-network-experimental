import { useCallback, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// https://github.com/software-mansion/react-native-screens/issues/236
export function useAutoFocusInput() {
    const navigation = useNavigation();

    const inputRef = useRef<{ focus: () => void; clear: () => void }>(null);

    useFocusEffect(
        useCallback(() => {
            // https://reactnavigation.org/docs/6.x/stack-navigator#transitionstart
            // @ts-expect-error navigation event listener missing declarations for transitionStart and transitionEnd event names.
            const unsubscribe = navigation.addListener('transitionEnd', () => {
                inputRef.current?.focus();
            });

            return unsubscribe;
        }, [navigation]),
    );

    return { inputRef };
}
