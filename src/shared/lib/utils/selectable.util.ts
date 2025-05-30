import type { Selectable } from '../types/selectable.types';

export const getIsAllItemsSelected = <T extends Selectable>(items: T[]) => items.every((item) => item.selected);

export const getSelectedCount = <T extends Selectable>(current: T[]) => current.filter((item) => item.selected).length;

export const toggleSelected = <T extends Selectable>(current: T[], id: string) => {
    return current.map((item) => {
        if (item.id === id) {
            return {
                ...item,
                selected: !item.selected,
            };
        }

        return item;
    });
};

export const markItemsAsSelected = <T extends Selectable>(items: T[], selected = true): (T & Selectable)[] => {
    return items.map((item) => ({
        ...item,
        selected,
    }));
};
