import { getRequestPropAndDateHashSum } from './create-sync-hash.utils';

const ONE_MINUTE = 60 * 1000;

describe('getRequestPropAndDateHashSum', () => {
    const baseUrl = 'https://example.com/api/test';

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
        jest.clearAllTimers();
    });

    it('should generate a non-empty base64 string', () => {
        const hash = getRequestPropAndDateHashSum(baseUrl, { a: 1, b: 'test' });

        expect(typeof hash).toBe('string');
        expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for different URLs', () => {
        const hash1 = getRequestPropAndDateHashSum('https://example.com/api/one', { a: 1 });
        const hash2 = getRequestPropAndDateHashSum('https://example.com/api/two', { a: 1 });

        expect(hash1).not.toBe(hash2);
    });

    it('should generate different hashes for different data', () => {
        const hash1 = getRequestPropAndDateHashSum(baseUrl, { x: 123 });
        const hash2 = getRequestPropAndDateHashSum(baseUrl, { x: 456 });

        expect(hash1).not.toBe(hash2);
    });

    it('should generate the same hash for same inputs at same time', () => {
        const hash1 = getRequestPropAndDateHashSum(baseUrl, { a: 'static' });
        const hash2 = getRequestPropAndDateHashSum(baseUrl, { a: 'static' });

        expect(hash1).toBe(hash2);
    });

    it('should generate the different hash for same inputs at 1 minute different', () => {
        const hash1 = getRequestPropAndDateHashSum(baseUrl, { a: 'static' });

        jest.advanceTimersByTime(ONE_MINUTE);

        const hash2 = getRequestPropAndDateHashSum(baseUrl, { a: 'static' });

        expect(hash1).not.toBe(hash2);
    });

    it('should handle empty data gracefully', () => {
        const hash = getRequestPropAndDateHashSum(baseUrl);

        expect(typeof hash).toBe('string');
        expect(hash.length).toBeGreaterThan(0);
    });
});
