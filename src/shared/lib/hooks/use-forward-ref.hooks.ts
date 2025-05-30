import { useRef } from 'react';

export const useForwardRef = <T>(ref: React.ForwardedRef<T>) => {
    const externalRef = ref;

    const internalRef = useRef<T | null>(null);

    const handleRef = (node: T) => {
        internalRef.current = node;

        if (typeof externalRef === 'function') {
            externalRef(node);
        } else if (externalRef) {
            externalRef.current = node;
        }
    };

    return { handleRef, internalRef };
};
