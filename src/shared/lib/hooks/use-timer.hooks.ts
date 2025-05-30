import { useEffect, useMemo, useRef, useState } from 'react';

import { dateService } from '../services/date/date.service';

type Props = {
    onTimerEnd?: () => void;
    expires_at: Maybe<string>;
};

export const useTimer = ({ onTimerEnd, expires_at }: Props) => {
    const startTimeSeconds = useMemo(() => {
        return dateService(expires_at).diff(undefined, 'second');
    }, [expires_at]);

    const timeSecRef = useRef(startTimeSeconds);
    const [time, setTime] = useState(startTimeSeconds);

    useEffect(() => {
        timeSecRef.current = startTimeSeconds;
        setTime(startTimeSeconds);
    }, [startTimeSeconds]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeSec = --timeSecRef.current;

            if (newTimeSec < 0) {
                clearInterval(interval);
                onTimerEnd?.();

                return;
            }

            setTime(newTimeSec);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTimeSeconds]);

    const timeString = useMemo(() => {
        return dateService().minute(0).second(time).millisecond(0).format('mm:ss');
    }, [time]);

    return {
        timeString,
        isTimeOut: time <= 0,
    };
};
