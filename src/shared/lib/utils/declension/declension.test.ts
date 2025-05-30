import { getDeclension } from './declension.util';

describe('declension', () => {
    const appleDeclensions: [string, string, string] = ['яблоко', 'яблока', 'яблок'];

    test('1', () => {
        const value = getDeclension(1, appleDeclensions);
        expect(value).toBe('яблоко');
    });
    test('2', () => {
        const value = getDeclension(2, appleDeclensions);
        expect(value).toBe('яблока');
    });
    test('5', () => {
        const value = getDeclension(5, appleDeclensions);
        expect(value).toBe('яблок');
    });
    test('10', () => {
        const value = getDeclension(10, appleDeclensions);
        expect(value).toBe('яблок');
    });
    test('11', () => {
        const value = getDeclension(11, appleDeclensions);
        expect(value).toBe('яблок');
    });
    test('21', () => {
        const value = getDeclension(21, appleDeclensions);
        expect(value).toBe('яблоко');
    });
    test('24', () => {
        const value = getDeclension(24, appleDeclensions);
        expect(value).toBe('яблока');
    });
    test('27', () => {
        const value = getDeclension(27, appleDeclensions);
        expect(value).toBe('яблок');
    });
});
