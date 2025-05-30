import { useEffect } from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

import { prefetch } from '@/shared/ui/components/image/lib/prefetch.util';

import { FeatureFlag } from '../services/feature-flags/feature-flags.constants';
import { useFeature } from '../services/feature-flags/hooks/use-feature.hooks';
import { isIos } from '../utils/platform-detection.util';

export const useImagePreloading = (sources: string[], isEnabled: boolean = true) => {
    const isFasterImageEnabled = useFeature(FeatureFlag.SETKA_9152_faster_image, true, false);

    useEffect(() => {
        if (!isEnabled) {
            return;
        }

        if (isFasterImageEnabled) {
            prefetch(sources);

            return;
        }

        if (isIos) {
            FastImage.preload(sources.map((uri) => ({ uri })));
        } else {
            sources.forEach((uri) => Image.prefetch(uri));
        }
    }, [sources, isEnabled, isFasterImageEnabled]);
};
