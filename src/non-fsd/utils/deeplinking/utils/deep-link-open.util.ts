import { validate as uuidValidate } from 'uuid';

import getStore from '@/app/model';

import { NetworkSources } from '@/pages/screens/network-details/types/networks.types';
import { ProfileEditTab } from '@/pages/screens/profile-edit/profile-edit.constants';

import { changeTestDomain } from '@/features/settings/lib/utils/change-test-domain.util';

import { CommunityListTypes } from '@/entities/communities/lib/community-list-types.constants';
import { PostType } from '@/entities/posts/lib/post-type.constants';
import { RelationDirectionType } from '@/entities/relationship-strength/lib/relation-direction-types.constants';

import config, { setEventFeedType } from '@/shared/api/config/config.util';
import { FeatureFlag } from '@/shared/lib/services/feature-flags/feature-flags.constants';
import { runFeature } from '@/shared/lib/services/feature-flags/utils/run-feature.util';
import { without } from '@/shared/lib/services/lodash.util';
import { EmitterEvents } from '@/shared/lib/utils/emitter/emitter.constants';
import emitterUtil from '@/shared/lib/utils/emitter/emitter.util';

import { type ProfileInput } from '@/navigation/navigation.types';
import { navigate, push } from '@/navigation/navigation-methods.util';
import { Screens } from '@/navigation/screens.constants';

import { EventFeedType, PostViewSource } from '@/non-fsd/services/analytics/analytics.constants';
import { handleQuickAuth } from '@/non-fsd/utils/auth-login.util';

import { AVAILABLE_URLS, Links, YANDEX_DEEP_LINK_DOMAIN } from '../external-links-listener.constants';

type NetworkPayload = {
    networkId?: string;
};

type FeedScheme = {
    link: Links.FEED;
    payload: {
        initialTab: 'questions' | 'subscriptions' | 'recommendations';
    };
};

type Payload = {
    id?: string;
    inviteId?: string;
    selectedTab?: string;
    scrollToId?: string;
    initialPostId?: string;
    domainUrl?: string;
    phoneNumber?: string;
    otpCode?: string;
} & NetworkPayload;

export type OpenScheme = {
    link: Exclude<Links, Links.FEED>;
    payload: Payload;
};

export const deepLinkOpenCreatePost = (domainUrl: string) => {
    const searchParams = new URLSearchParams(domainUrl.split('?')[1]);
    const postTypeParam = searchParams.get('type');
    const postResumeHashParam = searchParams.get('resume_hash') ?? undefined;
    const isJobPost = runFeature(FeatureFlag.SETKA_8849_resume_vacancy_post, true, false);

    if (!postTypeParam) {
        return;
    }

    switch (postTypeParam.toUpperCase()) {
        case PostType.RESUME: {
            if (isJobPost) {
                push(Screens.CREATE_JOB_POST, {
                    postType: PostType.RESUME,
                    resumeHash: postResumeHashParam,
                });
            }
            break;
        }
        case PostType.VACANCY: {
            if (isJobPost) {
                push(Screens.CREATE_JOB_POST, {
                    postType: PostType.VACANCY,
                });
            }
            break;
        }
        case PostType.QUESTION: {
            push(Screens.CREATE_QUESTION, {});
            break;
        }
        case PostType.REGULAR: {
            push(Screens.CREATE_POST, {});
            break;
        }
        default:
            break;
    }
};

