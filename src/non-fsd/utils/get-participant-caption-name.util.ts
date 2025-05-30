import getStore from '@/app/model';

import { type PartialRecord } from '@/shared/api/types/utility.types';
import { nbSpace } from '@/shared/lib/constants/unicode.constants';

type AccountToGetCaption = {
    company?: Maybe<{
        name?: Maybe<string>;
        id?: Maybe<string | number>;
        uuid?: Maybe<string>;
    }>;
    position?: Maybe<{
        name: Maybe<string>;
    }>;
} & PartialRecord<'name' | 'caption' | 'position_title' | 'first_name' | 'last_name', Maybe<string>>;

export const getParticipantCaptionNameUtil = (data?: AccountToGetCaption) => {
    // TODO: - разорвать зависимость и вынести по fsd (скорее всего shared)
    const freelance = getStore()?.getState().workExperiences.freelance;

    const company = data?.company;

    const isFreelance =
        freelance?.id === company?.id ||
        freelance?.uuid === company?.uuid ||
        // в разных схемах компаний в поле id сейчас может приходить и id, и uuid
        freelance?.uuid === company?.id;

    let caption = '';
    const companyName = data?.company?.name ?? '';
    const position = data?.position_title || data?.position?.name || '';

    if (typeof data?.caption === 'string') {
        caption = data.caption;
    } else if (companyName && position) {
        const companySubstring = isFreelance ? `,${nbSpace}работает на себя` : ` в${nbSpace}${companyName}`;
        caption = `${position}${companySubstring}`;
    } else if (companyName && !position) {
        caption = isFreelance ? 'работает на себя' : `работает в${nbSpace}${companyName}`;
    } else {
        caption = position;
    }

    let name = data?.name;

    if (!name && data?.first_name && data.last_name) {
        name = `${data.first_name} ${data.last_name}`;
    } else if (!name && data?.first_name) {
        name = `${data.first_name}`;
    } else if (!name && data?.last_name) {
        name = `${data.last_name}`;
    }

    return { caption, name: name ?? '' };
};
