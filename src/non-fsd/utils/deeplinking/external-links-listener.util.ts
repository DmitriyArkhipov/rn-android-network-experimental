import { Linking } from 'react-native';
import qs from 'qs';

import getStore from '@/app/model';

import { MENTION_REGEXP } from '@/entities/mention/lib/constants/mention.constants';
import { setUTMMarks } from '@/entities/settings/model/settings.actions';

import { setSessionId } from '@/shared/api/config/config.util';
import { isStage } from '@/shared/lib/constants/env.constants';
import { RegExpConstants } from '@/shared/lib/constants/regex.constants';
import { generateUniqueId } from '@/shared/lib/utils/generate-unique-id.util';

import { ALLOWED_UTM_MARKS } from '@/non-fsd/services/analytics/analytics.constants';
import { canOpenURL } from '@/non-fsd/utils/url.util';

import { deepLinkOpenUtil, isAppFlyerLink, openUniversalLinkInEmbeddedBrowser } from './utils/deep-link-open.util';
import DeepLinking from './utils/deep-linking.util';
import { AVAILABLE_URLS, Links } from './external-links-listener.constants';

type LinkingEvent = { url: string };

class ExternalLinksListener {
    register = async () => {
        const store = getStore();

        try {
            const url = await Linking.getInitialURL();
            if (url) {
                store?.dispatch(setUTMMarks({ utm_source: 'non-native' }));
                await this.handleUrl({ url });
            } else {
                store?.dispatch(setUTMMarks({ utm_source: 'native' }));
            }

            Linking.addEventListener('url', this.handleUrl);

            this.registerUniversalLinks();
        } catch (e) {
            return Promise.resolve();
        }
    };

    handleQueryParams = (url: string) => {
        const splitUrl = url.split('?');

        if (splitUrl.length > 1) {
            const params = splitUrl[1]!;

            const parsedParams = qs.parse(params) as { [key: string]: string };

            Object.keys(parsedParams).forEach((param: string) => {
                if (!ALLOWED_UTM_MARKS.has(param)) {
                    delete parsedParams[param];
                }
            });

            const store = getStore();

            store?.dispatch(setUTMMarks(parsedParams));
            setSessionId(generateUniqueId());
        }
    };

    handleUrl = async ({ url }: LinkingEvent) => {
        const longURL = await DeepLinking.getLongLink(url);
        this.handleQueryParams(longURL);

        canOpenURL(longURL).then((supported: boolean) => {
            if (supported && !isAppFlyerLink(longURL)) {
                const solved = DeepLinking.evaluateUrl(longURL);
                if (!solved) {
                    openUniversalLinkInEmbeddedBrowser(longURL);
                }
            }
        });
    };

    registerUniversalLinks = () => {
        DeepLinking.addScheme('https://');
        DeepLinking.addScheme('setka://');

        AVAILABLE_URLS.forEach((domain: string) => {
            const channelRegex = new RegExp(`${domain}/channels/${RegExpConstants.uuidRegex}$`);
            const postRegex = new RegExp(
                `${domain}/posts/${RegExpConstants.uuidRegex}(/comment/${RegExpConstants.uuidRegex})?$`,
            );

            const communityRegex = new RegExp(
                `${domain}/communities/${RegExpConstants.uuidRegex}(/post/${RegExpConstants.uuidRegex})?$`,
            );

            const privateCommunityRegex = new RegExp(
                `${domain}/v1/communities/${RegExpConstants.uuidRegex}/invites/${RegExpConstants.uuidRegex}$`,
            );

            const profileRegex = new RegExp(`${domain}/accounts/([0-9]+)(/post/${RegExpConstants.uuidRegex})?$`);
            const userProfileRegex = new RegExp(
                `${domain}/users/(${RegExpConstants.uuidRegex}|[0-9]+)(/post/${RegExpConstants.uuidRegex})?$`,
            );

            const editProfileRegex = new RegExp(`${domain}/accounts/settings/(personal_data|work_experience)$`);

            const myProfileRegex = new RegExp(`${domain}/accounts/me$`);

            const communitiesRegex = new RegExp(`${domain}/communities/(recommendations|admin|subscriptions)$`);

            const feedRegex = new RegExp(`${domain}/feed/(questions|subscriptions|recommendations)$`);

            const chatsRegex = new RegExp(`${domain}/chats$`);

            const followBackRegex = new RegExp(`${domain}/follow_back$`);

            const followersRegex = RegExp(`${domain}/followers$`);

            const authRegex = new RegExp(`${domain}/auth/phone_number=([0-9]+)&otp_code=([0-9]+)$`);

            const profileViewsRegex = new RegExp(`${domain}/profile_views$`);

            const newtworksRegex = new RegExp(
                `${domain}/${Links.NETWORKS.toLowerCase()}/${RegExpConstants.uuidRegex}$`,
            );

            const changeTestDomainRegex = new RegExp(
                `${domain}/change_test_domain/${RegExpConstants.testDomainRegex}$`,
            );

            const createPostRegex = new RegExp(`${domain}/create_post.*$`);

            const joinCommunityRegex = new RegExp(`${domain}/communities/${RegExpConstants.uuidRegex}/join_requests`);

            DeepLinking.addRoute(channelRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.CHANNEL,
                    payload: {
                        id: match[1],
                    },
                });
            });

