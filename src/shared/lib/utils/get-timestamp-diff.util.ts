import { dateService } from '@/shared/lib/services/date/date.service';

export const getTimestampDiff = (date1: Date | number, date2: Date | number) => {
    const milliseconds = dateService(date1).diff(date2, 'milliseconds');

    const seconds = Math.round(milliseconds / 1000);
    const minutes = seconds >= 0 ? Math.floor(seconds / 60) : Math.ceil(seconds / 60);

    return { milliseconds, seconds, minutes };
};
