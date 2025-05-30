export const isServerError = (status?: number) => status && status >= 500 && status < 600;
