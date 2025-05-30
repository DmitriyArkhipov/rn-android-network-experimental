import { Platform } from 'react-native';

import { isAndroid } from './platform-detection.util';

export const isAndroid13OrHigher = isAndroid && +Platform.Version >= 33;
