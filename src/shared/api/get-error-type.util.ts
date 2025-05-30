export enum ErrorType {
    NETWORK = 'NETWORK',
    UNEXPECTED = 'UNEXPECTED',
}
export const getErrorType = (errorMessage: string) => {
    if (errorMessage === 'Network Error') {
        return ErrorType.NETWORK;
    }

    return ErrorType.UNEXPECTED;
};
