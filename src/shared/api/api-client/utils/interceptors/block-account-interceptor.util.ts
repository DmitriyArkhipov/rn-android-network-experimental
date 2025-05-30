import { type AxiosErrorProps } from '@/shared/api/api-client/api-client.service';
import { HttpStatusCode } from '@/shared/api/http-status-code.types';

// import { navigate } from '@/navigation/navigation-methods.util';
// import { Screens } from '@/navigation/screens.constants';

import { type HttpError } from '../http-error';

export const blockAccountInterceptor = async (error: HttpError<AxiosErrorProps>) => {
    if (
        error.response?.status === HttpStatusCode.I_AM_A_TEAPOT &&
        Array.isArray(error.response?.data.errors) &&
        error.response?.data.errors[0]?.key === 'ACCOUNT_BLOCKED' &&
        error.response?.data.errors[0].type === 'account'
    ) {
        // navigate(Screens.BLOCKING_FLOW, error.response?.data.errors[0] as unknown as { blocked_until: string });

        return Promise.reject();
    }

    return Promise.reject(error);
};
