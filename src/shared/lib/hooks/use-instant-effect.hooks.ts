import { useRef } from 'react';

import { isEqual } from '@/shared/lib/services/lodash.util';

type Deps = any[];

export const useInstantEffect = (cb: () => void, deps: Deps) => {
    const previousDeps = useRef<Deps>();

    if (isEqual(previousDeps.current, deps)) {
        return;
    }

    previousDeps.current = deps;

    cb();
};
