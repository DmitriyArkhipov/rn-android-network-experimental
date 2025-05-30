import { dateService } from '@/shared/lib/services/date/date.service';

export const checkIfTimeIsUp = (time: Maybe<string>, limit = 15) => {
    if (!time) {
        return true;
    }

    const limitDateTime = 1000 * 60 * limit;
    const isTimeUp = dateService().diff(time) > limitDateTime;

    return isTimeUp;
};
