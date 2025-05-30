import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useRefetchOnFocus = (refetch: () => void) => {
    const firstTimeRef = useRef(true);

    useFocusEffect(
        useCallback(() => {
            if (firstTimeRef.current) {
                firstTimeRef.current = false;

                return;
            }

            refetch();
        }, [refetch]),
    );
};
