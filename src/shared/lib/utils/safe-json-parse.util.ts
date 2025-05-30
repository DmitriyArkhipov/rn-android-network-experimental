export const safeJsonParse = (data: unknown) => {
    try {
        return JSON.parse(data as string);
    } catch (e) {
        return data;
    }
};
