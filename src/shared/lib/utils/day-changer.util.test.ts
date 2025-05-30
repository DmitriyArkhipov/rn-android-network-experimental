import { dateService } from '@/shared/lib/services/date/date.service';

import { dayChangerUtil } from './day-changer.util';

const ONE_MINUTE = 60 * 1000;

describe('dayChangerUtil', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(dateService().hour(23).minute(59).toDate());
    });

    afterAll(() => {
        jest.useRealTimers();
        jest.clearAllTimers();
    });

    it('should call callback at 00:00', () => {
        const callback = jest.fn();
        dayChangerUtil(callback);

        jest.advanceTimersByTime(ONE_MINUTE);

        expect(callback).toHaveBeenCalled();
    });

    it('should call callback at 00:01', () => {
        const callback = jest.fn();
        dayChangerUtil(callback);

        jest.advanceTimersByTime(ONE_MINUTE * 2);

        expect(callback).not.toHaveBeenCalled();
    });
});
