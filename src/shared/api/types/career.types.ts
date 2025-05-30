import {
    type CompanyLongSuggestResponse,
    type PositionLongResponse,
    type WorkExperienceBodyResponse,
} from '@/shared/api/types/api.types';

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;
export type SuggestCompanyType = OptionalExceptFor<CompanyLongSuggestResponse, 'name'>;
export type SuggestPositionType = OptionalExceptFor<PositionLongResponse, 'name'>;

export type WorkExperience = WorkExperienceBodyResponse & { customIndustryName?: string };
export type WorkExperienceState = WorkExperience['state'];
export type TotalExperience = { years: number; months: number };
