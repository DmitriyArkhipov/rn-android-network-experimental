import type { GetResponseByPath } from '@/shared/api/types/api-utils.types';

export type AccountsRelationsResponse =
    GetResponseByPath<'/v1/accounts/{account_id}/relation/{relation_type}/{direction}'>;
export type AccountsMeRelationsResponse = GetResponseByPath<'/v1/accounts/me/relation/FOLLOW/{direction}'>;

export type AccountsRelationsSummaryResponse = GetResponseByPath<'/v1/accounts/me/relations_summary'>;
