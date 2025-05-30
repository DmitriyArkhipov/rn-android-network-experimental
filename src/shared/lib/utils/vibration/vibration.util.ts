import RNHF from 'react-native-haptic-feedback';

import { isIos } from '../platform-detection.util';

export const vibration = {
    // На некоторых Android устройствах не срабатывает impactLight, поэтому использую rigid, который немного мощнее
    light: () => RNHF.trigger(isIos ? 'impactLight' : 'rigid'),
    medium: () => RNHF.trigger('impactMedium'),
    heavy: () => RNHF.trigger('impactHeavy'),
};
