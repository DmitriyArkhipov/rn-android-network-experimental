export const matchAll = (pattern: RegExp, haystack: string) => {
    const regex = new RegExp(pattern, 'g');
    const matches: Array<string> = [];

    const matchResult = haystack.match(regex);

    if (matchResult) {
        matchResult.forEach((item, index) => {
            if (item) {
                const match = item.match(new RegExp(pattern));
                if (match && match[0]) {
                    matches[index] = match[0].trim();
                }
            }
        });
    }

    return matches;
};

export const capitalize = <T extends string>(text: T): Capitalize<T> =>
    text.toLowerCase().replace(/(^|[\s-])\S/g, (match) => match.toUpperCase()) as Capitalize<T>;
