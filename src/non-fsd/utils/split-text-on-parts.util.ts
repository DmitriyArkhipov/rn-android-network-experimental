export enum TextPartType {
    link = 'link',
    hashtag = 'hashtag',
}

export type TextPart = {
    text: string;
    type?: TextPartType;
};

const regex =
    /(^|\s)(?!]\()(#[a-zA-Zа-яА-ЯёЁ\d-_]{2,30}|https?:\/\/[a-zA-Z0-9+&@#/%?='()*$\-~_|!:,.;]*[a-zA-Z0-9+&@#/%=~_|])(?!\))/;

export const splitTextOnParts = (text: string): Array<TextPart> => {
    const parts: Array<TextPart> = [];

    let textToSplit = text;

    while (textToSplit) {
        const matches = textToSplit.match(regex);
        const index = textToSplit.search(regex);

        if (index === 0 && matches) {
            const match = matches[2] || matches[0]!;

            if (matches[0]?.startsWith(' ')) {
                parts.push({ text: ' ' });
            }

            if (matches[0]?.startsWith('\n')) {
                parts.push({ text: '\n' });
            }

            if (match.startsWith('http')) {
                parts.push({ text: match, type: TextPartType.link });
            } else {
                parts.push({ text: match, type: TextPartType.hashtag });
            }

            textToSplit = textToSplit.slice(matches[0]?.length);
        } else if (index > 0) {
            if (matches && matches[0]?.startsWith('http')) {
                parts.push({ text: textToSplit.slice(0, index) });
                textToSplit = textToSplit.slice(index);
            } else {
                parts.push({ text: textToSplit.slice(0, index + 1) });
                textToSplit = textToSplit.slice(index + 1);
            }
        } else {
            parts.push({ text: textToSplit });
            textToSplit = '';
        }
    }

    return parts;
};
