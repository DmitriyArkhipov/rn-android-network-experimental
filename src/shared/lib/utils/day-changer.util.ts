import { dateService } from '@/shared/lib/services/date/date.service';

const ONE_MINUTE = 60 * 1000;

export const dayChangerUtil = (callback: () => void) => {
    const intervalId = setInterval(() => {
        const now = dateService();

        if (now.hour() === 0 && now.minute() === 0) {
            callback();
        }
    }, ONE_MINUTE);

    return () => clearInterval(intervalId);
};
