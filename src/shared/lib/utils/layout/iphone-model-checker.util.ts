import { Platform } from 'react-native';

import { Layout } from './layout-dimensions.constants';

const { width, height } = Layout.window;

// https://useyourloaf.com/blog/iphone-14-screen-sizes
export const isIphone14ProSeries = (): boolean =>
    (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV && height === 852 && width === 393) || // iPhone 14 Pro
    (height === 932 && width === 430); // iPhone 14 Pro Max

export const isIphone12Series = (): boolean =>
    (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV && height === 844 && width === 390) || // iPhone 12/12 Pro
    (height === 926 && width === 428); // iPhone 12 Pro Max

export const isIphoneXorNewer = (): boolean =>
    (Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTV &&
        ((height === 812 && width === 375) || // iPhone X/Xs/11 Pro/12 mini
            (height === 896 && width === 414))) || // iPhone Xr/11/11 Pro Max/Xs Max
    isIphone12Series() ||
    isIphone14ProSeries();
