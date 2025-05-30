import { dateService, now } from '@/shared/lib/services/date/date.service';

import { checkIfTimeIsUp } from './time.util';

describe('checkIfTimeIsUp', () => {
    beforeAll(() => {
        jest.useFakeTimers().setSystemTime(now());
    });

    afterAll(() => {
        jest.useRealTimers();
        jest.clearAllTimers();
    });

    it('should return true if time is null', () => {
        expect(checkIfTimeIsUp(null)).toBe(true);
    });

    it('should return true if time is undefined', () => {
        expect(checkIfTimeIsUp(undefined)).toBe(true);
    });

    it('should return true if time is empty', () => {
        expect(checkIfTimeIsUp('')).toBe(true);
    });

    it('should return false if time is invalid string', () => {
        expect(checkIfTimeIsUp('invalid')).toBe(false);
    });

    it('should return false if time is within the limit', () => {
        const timeWithinLimit = dateService().subtract(5, 'minutes').toISOString();

        expect(checkIfTimeIsUp(timeWithinLimit)).toBe(false);
    });

    it('should return true if time exceeds the limit', () => {
        const timeExceedsLimit = dateService().subtract(20, 'minutes').toISOString();

        expect(checkIfTimeIsUp(timeExceedsLimit)).toBe(true);
    });

    it('should return true if time over a custom limit', () => {
        const timeJustOverCustomLimit = dateService().subtract(11, 'minutes').toISOString();

        expect(checkIfTimeIsUp(timeJustOverCustomLimit, 10)).toBe(true);
    });

    it('should return false if time under a custom limit', () => {
        const timeJustUnderCustomLimit = dateService().subtract(9, 'minutes').toISOString();

        expect(checkIfTimeIsUp(timeJustUnderCustomLimit, 10)).toBe(false);
    });
});
