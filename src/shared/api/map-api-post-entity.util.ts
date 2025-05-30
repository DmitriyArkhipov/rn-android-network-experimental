import apiClientService from '@/shared/api/api-client/api-client.service';
import { type PostQuestionData } from '@/shared/api/data/questions.data';
import {
    type ChannelRoleResponse,
    type ChannelShortResponse,
    type CreatedPostResponse,
    type PostShortResponse,
    type PostWithNetworkShortResponse,
    type Tag,
} from '@/shared/api/types/api.types';
import { type PublisherType } from '@/shared/api/types/participants/publisher-type.type';

type Props = {
    accountId: string;
    data: PostQuestionData;
    currentCommunity: ChannelShortResponse | null | undefined;
    responseFromPost: CreatedPostResponse;
    tags: Array<Tag>;
    postToRepost?: PostShortResponse;
};

export const mapApiPostEntity = ({
    accountId,
    data,
    currentCommunity,
    responseFromPost,
    tags,
    postToRepost,
}: Props): Required<PostWithNetworkShortResponse> => {
    const defaultRoles: ChannelRoleResponse[] = [
        {
            type: 'ADMIN',
        },
        {
            type: 'CAN_WRITE_MESSAGE',
        },
        {
            type: 'CAN_WRITE_ANON',
        },
        {
            type: 'CAN_DELETE_MESSAGE',
        },
        {
            type: 'CAN_DELETE_POST',
        },
    ];
    const postId = responseFromPost.channel.id;

    return {
        id: postId,
        name: null,
        current_participant: {
            id: accountId,
            last_read_dt: null,
            has_left_channel: null,
            visibility: data.participant_details as PublisherType,
        },
        tags,
        last_messages: null,
        // @ts-expect-error - auto-ts-ignore

        first_messages: [responseFromPost.message.message],
        total_messages_count: 1,
        unread_messages_count: 0,
        untouched_posts_count: null,
        icon_url: null,
        share_url: responseFromPost.channel.share_url ?? `${apiClientService.getDomain()}/channels/${postId}`,
        description: null,
        favorited: false,
        has_complaint: false,
        parent_channel_id: currentCommunity?.id ?? null,
        p2p_account: null,
        subscriptions: currentCommunity?.subscriptions ?? [],
        roles: currentCommunity?.roles ?? defaultRoles,
        settings: null,
        is_question: data.channel.settings?.is_question ?? null,
        views: null,
        accounts_who_commented: [],
        accounts_who_liked: [],
        // @ts-expect-error - auto-ts-ignore

        repost_of: postToRepost,
        repost_enabled: !postToRepost?.repost_of,
    };
};
