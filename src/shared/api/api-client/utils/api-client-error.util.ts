import { type HttpStatusCode } from '../../http-status-code.types';

import { type HttpError } from './http-error';

export const getErrorHttpStatus = (error: HttpError) => error.response?.status;

export const checkErrorHttpStatus = (error: HttpError, status: HttpStatusCode) => getErrorHttpStatus(error) === status;
