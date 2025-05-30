// import { type FeatureFlag } from '@/shared/lib/services/feature-flags/feature-flags.constants';

// import { type EventFeedType } from '@/non-fsd/services/analytics/analytics.constants';
// import { type FeedListType } from '@/non-fsd/views/feed-list/feed-list.types';

export const BASE_URL_PROD = 'https://api.setka.ru';

interface Config {
    auth: {
        refreshToken: string | null;
        accessToken: string | null;
        baseUrl: string;
        isTestApi: boolean;
        isSAPEnabled: boolean;
    };
    settings: {
        appMetricaDeviceId: string | null;
        vendorDeviceId: string | null;
        isAppFirstStarted: boolean | null;
    };
    account: {
        accountId: string | null;
        accountUuid: string | null;
    };
    analytics: {
        /**
         * Хранит идентификатор активного на текущий момент фида.
         * Необходим для определения конкретного места отправки события в аналитике
         */
        eventFeedType: any | null;

        /**
         * Хранит текущий тип фида на главной странице
         */
        currentFeedListType: any | null;

        /**
         * Хранит идентификаторы фидов на главной странице
         */
        feedListIds: { [key in any]?: string };
    };
    featureFlagsDevSwitcher: {
        flags: {
            [key in string]?: boolean;
        };
    };
    session: {
        sessionId: string | null;
    };
}

/**
 * Config is collect current state of app.
 * To get `something` use getters instead of directly `config.something`
 * */
const config: Config = {
    auth: {
        refreshToken: null,
        accessToken: null,
        baseUrl: BASE_URL_PROD,
        isTestApi: false,
        isSAPEnabled: false,
    },
    settings: {
        appMetricaDeviceId: null,
        vendorDeviceId: null,
        isAppFirstStarted: null,
    },
    account: {
        accountId: null,
        accountUuid: null,
    },
    analytics: {
        eventFeedType: null,
        currentFeedListType: null,
        feedListIds: {},
    },
    featureFlagsDevSwitcher: {
        flags: {},
    },
    session: {
        sessionId: null,
    },
};

// AUTH
export const setAccessAndRefreshTokens = (token: string | null, refreshToken: string | null): void => {
    config.auth.accessToken = token;
    config.auth.refreshToken = refreshToken;
};

export const setIsSAPEnabled = (isSAPEnabled: boolean): void => {
    config.auth.isSAPEnabled = isSAPEnabled;
};

export const setBaseUrl = (baseUrl: string): void => {
    config.auth.baseUrl = baseUrl;
};

export const setIsTestApi = (isTestApi: boolean) => {
    config.auth.isTestApi = isTestApi;
};

// SETTINGS

export const setSettings = (settings: Config['settings']) => {
    config.settings = settings;
};

// ACCOUNT
export const setAccountId = (id: string | null) => {
    config.account.accountId = id;
};

export const setAccountUuid = (uuid: string | null) => {
    config.account.accountUuid = uuid;
};

// SESSION

export const setSessionId = (id: string | null) => {
    config.session.sessionId = id;
};

// ANALYTICS
export const setEventFeedType = (eventFeedType: any) => {
    config.analytics.eventFeedType = eventFeedType;
};

export const setCurrentFeedListType = (currentFeedListType: Maybe<any>) => {
    config.analytics.currentFeedListType = currentFeedListType ?? null;
};

export const setFeedListId = (feedListType: any, feedListId: string) => {
    config.analytics.feedListIds[feedListType] = feedListId;
};

export const getEventFeedType = () => {
    if (__DEV__ && config.analytics.eventFeedType === null) {
        throw new Error('config.analytics.eventFeedType === null');
    }

    return config.analytics.eventFeedType as any;
};

export const setFeatureFlagsDevSwitcherFlags = (flags: Config['featureFlagsDevSwitcher']['flags']) => {
    config.featureFlagsDevSwitcher.flags = flags;
};

export const getFeatureFlagsDevSwitcherFlag = (flag: any) => {
    return config.featureFlagsDevSwitcher.flags[flag];
};

export default config;
