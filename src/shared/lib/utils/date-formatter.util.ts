import { dateService } from '@/shared/lib/services/date/date.service';

export const dateToText = (dateString: string | null): string => {
    if (!dateString) {
        return '';
    }

    const date = dateService(dateString);
    const now = dateService();

    const diffInHours = now.diff(date, 'h');
    const diffInMinutes = now.diff(date, 'm');
    const diffInSeconds = now.diff(date, 's');

    if (diffInSeconds < 5) {
        return 'сейчас';
    }

    if (diffInHours > 24) {
        return date.format(date.isSame(now, 'y') ? 'DD.MM' : 'DD.MM.YYYY');
    }

    const isYesterday = date.isAfter(now.subtract(1, 'd').startOf('d')) && date.isBefore(now);

    if (diffInHours > 12 && isYesterday) {
        return 'вчера';
    }

    if (diffInHours > 0) {
        return `${diffInHours} ч`;
    }

    if (diffInMinutes > 0) {
        return `${diffInMinutes} мин`;
    }

    return `${diffInSeconds} сек`;
};

export const timeToText = (timeString: string): string => {
    const time = dateService(timeString);
    const now = dateService();

    const diffSec = now.diff(time, 's');

    if (diffSec < 5) {
        return 'сейчас';
    }
    if (diffSec < 60) {
        return `${diffSec} сек`;
    }

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
        return `${diffMin} мин`;
    }

    const diffHr = Math.floor(diffMin / 60);
    if (diffHr <= 12) {
        return `${diffHr} ч`;
    }

    return time.format('HH:mm');
};

export const formatTime = (time: number) => `${time}`.padStart(2, '0');

export const getTimeRemaining = (endtime: string) => {
    const end = dateService(endtime);
    const now = dateService();

    const totalSeconds = end.diff(now, 's');

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    return {
        totalSeconds,
        days,
        hours,
        minutes,
        seconds,
    };
};

export const formatDateDDMMYYYY = (date?: Date | string | undefined) => {
    return dateService(date).format('DD.MM.YYYY');
};

export const getTodayDate = () => {
    return formatDateDDMMYYYY();
};

export const getDateRangeByWeek = (startOfWeek: string, endOfWeek: string) => {
    const now = dateService();
    const start = dateService(startOfWeek);
    const end = dateService(endOfWeek);

    const isToday = now.isSame(start, 'day');
    const isCurrentWeek = end.isSame(now, 'week');

    if (isToday) {
        return 'cегодня';
    }

    if (isCurrentWeek) {
        return `${start.format('DD.MM')} - сегодня`;
    }

    return `${start.format('DD.MM')} — ${end.format('DD.MM')}`;
};
