import { type components, type paths } from '@/shared/api/types/generated-api.types';

export type GetUserRelationshipResponse =
    paths['/v1/accounts/relationships/{to_account_id}']['get']['responses']['200']['content']['application/json'];

export type GetUserRelationshipPathResponse =
    paths['/v1/accounts/relationships/{to_account_id}/through/{through_account_id}']['get']['responses']['200']['content']['application/json'];

export type GetUserConnectionsResponse =
    paths['/v1/accounts/relationships/{to_account_id}/persons']['get']['responses']['200']['content']['application/json'];

export type GetUserConnectionsCountersResponse =
    paths['/v1/accounts/relationships/{to_account_id}/persons_counters']['get']['responses']['200']['content']['application/json'];

export type RelationshipUser = components['schemas']['User'];

export type UserRelationshipReasons = GetUserRelationshipResponse['to_user'];

export type UserConnectionsCounters = components['schemas']['UserRelationshipsCounters'];
