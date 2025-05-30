// import ReactNativeBlobUtil from 'react-native-blob-util';
import { Mutex } from 'async-mutex';
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import qs from 'qs';

import {
    failedRefreshError,
    MAX_RETRY_COUNT,
    MAX_RETRY_COUNT_BAD_AUTH,
    RETRY_TIMEOUT,
} from '@/shared/api/api-client/api-client.constants';
import { isServerError } from '@/shared/api/api-client/utils/is-server-error.util';
import appConfig from '@/shared/api/config/config.util';
import { type UploadFileResponse } from '@/shared/api/types/api.types';
import { type Attachment } from '@/shared/api/types/attachments.types';
import { type ChallengeByIdResponse } from '@/shared/api/types/auth.types';
import { EmitterEvents } from '@/shared/lib/utils/emitter/emitter.constants';
import emitterUtil from '@/shared/lib/utils/emitter/emitter.util';
import { imageResize } from '@/shared/lib/utils/image-resize.util';

import { getUserAgent } from '@/non-fsd/utils/device-info.util';

import { getSecureRequestHeader } from './utils/api-client.util';
import { HttpError } from './utils/http-error';
import { blockAccountInterceptor } from './utils/interceptors/block-account-interceptor.util';
import { rateLimitInterceptor } from './utils/interceptors/rate-limit-interceptor.util';
import { type CustomAxiosRequestConfig, type ImageUploadOptions } from './api-client.types';

type UploadEvent = {
    isTrusted: boolean;
    lengthComputable: boolean;
    loaded: number;
    total: number;
};

export type AxiosErrorProps = {
    errors: {
        type: string;
        key: string;
        description: string | null;
        operation: string;
    }[];
};

const refreshTokenNew = (config: AxiosRequestConfig) => {
    return makeRequest<ChallengeByIdResponse>({
        ...config,
        headers: {
            authorization: `Bearer ${appConfig.auth.accessToken}`,
        },
        method: 'post',
        url: `v1/oauth/refresh`,
        data: { refresh_token: appConfig.auth.refreshToken },
    });
};

export const instance = axios.create();
const mutex = new Mutex();

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    return config;
};

const onResponse = (response: AxiosResponse) => {
    if (response.data == null) {
        return {};
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    return {
        ...response.data,
        metadata: {
            ...response.data.metadata,
        },
        headers: response.headers,
    };
};

const onErrorResponse = async (error: AxiosError | Error): Promise<typeof HttpError | AxiosResponse> => {
    if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
    }

    const httpError = new HttpError(error);

    const { code, config } = httpError;
    const { url } = config as AxiosRequestConfig;

    const response = httpError.response ?? ({} as AxiosResponse);
    const { status } = response;

    switch (status) {
        case 400: {
            break;
        }
        case 401: {
            // checking whether the mutex is locked
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    const refreshResult = await refreshTokenNew(config);

                    if (refreshResult) {
                        emitterUtil.emit(EmitterEvents.UPDATE_TOKENS, refreshResult);

                        return await makeRequest({
                            ...config,
                            headers: {
                                ...config.headers,
                                authorization: `Bearer ${appConfig.auth.accessToken}`,
                            },
                        });
                    }
                    emitterUtil.emit(EmitterEvents.NO_USER);
                } finally {
                    // release must be called once the mutex should be released again.
                    release();
                }
            } else {
                // wait until the mutex is available without locking it
                await mutex.waitForUnlock();

                // рефреш провалился не смысла пытаться снова
                if (appConfig.auth.accessToken === null) {
                    response.status = 403;

                    httpError.message += ` ${failedRefreshError}. New auth`;

                    return Promise.reject(httpError);
                }

                return makeRequest({
                    ...config,
                    headers: {
                        ...config.headers,
                        authorization: `Bearer ${appConfig.auth.accessToken}`,
                    },
                });
            }
            break;
        }

        case 403: {
            // old bad auth logic start
            if (
                Array.isArray(response.data.errors) &&
                response.data.errors[0].key === 'BAD_AUTHORIZATION' &&
                response.data.errors[0].type === 'auth'
            ) {
                const customConfig = config as CustomAxiosRequestConfig;
                const { refreshToken, accessToken } = appConfig.auth;

                const hasTokens = Boolean(refreshToken && accessToken);

                if (!hasTokens) {
                    httpError.message += ` ${failedRefreshError}. BAD_AUTHORIZATION. Dont have tokens`;

                    return Promise.reject(httpError);
                }

                customConfig.retryCount = customConfig.retryCount || 0;

                const isRefreshUrl = url === 'auth/oauth/token' || url === 'v1/oauth/refresh';

                if (customConfig.retryCount >= MAX_RETRY_COUNT_BAD_AUTH || isRefreshUrl) {
                    if (isRefreshUrl) {
                        httpError.message += ` ${failedRefreshError}. BAD_AUTHORIZATION. REFRESH_ERROR`;
                    } else {
                        httpError.message += ` ${failedRefreshError}. BAD_AUTHORIZATION. MAX_RETRY_COUNT_BAD_AUTH`;
                    }

                    emitterUtil.emit(EmitterEvents.NO_USER);

                    return Promise.reject(httpError);
                }

                customConfig.retryCount += 1;

                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (customConfig?.headers?.['authorization']) {
                            customConfig.headers['authorization'] = `Bearer ${appConfig.auth.accessToken}`;
                            resolve(makeRequest(customConfig));
                        }
                    }, RETRY_TIMEOUT);
                });
            }
            // old bad auth logic end

            return Promise.reject(httpError);
        }
        case 404: {
            // "Invalid request"
            break;
        }
        case 418: {
            // account blocking
            return blockAccountInterceptor(httpError as HttpError<AxiosErrorProps>);
        }
        case 429: {
            return rateLimitInterceptor(httpError as HttpError<AxiosErrorProps>);
        }
        case 500: {
            // "Server error"
            break;
        }
        default: {
            // "Unknown error occurred"
            break;
        }
    }

    // Retry start
    const customConfig = config as CustomAxiosRequestConfig;

    if (isServerError(response?.status) || code === 'ERR_NETWORK') {
        customConfig.retryCount = customConfig.retryCount || 0;

        if (customConfig.retryCount >= MAX_RETRY_COUNT) {
            return Promise.reject(httpError);
        }

        customConfig.retryCount += 1;

        return new Promise((resolve) => {
            setTimeout(() => {
                if (customConfig?.headers?.['authorization']) {
                    customConfig.headers['authorization'] = `Bearer ${appConfig.auth.accessToken}`;
                    resolve(makeRequest(customConfig));
                }
            }, RETRY_TIMEOUT);
        });
    }
    // Retry end

    return Promise.reject(httpError);
};

