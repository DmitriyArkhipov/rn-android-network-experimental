import { EventFeedType } from '@/non-fsd/services/analytics/analytics.constants';
import { FeedListType } from '@/non-fsd/views/feed-list/feed-list.types';

const FEED_TYPES: { [key: string]: EventFeedType } = {
    [FeedListType.QUESTIONS]: EventFeedType.QUESTION,
    [FeedListType.SUBSCRIPTIONS]: EventFeedType.SUB,
    [FeedListType.COMMUNITY]: EventFeedType.COMMUNITY,
    [FeedListType.PROFILE]: EventFeedType.PROFILE,
    [FeedListType.SEARCH]: EventFeedType.SEARCH,
    [FeedListType.POPULAR]: EventFeedType.SUGGEST,
    [FeedListType.TAGS]: EventFeedType.TAGS,
    [FeedListType.COLLEAGUES]: EventFeedType.COLLEAGUES,
    [FeedListType.NETWORKS]: EventFeedType.NETWORKS,
    [FeedListType.VACANCIES]: EventFeedType.VACANCIES,
};

export const getEventFeedTypeFromFeedListType = (type: FeedListType | undefined) => {
    if (!type) {
        return undefined;
    }

    return FEED_TYPES[type];
};
