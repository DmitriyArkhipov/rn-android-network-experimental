import { NativeModules } from 'react-native';

import { isIos } from '@/shared/lib/utils/platform-detection.util';

export const isCatalyst = isIos ? NativeModules['CatalystModule']?.isCatalyst : false;
