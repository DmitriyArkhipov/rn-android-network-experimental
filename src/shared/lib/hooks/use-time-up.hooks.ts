import { useEffect, useState } from 'react';

import { checkIfTimeIsUp } from '@/shared/lib/utils/time.util';

export const useTimeUp = (
    time: Maybe<string>,
    limit = 15,
    shouldSetTimer: boolean = false,
    interval: number = 60000,
) => {
    const [isTimeUp, setIsTimeUp] = useState(checkIfTimeIsUp(time, limit));

    useEffect(() => {
        if (!shouldSetTimer) {
            return;
        }
        const intervalId = setInterval(() => {
            setIsTimeUp(checkIfTimeIsUp(time, limit));
        }, interval);

        return () => clearInterval(intervalId);
    }, [interval, shouldSetTimer, time, limit]);

    return { isTimeUp };
};
