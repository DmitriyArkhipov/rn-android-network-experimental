import type { GetParamsByPath, GetResponseByPath } from '@/shared/api/types/api-utils.types';

export type NetworksMeResponse = GetResponseByPath<'/v1/networks/me'>;

export type GetNetworksTypesResponse = GetResponseByPath<'/v1/networks/types'>;

export type NetworksMembersResponse = GetResponseByPath<'/v1/networks/members'>;

export type NetworkInfoResponse = GetResponseByPath<'/v1/networks/{network_id}/info'>;

export type NetworkDetailsResponse = GetResponseByPath<'/v1/networks/{network_id}'>;

export type NetworksByAccountResponse = GetResponseByPath<'/v1/networks/by_account_id'>;

export type NetworksSearchResponse = GetResponseByPath<'/v1/networks/search'>;

export type NetworkFeedResponse = GetResponseByPath<'/v1/networks/{network_id}/feed'>;

export type NetworksByCompanyResponse = GetResponseByPath<'/v1/networks/by_company_id'>;

export type NetworkRolesResponse = GetResponseByPath<'/v1/networks/{network_id}/roles'>;
export type NetworkRoleResponse = NetworkRolesResponse['roles'][number];

export type NetworkRolesParams = GetParamsByPath<'/v1/networks/{network_id}/roles'>;

export type NetworkVacanciesResponse = GetResponseByPath<'/v1/networks/{network_id}/vacancies'>;
export type NetworkVacanciesParams = GetParamsByPath<'/v1/networks/{network_id}/vacancies'>;

export type NetworkItem =
    | NetworksSearchResponse['networks'][0]
    | NetworksMeResponse['networks'][0]
    | NetworksByAccountResponse['networks'][0]
    | NetworksByCompanyResponse['networks'][0];

export type NetworkMember = NonNullable<NetworksMembersResponse['members']>[0];

export type NetworksTypes = GetNetworksTypesResponse[0];

// export type NetworkVacanciesCounterResponse = GetResponseByPath<'/v1/networks/{network_id}/vacancies/counter'>;
export type NetworkVacanciesCounterResponse = { count: number };
