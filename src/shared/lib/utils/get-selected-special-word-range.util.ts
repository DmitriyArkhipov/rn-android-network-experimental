import { type TextInputSelectionChangeEventData } from 'react-native';

import { RegExpConstants } from '@/shared/lib/constants/regex.constants';

const isWordSymbol = (symbol: string): boolean => {
    return !!symbol.match(RegExpConstants.lettersAndNumbersRegex)?.length;
};

export const getSelectedSpecialWordRange = (
    text: string,
    specialSymbol: string,
    selection: React.MutableRefObject<TextInputSelectionChangeEventData['selection']>,
): [number, number] | null => {
    let { start, end } = selection.current;
    const selectedText = text.slice(start, end);
    if (selectedText.includes(' ') || selectedText.includes('\n')) {
        return null;
    }

    while (start > 0) {
        const currentSymbol = text.charAt(start);
        if (currentSymbol === specialSymbol) {
            break;
        }
        start -= 1;
        if (!isWordSymbol(text.charAt(start))) {
            break;
        }
    }

    if (text.charAt(start) !== specialSymbol) {
        return null;
    }

    while (end < text.length) {
        const currentSymbol = text.charAt(end);
        if (!isWordSymbol(currentSymbol)) {
            break;
        }
        end += 1;
    }

    return [start, end];
};
