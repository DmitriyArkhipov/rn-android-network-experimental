import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

/**
 * Обёртка над AxiosError, чтобы починить проблему https://github.com/facebook/react-native/issues/43636
 */
export class HttpError<T = unknown, D = unknown> extends Error {
    config: AxiosRequestConfig<D>;

    code?: string;

    request?: unknown;

    response?: AxiosResponse<T, D>;

    isAxiosError: boolean;

    status?: string;

    constructor(error: AxiosError<T, D>) {
        super(error.message, { cause: error });

        this.config = error.config;
        this.code = error.code;
        this.request = error.request;
        this.response = error.response;
        this.isAxiosError = error.isAxiosError;
        this.status = error.status;
    }
}

export const isHttpError = (error: unknown): error is HttpError => axios.isAxiosError(error);
