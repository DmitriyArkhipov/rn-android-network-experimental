import { useCallback, useState } from 'react';
import { NativeModules } from 'react-native';
import { useAsync } from 'react-use';

import { MB_IN_BYTE } from '../constants/memory.constants';
import { isIos } from '../utils/platform-detection.util';

const { MemoryModule } = NativeModules;

const MIN_MEMORY = MB_IN_BYTE * 500;

export const usePhotoAvailability = () => {
    const [isAndroidMemoryAvailable, setIsAndroidMemoryAvailable] = useState(false);

    const checkAndroidMemoryAvailability = useCallback(async () => {
        const freeRam = await MemoryModule.getMemoryInfo();
        setIsAndroidMemoryAvailable(freeRam.freeSpace > MIN_MEMORY);
    }, []);

    useAsync(checkAndroidMemoryAvailability);

    return {
        isMemoryAvailable: isIos || isAndroidMemoryAvailable,
    };
};
