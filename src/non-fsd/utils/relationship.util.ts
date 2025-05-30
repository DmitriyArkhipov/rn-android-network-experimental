import getStore from '@/app/model';

import { type RelationshipReasonsProps } from '@/widgets/relationship-strength/ui/relationship-description/relationship-reasons.types';

import { type ProfileItemProps } from '@/entities/relationship-strength/lib/profile-item.types';

import {
    type RelationshipUser,
    type UserRelationshipReasons,
} from '@/shared/api/types/relationship/relationship.types';
import { type RelationshipStrength } from '@/shared/api/types/relationship-strength.types';
import { counterShorterUtil } from '@/shared/lib/utils/counter-shorter.util';
import { declensionUtil } from '@/shared/lib/utils/declension';
import { DECLENSIONS } from '@/shared/lib/utils/declension/declensions.constants';
import { Colors } from '@/shared/ui/design-system';

import { push } from '@/navigation/navigation-methods.util';
import { Screens } from '@/navigation/screens.constants';

import { getParticipantCaptionNameUtil } from './get-participant-caption-name.util';

export const MAX_DASHES_NUMBER = 3;

export const getRelationshipStrengthColor = (relationshipStrength: RelationshipStrength) => {
    switch (relationshipStrength) {
        case 'STRONG':
            return Colors.relationshipStrength.strong;

        case 'MEDIUM':
            return Colors.relationshipStrength.medium;

        case 'WEAK':
            return Colors.relationshipStrength.weak;

        default:
            return undefined;
    }
};

export const getActiveDashesNumber = (relationshipStrength: RelationshipStrength) => {
    switch (relationshipStrength) {
        case 'STRONG':
            return 3;

        case 'MEDIUM':
            return 2;

        case 'WEAK':
            return 1;

        default:
            return 0;
    }
};

export const getRoundedConnections = (connections: number) => {
    if (connections >= 1000) {
        return Math.floor(connections / 100) * 100;
    }

    return connections;
};

export const generateAnyConnectionsText = (connections: number) => {
    const roundedConnections = getRoundedConnections(connections);

    return `${counterShorterUtil(roundedConnections)} ${declensionUtil(roundedConnections, DECLENSIONS.Relationship)}`;
};

export const generateStrongSharedConnectionsText = (connections: number) => {
    const roundedConnections = getRoundedConnections(connections);

    return `${counterShorterUtil(roundedConnections)} ${declensionUtil(roundedConnections, DECLENSIONS.Common)} ${declensionUtil(roundedConnections, DECLENSIONS.Strong)} ${declensionUtil(roundedConnections, DECLENSIONS.Relationship)}`;
};

export const generateOthersSharedConnectionsText = (connections: number) => {
    const roundedConnections = getRoundedConnections(connections);

    return `${counterShorterUtil(roundedConnections)} ${declensionUtil(roundedConnections, DECLENSIONS.Other)} ${declensionUtil(roundedConnections, DECLENSIONS.Common)} ${declensionUtil(roundedConnections, DECLENSIONS.Relationship)}`;
};

export const generateExclusiveConnectionsText = (connections: number) => {
    const roundedConnections = getRoundedConnections(connections);

    return `${counterShorterUtil(roundedConnections)} ${declensionUtil(roundedConnections, DECLENSIONS.Personal)} ${declensionUtil(roundedConnections, DECLENSIONS.Relationship)}`;
};

export const generatePersonalConnectionsText = (connections: number) => {
    const roundedConnections = getRoundedConnections(connections);

    return `${counterShorterUtil(roundedConnections)} ${declensionUtil(roundedConnections, DECLENSIONS.Relationship)}`;
};

export const generateUserConnectionsText = ({
    strongSharedConnections,
    allConnections,
}: {
    strongSharedConnections?: number;
    allConnections?: number;
}) => {
    if (strongSharedConnections) {
        return generateStrongSharedConnectionsText(strongSharedConnections);
    }

    if (allConnections) {
        return generateAnyConnectionsText(allConnections);
    }

    return undefined;
};

const onPressProfileItem: ProfileItemProps['onPress'] = ({ accountId, accountUuid }) => {
    const isCurrentUser = getStore()?.getState().profile.account?.uuid === accountUuid;

    if (isCurrentUser) {
        push(Screens.PROFILE, { enableBackButton: true });
    } else {
        push(Screens.OTHER_PROFILE, { id: accountId, uuid: accountUuid });
    }
};

export const mapRelationshipUserToProfileItemProps = (
    user: Omit<RelationshipUser, 'id' | 'company'> & {
        id: number | string | null;
        company: (Pick<NonNullable<RelationshipUser['company']>, 'name' | 'logo_url'> & { id: string | number }) | null;
    },
    passProps?: Partial<ProfileItemProps>,
): ProfileItemProps => {
    const { caption, name } = getParticipantCaptionNameUtil(user);

    const {
        id: accountId,
        uuid: accountUuid,
        avatar_url: avatarUrl,
        company,
        status_id: statusId,
        status_description: statusDescription,
        relationship_strength: relationshipStrength,
    } = user;

    return {
        accountId: accountId?.toString() ?? '',
        accountUuid,
        avatarUrl: avatarUrl ?? '',
        companyLogoUrl: company?.logo_url ?? undefined,
        name,
        caption,
        relationshipStrength: relationshipStrength ?? undefined,
        onPress: onPressProfileItem,
        userStatusId: statusId ?? undefined,
        userStatusDescription: statusDescription ?? undefined,
        ...passProps,
    };
};

export const getRelationshipReasonsProps = (relationship: UserRelationshipReasons): RelationshipReasonsProps => {
    return {
        reasons: relationship.reasons.map((reason) => {
            switch (reason.type) {
                case 'COMMON_RELATIONS':
                    return {
                        type: reason.type,
                        text: reason.description,
                        avatarUrls: reason.avatar_urls ?? undefined,
                    };

                case 'SUBSCRIPTION':
                    return {
                        type: reason.type,
                        text: reason.description,
                    };

                case 'WORKED_FOR':
                    return {
                        type: reason.type,
                        iconUrl: reason.icon_url,
                        text: reason.description,
                    };

                default:
                    return {
                        type: reason.type,
                        text: reason.description,
                    };
            }
        }),
        relationshipStrength: relationship.user.relationship_strength,
    };
};
