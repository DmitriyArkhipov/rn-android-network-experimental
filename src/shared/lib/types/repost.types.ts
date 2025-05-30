import { type PostShortResponse } from '@/shared/api/types/api.types';

export type RepostData = {
    fromCommunity?: boolean;
    postToRepost?: PostShortResponse;
    fromComments: boolean;
    channel: PostShortResponse;
};
