import { Layout } from '@/shared/lib/utils/layout/layout-dimensions.constants';

type DevicesTypesValues = {
    mini: number;
    base: number;
    max: number;
};

export const deviceWidthSpecValue = (deviceTypes: DevicesTypesValues): number => {
    if (Layout.window.width <= 375) {
        return deviceTypes.mini;
    }
    if (Layout.window.width <= 393) {
        return deviceTypes.base;
    }

    return deviceTypes.max;
};
