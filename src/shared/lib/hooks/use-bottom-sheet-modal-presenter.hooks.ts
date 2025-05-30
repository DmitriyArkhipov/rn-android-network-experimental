import { useCallback, useRef } from 'react';
import { type BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

export const useBottomSheetModalPresenter = () => {
    const ref = useRef<BottomSheetModalMethods>(null);

    const present = useCallback(() => ref.current?.present(), []);
    const dismiss = useCallback(() => ref.current?.dismiss(), []);
    const expand = useCallback(() => ref.current?.expand(), []);

    return { ref, present, dismiss, expand };
};
