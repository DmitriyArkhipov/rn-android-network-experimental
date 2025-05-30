import { type GetParamsByPath, type GetResponseByPath } from '@/shared/api/types/api-utils.types';

export type VacanciesInfoResponse = GetResponseByPath<'/v1/recommendation/vacancies/preview_info'>;

export type VacanciesRolesResponse = GetResponseByPath<'/v1/recommendation/vacancies/roles'>;

export type VacancyRoleItem = VacanciesRolesResponse['roles'][number];

export type VacanciesPostsResponse = GetResponseByPath<'/v1/recommendation/vacancies'>;

export type VacanciesPostsParams = GetParamsByPath<'/v1/recommendation/vacancies'>;
