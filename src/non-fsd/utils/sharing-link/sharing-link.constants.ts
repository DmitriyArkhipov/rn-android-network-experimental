import type { ShortenerRequestTypeEnum } from '@/shared/api/types/api.types';

import { SharedLinkContentType, type UTMCampaign, type UTMSource } from './sharing-link.types';

export const UTM_SOURCE_CONTENT: UTMSource = 'share_content';
export const UTM_SOURCE_INVITE: UTMSource = 'share_refferal';
export const UTM_CHAMPING: UTMCampaign = 'inapp_setka';

export const URLPathShortenerMap: { [key in SharedLinkContentType]: ShortenerRequestTypeEnum | null } = {
    [SharedLinkContentType.POST]: 'post',
    [SharedLinkContentType.PROFILE]: null,
    [SharedLinkContentType.QUESTION]: 'question',
    [SharedLinkContentType.COMMUNITY]: 'community',
    [SharedLinkContentType.INVITE]: 'invite',
    [SharedLinkContentType.CHANNEL]: 'channel',
    [SharedLinkContentType.RESUME]: 'resume',
    [SharedLinkContentType.VACANCY]: 'vacancy',
    // @todo убрать игноры когда тип завезут на бекенд
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [SharedLinkContentType.NETWORK]: 'network',
};
