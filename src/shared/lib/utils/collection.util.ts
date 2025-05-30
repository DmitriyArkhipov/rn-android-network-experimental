export const getIds = <T extends { id: string }>(items: T[]) => {
    return items.map((item) => item.id);
};
