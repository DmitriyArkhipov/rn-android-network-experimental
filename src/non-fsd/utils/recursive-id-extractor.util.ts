import { type ChannelShortResponse } from '@/shared/api/types/api.types';

export const extractParticipantIds = (channel: ChannelShortResponse, ids: string[]): string[] => {
    if (channel?.first_messages?.[0]?.participant_id) {
        ids.push(channel.first_messages[0].participant_id);
    }

    // @ts-expect-error - auto-ts-ignore

    if (!channel?.repost_of) {
        return ids;
    }

    // @ts-expect-error - auto-ts-ignore

    return extractParticipantIds(channel?.repost_of, ids);
};

export const extractParentChannelIds = (channel: ChannelShortResponse, ids: string[]): string[] => {
    if (channel?.parent_channel_id) {
        ids.push(channel.parent_channel_id);
    }

    // @ts-expect-error - auto-ts-ignore

    if (!channel?.repost_of) {
        return ids;
    }

    // @ts-expect-error - auto-ts-ignore

    return extractParentChannelIds(channel?.repost_of, ids);
};

export const extractParticipantIdsAndParentChannelIds = (channels: ChannelShortResponse[]) => {
    const participantIds: string[] = [];
    const parentIds: string[] = [];

    channels.forEach((channel) => {
        participantIds.push(...extractParticipantIds(channel, []));
        parentIds.push(...extractParentChannelIds(channel, []));
    });

    return [participantIds, parentIds] as const;
};
