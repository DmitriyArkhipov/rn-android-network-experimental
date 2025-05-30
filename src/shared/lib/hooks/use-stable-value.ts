import { useRef } from 'react';

export const useStableValue = <T>(value: T) => {
    const valueRef = useRef(value);

    valueRef.current = value;

    return valueRef;
};
