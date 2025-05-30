export const calculateBorderRadiusAndMargin = (index: number, attachesCount: number) => {
    if (attachesCount === 2 || attachesCount === 3) {
        return {
            borderTopLeftRadius: index === 0 ? 0 : 2,
            borderTopRightRadius: index === 0 ? 2 : 0,
            borderBottomLeftRadius: index === 0 ? 0 : 2,
            borderBottomRightRadius: index === 0 ? 2 : 0,
            marginRight: index === 0 ? 2 : 0,
            marginTop: index === 2 ? 2 : 0,
        };
    }

    if (attachesCount === 4) {
        return {
            borderTopLeftRadius: index === 0 || index === 2 ? 0 : 2,
            borderTopRightRadius: index === 0 || index === 2 ? 2 : 0,
            borderBottomLeftRadius: index === 0 || index === 2 ? 0 : 2,
            borderBottomRightRadius: index === 0 || index === 2 ? 2 : 0,
            marginRight: index === 0 || index === 2 ? 2 : 0,
            marginTop: index > 1 ? 2 : 0,
        };
    }

    if (attachesCount === 6) {
        return {
            borderTopLeftRadius: index === 0 || index === 3 ? 0 : 2,
            borderTopRightRadius: index === 2 || index === 5 ? 0 : 2,
            borderBottomLeftRadius: index === 0 || index === 3 ? 0 : 2,
            borderBottomRightRadius: index === 2 || index === 5 ? 2 : 0,
            marginRight: index === 2 || index === 5 ? 0 : 2,
            marginTop: index > 2 ? 2 : 0,
        };
    }

    return {
        borderTopLeftRadius: index === 0 || index === 2 ? 0 : 2,
        borderTopRightRadius: index === 1 || index === attachesCount - 1 ? 0 : 2,
        borderBottomLeftRadius: index === 0 || index === 2 ? 0 : 2,
        borderBottomRightRadius: index === 1 || index === attachesCount ? 0 : 2,
        marginRight: index === attachesCount - 1 || index === 1 ? 0 : 2,
        marginTop: index > 1 ? 2 : 0,
    };
};