            DeepLinking.addRoute(postRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.POST,
                    payload: {
                        id: match[1],
                        scrollToId: match[3],
                    },
                });
            });

            DeepLinking.addRoute(communityRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.COMMUNITY,
                    payload: {
                        id: match[1],
                        initialPostId: match[3],
                    },
                });
            });

            DeepLinking.addRoute(privateCommunityRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.PRIVATE_COMMUNITY,
                    payload: {
                        id: match[1],
                        inviteId: match[2],
                    },
                });
            });

            DeepLinking.addRoute(communitiesRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.COMMUNITIES,
                    payload: {
                        selectedTab: match[1],
                    },
                });
            });

            DeepLinking.addRoute(chatsRegex, () => {
                deepLinkOpenUtil({
                    link: Links.CHATS,
                    payload: {},
                });
            });

            DeepLinking.addRoute(profileRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.PROFILE,
                    payload: {
                        id: match[1],
                        initialPostId: match[3],
                    },
                });
            });

            DeepLinking.addRoute(userProfileRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.PROFILE,
                    payload: {
                        id: match[1],
                        initialPostId: match[3],
                    },
                });
            });

            DeepLinking.addRoute(MENTION_REGEXP, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.PROFILE,
                    payload: {
                        id: match[1],
                    },
                });
            });

            DeepLinking.addRoute(editProfileRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.EDIT_PROFILE,
                    payload: {
                        selectedTab: match[1],
                    },
                });
            });

            DeepLinking.addRoute(myProfileRegex, () => {
                const accountId = getStore()?.getState().profile.account?.id ?? '';

                deepLinkOpenUtil({
                    link: Links.PROFILE,
                    payload: {
                        id: accountId,
                    },
                });
            });

            DeepLinking.addRoute(followBackRegex, () => {
                deepLinkOpenUtil({
                    link: Links.FOLLOW_BACK,
                    payload: {},
                });
            });

            DeepLinking.addRoute(followersRegex, () => {
                deepLinkOpenUtil({
                    link: Links.FOLLOWERS,
                    payload: {},
                });
            });

            DeepLinking.addRoute(newtworksRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.NETWORKS,
                    payload: {
                        networkId: match[1],
                    },
                });
            });

            DeepLinking.addRoute(profileViewsRegex, () => {
                deepLinkOpenUtil({
                    link: Links.PROFILE_VIEWS,
                    payload: {},
                });
            });

            DeepLinking.addRoute(createPostRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.CREATE_POST,
                    payload: {
                        domainUrl: match[0],
                    },
                });
            });

            DeepLinking.addRoute(feedRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.FEED,
                    payload: {
                        initialTab: match[1],
                    },
                });
            });

            DeepLinking.addRoute(joinCommunityRegex, (response: any) => {
                const { match } = response;

                deepLinkOpenUtil({
                    link: Links.JOIN_COMMUNITY,
                    payload: {
                        id: match[1],
                    },
                });
            });

            // Роуты для автотестов
            if (isStage) {
                DeepLinking.addRoute(authRegex, (response: any) => {
                    const { match } = response;

                    deepLinkOpenUtil({
                        link: Links.AUTH,
                        payload: {
                            phoneNumber: match[1],
                            otpCode: match[2],
                        },
                    });
                });

                DeepLinking.addRoute(changeTestDomainRegex, (response: any) => {
                    const { match } = response;

                    deepLinkOpenUtil({
                        link: Links.CHANGE_TEST_DOMAIN,
                        payload: {
                            domainUrl: match[1],
                        },
                    });
                });
            }
        });
    };
}

export default new ExternalLinksListener();
