import { type WorkExperience } from '@/shared/api/types/career.types';
import { isEmpty, isEqual } from '@/shared/lib/services/lodash.util';

export const checkExperienceEdited = (
    initialValue: WorkExperience | undefined,
    currentValue: WorkExperience | undefined,
    isPeriodOfWorkEdited: boolean,
) => {
    const isCompanyEdited = initialValue?.company_position?.company?.id !== currentValue?.company_position?.company?.id;
    const isPositionEdited =
        initialValue?.company_position?.position?.name !== currentValue?.company_position?.position?.name;

    const initialIndustriesIds = initialValue?.industries?.map((industry) => industry.id).sort();
    const currentIndustriesIds = currentValue?.industries?.map((industry) => industry.id).sort();
    const customIndustryNameEdited =
        (!!initialValue?.customIndustryName || !!currentValue?.customIndustryName) &&
        initialValue?.customIndustryName !== currentValue?.customIndustryName;
    const isIndustriesEdited = !isEqual(initialIndustriesIds, currentIndustriesIds) || customIndustryNameEdited;

    const isExperienceEdited = isPeriodOfWorkEdited || isCompanyEdited || isPositionEdited || isIndustriesEdited;

    return isExperienceEdited;
};

export const getSortedWorkExperiences = (workExperiences: WorkExperience[]) =>
    workExperiences
        .filter((item) => {
            const isExperienceValid =
                !isEmpty(item.company_position?.company) &&
                item.company_position?.position_title &&
                item.start_month &&
                item.start_year &&
                (item.work_currently || (item.end_month && item.end_year));

            return isExperienceValid;
        })
        .sort((a, b) => {
            if (a.work_currently && !b.work_currently) {
                return -1;
            }

            if (!a.work_currently && b.work_currently) {
                return 1;
            }

            if (a.end_year === b.end_year || (a.work_currently && b.work_currently)) {
                // @ts-expect-error - auto-ts-ignore

                return b.start_year - a.start_year;
            }

            // @ts-expect-error - auto-ts-ignore

            return b.end_year - a.end_year;
        });
