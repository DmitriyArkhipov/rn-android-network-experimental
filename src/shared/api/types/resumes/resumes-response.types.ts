import { type GetParamsByPath, type GetResponseByPath } from '@/shared/api/types/api-utils.types';

export type ResumesInfoResponse = GetResponseByPath<'/v1/recommendation/resumes/preview_info'>;

export type ResumesRolesResponse = GetResponseByPath<'/v1/recommendation/resumes/roles'>;

export type ResumesPostsResponse = GetResponseByPath<'/v1/recommendation/resumes'>;

export type ResumesPostsParams = GetParamsByPath<'/v1/recommendation/resumes'>;
