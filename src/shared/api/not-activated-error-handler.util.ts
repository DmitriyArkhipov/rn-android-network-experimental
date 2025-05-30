import { HttpError } from './api-client/utils/http-error';

export default (error: any) => (otherHanlder: (error: HttpError) => void) => {
    if (error instanceof HttpError) {
        if (
            error.response?.status === 425 &&
            Array.isArray(error.response?.data.errors) &&
            error.response?.data.errors[0].key === 'ACCOUNT_NOT_ACTIVATED'
        ) {
            return;
        }

        otherHanlder(error);
    }
};
