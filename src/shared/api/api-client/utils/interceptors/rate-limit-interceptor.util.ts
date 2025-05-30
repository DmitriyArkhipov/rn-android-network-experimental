import { type AxiosErrorProps } from '@/shared/api/api-client/api-client.service';
import { HttpStatusCode } from '@/shared/api/http-status-code.types';
// import { snack } from '@/shared/ui/design-system';

import { type HttpError } from '../http-error';

export const rateLimitInterceptor = async (error: HttpError<AxiosErrorProps>) => {
    if (
        error?.response?.status === HttpStatusCode.TOO_MANY_REQUESTS &&
        Array.isArray(error?.response?.data?.errors) &&
        error.response?.data?.errors[0]?.key === 'RATE_LIMIT_EXCEEDED'
    ) {
        setTimeout(() => {
            // snack.negative({
            //     text: 'вы сделали слишком много таких действий — сделайте перерыв и попробуйте позже',
            //     bottomOffset: 'tabBar',
            // });
        }, 300);

        return Promise.reject();
    }

    return Promise.reject(error);
};
