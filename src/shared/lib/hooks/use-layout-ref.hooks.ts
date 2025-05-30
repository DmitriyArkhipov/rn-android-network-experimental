import { useCallback, useRef } from 'react';
import { type LayoutChangeEvent, type LayoutRectangle } from 'react-native';

export const useLayoutRef = () => {
    const layoutRef = useRef<LayoutRectangle | null>(null);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        layoutRef.current = event.nativeEvent.layout;
    }, []);

    return {
        layoutRef,
        onLayout,
    };
};
