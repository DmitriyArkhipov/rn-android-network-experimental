export const counterShorterUtil = (count: number) => {
    if (count >= 1000000) {
        return `${(Math.round(count / 1000) / 1000).toString().replace('.', ',')}M`;
    }

    if (count >= 1000) {
        return `${(Math.round(count / 100) / 10).toString().replace('.', ',')}К`;
    }

    return `${count}`;
};
