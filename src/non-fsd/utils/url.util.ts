import { Linking } from 'react-native';

import { isAndroid } from '@/shared/lib/utils/platform-detection.util';

import { push } from '@/navigation/navigation-methods.util';
import { Screens } from '@/navigation/screens.constants';

import { isVotingBoardLink } from '@/non-fsd/utils/voting-board/voting-board.util';

import DeepLinking from './deeplinking/utils/deep-linking.util';

export const openUrl = async (url: string) => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
        return;
    }

    const longURL = await DeepLinking.getLongLink(trimmedUrl);
    const solved = DeepLinking.evaluateUrl(longURL);

    if (solved) {
        return;
    }

    if (isVotingBoardLink(trimmedUrl)) {
        push(Screens.WEB_VIEW, { url: trimmedUrl, incognito: true, isVotingBoard: true });

        return;
    }

    if (trimmedUrl.startsWith('https')) {
        push(Screens.WEB_VIEW, { url: trimmedUrl });
    } else {
        await Linking.openURL(trimmedUrl);
    }
};

export const cleanUrl = (url: string) => {
    const cleanUrlRegex = /^(.*?)\?.*$/;

    const match = url.match(cleanUrlRegex);

    if (match && match.length > 1) {
        return match[1] ?? '';
    }

    return url;
};

export const canOpenURL = async (url: string): Promise<boolean> => {
    if (!url) {
        return Promise.resolve(false);
    }

    const isSupported = await Linking.canOpenURL(url);

    if (isAndroid) {
        const isAndroidSupported = __DEV__ || !!process.env['CI_TEST'] || isSupported;

        return Promise.resolve(isAndroidSupported);
    }

    return Promise.resolve(isSupported);
};

export const openLinkExternally = async (url: string) => {
    const isSupported = await canOpenURL(url);

    if (isSupported) {
        await Linking.openURL(url);
    }
};
