import { Linking } from 'react-native';
import { openBrowser, type Options } from '@swan-io/react-native-browser';
import axios from 'axios';

import { getDynamicWhitelistUrlRegex } from '@/shared/lib/utils/get-dynamic-whitelist-url-regex.util';

import { push } from '@/navigation/navigation-methods.util';
import { Screens } from '@/navigation/screens.constants';

import DeepLinking from '@/non-fsd/utils/deeplinking/utils/deep-linking.util';
import { isVotingBoardLink } from '@/non-fsd/utils/voting-board/voting-board.util';

const WHITE_LIST_REGEX = getDynamicWhitelistUrlRegex();

// для inAppBrowser андроида нужен именно https без заглавных букв
const getFormattedUrl = (url: string) => {
    const formattedUrl = url
        .trim()
        .split('://')
        .map((part, index) => {
            if ((part.toLowerCase() === 'https' || part.toLowerCase() === 'http') && !index) {
                return part.toLowerCase();
            }

            return part;
        })
        .join('://');

    return formattedUrl;
};

export const canOpenHttpsInside = async (url: string): Promise<boolean> => {
    try {
        await axios.get(url, { responseType: 'document' });

        return await Promise.resolve(true);
    } catch (err) {
        return Promise.resolve(false);
    }
};

export const openInAppBrowser = async (url: string, options: Options) => {
    try {
        await openBrowser(url, options);
    } catch {
        Linking.openURL(url);
    }
};

export const openUrl = async (url: string, openWithoutWarning = false) => {
    const trimmedUrl = getFormattedUrl(url);
    const longURL = await DeepLinking.getLongLink(trimmedUrl);
    const solved = DeepLinking.evaluateUrl(longURL);

    const isNeedOpen = !solved && trimmedUrl;

    const isWhiteListLink = !!trimmedUrl.match(WHITE_LIST_REGEX)?.length;
    const isSafeLink = openWithoutWarning || isWhiteListLink;

    if (!isNeedOpen) {
        return;
    }

    if (isVotingBoardLink(trimmedUrl)) {
        push(Screens.WEB_VIEW, { url: trimmedUrl, incognito: true, isVotingBoard: true });

        return;
    }

    if (isSafeLink) {
        openInAppBrowser(trimmedUrl, {});

        return;
    }

    push(Screens.BROWSER_OPEN_WARNING, { url: trimmedUrl });
};