instance.interceptors.request.use(onRequest, onErrorResponse);

instance.interceptors.response.use(onResponse, onErrorResponse);

const makeRequest = async <Response = unknown>({
    url = '/',
    method = 'GET',
    params = {},
    data = undefined,
    headers = {},
    useXAccountId = false,
    isSecure = false,
    ...otherParams
}: AxiosRequestConfig & {
    useXAccountId?: boolean;
    isSecure?: boolean;
    // Прикольнее возращать AxiosResponse
}): Promise<Response> => {
    const baseUrl = `${appConfig.auth.baseUrl}`;
    headers['accept'] = 'application/json, text/plain, */*';

    headers['User-Agent'] = getUserAgent();

    if (!headers['authorization'] && appConfig.auth.accessToken) {
        headers['authorization'] = `Bearer ${appConfig.auth.accessToken}`;
    }

    // Используется только в старых ручках
    if (useXAccountId) {
        headers['X-ACCOUNT-ID'] = `${appConfig.account.accountUuid}`;
    }

    if (isSecure) {
        const secureHeader = await getSecureRequestHeader(`${baseUrl}/${url}`, {
            url,
            method,
            params,
            data,
            headers,
        });
        Object.entries(secureHeader).forEach(([key, value]) => {
            headers[key] = value;
        });
    }

    return instance({
        url,
        method,
        params,
        data,
        headers,
        baseURL: `${appConfig.auth.baseUrl}`,
        paramsSerializer: (_params) => qs.stringify(_params, { arrayFormat: 'repeat' }),
        ...otherParams,
    }) as Promise<Response>;
};

class ApiClient {
    getDomain = () => appConfig.auth.baseUrl;

    getAgreementLink = () => 'https://hi.setka.ru/agreement';

    getPersonalDataLink = () => 'https://hh.ru/article/personal_data';

    getRulesLink = () => 'https://hi.setka.ru/rules';

    getHHLink = () => 'https://hh.ru';

    getLicenceLink = () => 'https://hi.setka.ru/licenses';

    getCrosspostingLink = () => 'https://hub.setka.ru/teleport/';

    _getApiUrl = () => {
        return `${this.getDomain()}/`;
    };

    request = async <R extends unknown>(
        config: AxiosRequestConfig,
        useXAccountId: boolean = false,
        isSecure: boolean = false,
    ) => {
        return makeRequest<R>({ ...config, useXAccountId, isSecure });
    };

    getImageUrl = (upload_id: string) => {
        const apiUrl = this._getApiUrl();

        return `${apiUrl}uploads/${upload_id}`;
    };

    imageUpload = async ({
        uploadedImage,
        onUploadProgress,
        options,
        requestConfig,
    }: {
        uploadedImage: Attachment;
        onUploadProgress?: (uploadedImage: Attachment, loadPersentPath: number) => void;
        options?: ImageUploadOptions;
        requestConfig?: Pick<AxiosRequestConfig, 'url' | 'method'>;
    }) => {
        return Promise.resolve({} as UploadFileResponse);
        // const bodyFormData = new FormData();

        // const { format = 'PNG', quality = 70 } = options || {};

        // const handleUploadProgress = (event: UploadEvent) => {
        //     if (onUploadProgress) {
        //         onUploadProgress(uploadedImage, Math.round((event.loaded / event.total) * 100) / 100);
        //     }
        // };

        // const { resizedImage } = await imageResize({ image: uploadedImage, format, quality });

        // const base64 = await ReactNativeBlobUtil.fs.readFile(resizedImage.path, 'base64');
        // const dataUrl = `data:image/${format.toLowerCase()};base64,${base64}`;

        // bodyFormData.append('dataurl', dataUrl);

        // const config = {
        //     url: 'v1/uploads',
        //     method: 'put',
        //     data: bodyFormData,
        //     headers: {
        //         'Content-Type': 'multipart/form-data;',
        //     },
        //     onUploadProgress: handleUploadProgress,
        //     ...requestConfig,
        // };

        // return this.request<UploadFileResponse>(config);
    };

    imageBlobUpload = async <T>(
        uploadedImage: Attachment,
        options?: ImageUploadOptions,
        requestConfig?: Pick<AxiosRequestConfig, 'url' | 'method'>,
    ) => {
        const image = new FormData();

        const { format = 'PNG', quality = 70 } = options || {};

        const { resizedImage } = await imageResize({ image: uploadedImage, format, quality });

        image.append('file', {
            uri: resizedImage.uri,
            name: resizedImage.name,
            type: 'image/png',
        } as unknown as Blob);

        const config = {
            data: image,
            ...requestConfig,
        };

        return this.request<T>(config);
    };
}

export default new ApiClient();
