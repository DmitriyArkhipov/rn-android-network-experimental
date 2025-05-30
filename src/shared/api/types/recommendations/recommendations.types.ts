import { type paths } from '@/shared/api/types/generated-api.types';

export type RecommendationMembersResponse =
    paths['/v1/networks/members']['get']['responses']['200']['content']['application/json'];
export type RecommendationItem = NonNullable<
    paths['/v1/networks/members']['get']['responses']['200']['content']['application/json']['members']
>[0];

export type RecommendationCommunitiesResponse =
    paths['/v1/recommendation/social_groups']['get']['responses']['200']['content']['application/json'];
export type RecommendationCommunitiesItem =
    paths['/v1/recommendation/social_groups']['get']['responses']['200']['content']['application/json']['items'][0];

export type RecommendationAuthorsResponse =
    paths['/v1/recommendation/accounts']['get']['responses']['200']['content']['application/json'];
export type RecommendationAuthorsItem =
    paths['/v1/recommendation/accounts']['get']['responses']['200']['content']['application/json']['accounts'][0];
