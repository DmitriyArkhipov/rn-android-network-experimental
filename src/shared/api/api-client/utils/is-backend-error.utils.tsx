// костыль, пока бэки не починят генерацию типов ошибок

type BackendError = {
    response: {
        data: {
            errors: [
                {
                    description: string;
                },
            ];
        };
    };
};

type BaseError = {
    code: number;
    message: string;
};

export const isBackendError = (error: unknown): error is BackendError => {
    return !!(error as BackendError)?.response?.data?.errors?.[0]?.description;
};

export const isBaseError = (error: unknown): error is BaseError => {
    return !!(error as BaseError)?.code && !!(error as BaseError)?.message;
};

export const getErrorMessage = (error: unknown) => {
    if (isBackendError(error)) {
        return error.response.data.errors[0].description;
    }
    if (isBaseError(error)) {
        return error.message.toString();
    }

    return 'Непредвиденная ошибка';
};
