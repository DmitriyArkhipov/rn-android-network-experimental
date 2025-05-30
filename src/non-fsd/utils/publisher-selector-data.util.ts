import { type AccountResponse, type ChannelParticipantDisplayData } from '@/shared/api/types/api.types';
import { PublisherType, type PublisherTypeSelectorItem } from '@/shared/api/types/participants/publisher-type.type';
import { nbSpace } from '@/shared/lib/constants/unicode.constants';

import { getParticipantCaptionNameUtil } from './get-participant-caption-name.util';

export const getPublisherSelectorData = (account: AccountResponse | undefined) => {
    if (!account) {
        return [
            {
                type: PublisherType.ALL_DETAILS,
                title: '',
            },
        ];
    }

    const { caption, name } = getParticipantCaptionNameUtil(account!);
    const publisherTypeSelectorItems: Array<PublisherTypeSelectorItem> = [
        {
            type: PublisherType.ALL_DETAILS,
            title: name!,
        },
    ];

    if (account?.company?.name && account?.position?.name) {
        publisherTypeSelectorItems.push({
            type: PublisherType.ONLY_COMPANY_AND_POSITION,
            title: caption,
        });
    }

    if (account?.company?.name) {
        publisherTypeSelectorItems.push({
            type: PublisherType.ONLY_COMPANY,
            title: `работает в${nbSpace}${account?.company?.name}`,
        });
    }

    if (account?.position?.name) {
        publisherTypeSelectorItems.push({
            type: PublisherType.ONLY_POSITION,
            title: account?.position?.name,
        });
    }

    return publisherTypeSelectorItems;
};

export const getPublisherSelectorDataByType = (
    account: Maybe<AccountResponse>,
    type: PublisherType,
    display: Maybe<ChannelParticipantDisplayData>,
) => {
    if (!account) {
        return;
    }
    if (type === PublisherType.COMMUNITY) {
        return {
            type: PublisherType.COMMUNITY,
            title: display?.name || '',
        };
    }

    return getPublisherSelectorData(account).find((item) => item.type === type);
};