export const deepLinkOpenUtil = (scheme: OpenScheme | FeedScheme) => {
    const { link, payload } = scheme;

    const store = getStore();
    const state = store?.getState();
    const dispatch = store?.dispatch;

    const authToken = config.auth.accessToken;

    if (link === Links.CHANGE_TEST_DOMAIN && !!payload.domainUrl) {
        changeTestDomain(dispatch, payload.domainUrl!);

        return;
    }

    if (!authToken) {
        if (link === Links.AUTH && payload.phoneNumber && payload.otpCode) {
            handleQuickAuth(payload.phoneNumber, payload.otpCode);
        }

        return;
    }

    switch (link) {
        case Links.POST:
        case Links.CHANNEL: {
            setEventFeedType(EventFeedType.PUSH);
            push(Screens.COMMENTS, {
                channelId: payload.id!,
                eventFeedType: EventFeedType.PUSH,
                scrollToId: payload.scrollToId,
                viewSource: PostViewSource.LINK,
            });
            break;
        }
        case Links.COMMUNITY: {
            push(Screens.COMMUNITY, { communityId: payload.id!, initialPostId: payload.initialPostId });
            break;
        }
        case Links.PRIVATE_COMMUNITY: {
            push(Screens.COMMUNITY, { communityId: payload.id!, inviteId: payload.inviteId });
            break;
        }
        case Links.PROFILE: {
            const isMyProfile = [state?.profile.account?.id, state?.profile.account?.uuid].includes(payload.id);

            if (isMyProfile) {
                push(Screens.PROFILE, { enableBackButton: true });
            } else {
                const isUuid = uuidValidate(payload.id!);
                const idField: keyof Pick<ProfileInput, 'uuid' | 'id'> = isUuid ? 'uuid' : 'id';
                push(Screens.OTHER_PROFILE, { [idField]: payload.id!, initialPostId: payload.initialPostId });
            }
            break;
        }
        case Links.COMMUNITIES: {
            let initialCommunityTab;

            switch (payload.selectedTab) {
                case 'subscriptions':
                    initialCommunityTab = CommunityListTypes.SUBSCRIPTIONS;
                    break;
                default:
                    initialCommunityTab = CommunityListTypes.RECOMENDATIONS;
            }

            navigate(Screens.SUBSCRIPTIONS_TAB, {
                screen: Screens.COMMUNITY_LIST,
                params: { initialCommunityTab },
            });
            break;
        }
        case Links.CHATS: {
            navigate(Screens.MESSAGES_TAB, {
                screen: Screens.CHAT_LIST,
            });
            break;
        }
        case Links.EDIT_PROFILE: {
            const initialTab =
                payload.selectedTab === 'work_experience' ? ProfileEditTab.WorkExperience : ProfileEditTab.PersonalInfo;

            push(Screens.PERSONAL_FORM_STACK, { initialTab });
            break;
        }
        case Links.FOLLOW_BACK: {
            push(Screens.FOLLOW_BACK);
            break;
        }
        case Links.FOLLOWERS: {
            push(Screens.RELATIONS_LIST, {
                accountUuid: state?.profile.account?.uuid,
                accountId: state?.profile.account?.id,
                direction: RelationDirectionType.TO,
            });
            break;
        }
        case Links.NETWORKS: {
            const { networkId } = payload;
            if (networkId) {
                push(Screens.NETWORK_FEED, {
                    networkId,
                    source: NetworkSources.DEEPLINK,
                });
            }
            break;
        }
        case Links.PROFILE_VIEWS: {
            const isFeatureFlagEnabled = runFeature(FeatureFlag.SETKA_8216_profile_views, true, false);
            if (isFeatureFlagEnabled) {
                push(Screens.PROFILE_VIEWS);
            }

            break;
        }
        case Links.CREATE_POST: {
            if (payload?.domainUrl) {
                deepLinkOpenCreatePost(payload?.domainUrl);
            }

            break;
        }
        case Links.FEED: {
            const { initialTab } = payload;
            navigate(Screens.FEED);
            emitterUtil.emit(EmitterEvents.FEED_TAB_DEEPLINK_UPDATE, { initialTab });
            break;
        }
        case Links.JOIN_COMMUNITY: {
            const { id } = payload;
            if (id) {
                navigate(Screens.JOIN_REQUESTS, { communityId: id });
            }
            break;
        }
        default:
            break;
    }
};

export const isAppFlyerLink = (link: string) => /^https:\/\/setka.onelink.me.*$/.test(link);

export const openUniversalLinkInEmbeddedBrowser = async (link: string) => {
    const urlFormatted = new URL(link);
    const availableUrlsEmbeddedBrowser = without(AVAILABLE_URLS, YANDEX_DEEP_LINK_DOMAIN);
    const embeddedBrowserRegex = new RegExp(`${availableUrlsEmbeddedBrowser.join('|')}.$`);
    const isAllowed =
        embeddedBrowserRegex.test(link) &&
        link.startsWith('https') &&
        availableUrlsEmbeddedBrowser.includes(urlFormatted?.hostname);

    if (!isAllowed || urlFormatted?.pathname?.trim() === '/' || !urlFormatted?.pathname) {
        return;
    }

    const response = await fetch(link);

    if (response.ok) {
        push(Screens.WEB_VIEW, { url: link, incognito: true, isVotingBoard: false });
    }
};
