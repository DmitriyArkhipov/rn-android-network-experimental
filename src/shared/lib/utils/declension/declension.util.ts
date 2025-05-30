import { type DECLENSIONS, DECLENSIONS_MAP } from './declensions.constants';

export const declensionUtil = (number: number, declension: DECLENSIONS): string =>
    getDeclension(number, DECLENSIONS_MAP[declension]);

export function getDeclension(number: number, parts: [string, string, string]): string {
    const tens = Math.abs(number) % 100;
    const ones = tens % 10;

    if (tens > 10 && tens < 20) {
        return parts[2]; // Родительный падеж (яблок)
    }
    if (ones > 1 && ones < 5) {
        return parts[1]; // От 2 до 4 (яблока)
    }
    if (ones === 1) {
        return parts[0]; // Единственное число (яблоко)
    }

    return parts[2]; // Родительный падеж (яблок)
}
