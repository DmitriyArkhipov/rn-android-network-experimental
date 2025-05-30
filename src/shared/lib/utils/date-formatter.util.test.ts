import { dateService } from '@/shared/lib/services/date/date.service';

import {
    dateToText,
    formatDateDDMMYYYY,
    formatTime,
    getDateRangeByWeek,
    getTimeRemaining,
    getTodayDate,
    timeToText,
} from './date-formatter.util';

describe('dateToText', () => {
    it('returns empty string if input is null', () => {
        expect(dateToText(null)).toBe('');
    });

    it('returns empty string if input is empty string', () => {
        expect(dateToText('')).toBe('');
    });

    it('returns "сейчас" if time difference < 5 sec', () => {
        const now = dateService().toISOString();

        expect(dateToText(now)).toBe('сейчас');
    });

    it('returns date string if > 24 hours', () => {
        const past = dateService().subtract(48, 'hour');
        const expected = past.format('DD.MM');

        expect(dateToText(past.toISOString())).toBe(expected);
    });

    it('returns "вчера" if time was yesterday within 24h', () => {
        const past = dateService().subtract(20, 'hours').toISOString();

        expect(dateToText(past)).toBe('вчера');
    });

    it('returns hours if time difference >= 1 hour', () => {
        const past = dateService().subtract(3, 'hours').toISOString();

        expect(dateToText(past)).toBe('3 ч');
    });

    it('returns minutes if time difference >= 1 min', () => {
        const past = dateService().subtract(5, 'minutes').toISOString();

        expect(dateToText(past)).toBe('5 мин');
    });

    it('returns seconds if time difference >= 5 sec', () => {
        const past = dateService().subtract(5, 'seconds').toISOString();

        expect(dateToText(past)).toBe('5 сек');
    });
});

describe('timeToText', () => {
    it('returns "сейчас" if < 5s', () => {
        const now = dateService().toISOString();

        expect(timeToText(now)).toBe('сейчас');
    });

    it('returns seconds string if >= 5s', () => {
        const past = dateService().subtract(8, 'seconds').toISOString();

        expect(timeToText(past)).toBe('8 сек');
    });

    it('returns minute string if < 1h', () => {
        const past = dateService().subtract(5, 'minutes').toISOString();

        expect(timeToText(past)).toBe('5 мин');
    });

    it('returns hour string if < 12h', () => {
        const past = dateService().subtract(3, 'hours').toISOString();

        expect(timeToText(past)).toBe('3 ч');
    });

    it('returns hour string if == 12h', () => {
        const past = dateService().subtract(12, 'hours').toISOString();

        expect(timeToText(past)).toBe('12 ч');
    });

    it('returns formatted hours if > 12h ago', () => {
        const past = dateService().subtract(13, 'hour');
        const expected = past.format('HH:mm');

        expect(timeToText(past.toISOString())).toBe(expected);
    });
});

describe('formatTime', () => {
    it('formats time < 10 with 0', () => {
        expect(formatTime(5)).toBe('05');
    });

    it('returns same value for time >= 10', () => {
        expect(formatTime(12)).toBe('12');
    });
});

describe('getTimeRemaining', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(dateService().toDate());
    });

    afterAll(() => {
        jest.useRealTimers();
        jest.clearAllTimers();
    });

    it('calculates correct time difference', () => {
        const future = dateService().add(2, 'hour').toISOString();
        const result = getTimeRemaining(future);

        expect(result.hours).toBe(2);
        expect(result.minutes).toBeLessThan(60);
        expect(result.seconds).toBeLessThan(60);
        expect(result.totalSeconds).toBeGreaterThan(0);
    });
});

describe('formatDateDDMMYYYY', () => {
    it('formats correctly', () => {
        expect(formatDateDDMMYYYY('2024-05-10')).toBe('10.05.2024');
    });
});

describe('getTodayDate', () => {
    it('returns today in DD.MM.YYYY format', () => {
        const expected = formatDateDDMMYYYY(dateService().toISOString());

        expect(getTodayDate()).toBe(expected);
    });
});

describe('getDateRangeByWeek', () => {
    it('returns "сегодня" if start is today', () => {
        const today = dateService().format('YYYY-MM-DD');

        expect(getDateRangeByWeek(today, today)).toBe('cегодня');
    });

    it('returns formatted string for current week', () => {
        const start = dateService().startOf('week').format('YYYY-MM-DD');
        const end = dateService().format('YYYY-MM-DD');

        expect(getDateRangeByWeek(start, end)).toContain('сегодня');
    });

    it('returns full range if not current week', () => {
        const start = dateService().subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
        const end = dateService().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');

        expect(getDateRangeByWeek(start, end)).toMatch(/\d{2}\.\d{2} — \d{2}\.\d{2}/);
    });
});
