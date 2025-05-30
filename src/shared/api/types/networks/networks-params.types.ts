import type { GetParamsByPath, PatchBodyByPath } from '@/shared/api/types/api-utils.types';

export type NetworkMeQueryParams = GetParamsByPath<'/v1/networks/me'>;

export type GetNetworkTabFeedParams = GetParamsByPath<'/v1/networks/feed'>;

export type GetNetworksByCompanyIdParameters = GetParamsByPath<'/v1/networks/by_company_id'>;

export type NetworksTypesParams = GetParamsByPath<'/v1/networks/types'>;

export type NetworksByAccountQueryParams = GetParamsByPath<'/v1/networks/by_account_id'>;

export type NetworkMembersSearchParams = GetParamsByPath<'/v1/networks/{network_id}/members/search'>;

export type PatchNetworkSettingsParams = PatchBodyByPath<'/v1/networks/{network_id}/settings'>;
