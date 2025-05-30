import { useRef } from 'react';

import { generateUniqueId } from '@/shared/lib/utils/generate-unique-id.util';

class UniqueBuffer<T> {
    private items: Map<string, T> = new Map();

    add = (item: T, getItemId: (item: T) => string = generateUniqueId) => {
        const itemId = getItemId(item);

        if (this.has(itemId)) {
            return;
        }

        this.items.set(getItemId(item), item);
    };

    flushAll = () => {
        this.items.clear();
    };

    getAll = () => Array.from(this.items.values());

    has = (id: string) => this.items.has(id);

    mutateAll = (mutator: (item: T) => T) => {
        this.items = new Map(Array.from(this.items.entries()).map(([key, value]) => [key, mutator(value)]));
    };
}

export const useUniqueBuffer = <T>() => {
    const buffer = useRef(new UniqueBuffer<T>()).current;

    return buffer;
};
