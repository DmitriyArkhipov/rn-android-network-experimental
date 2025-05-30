import { useCallback } from 'react';
import { useVariant } from '@unleash/proxy-client-react';

import { DeviceConstants } from '@/shared/lib/constants/device-info.constants';
import { isAndroid } from '@/shared/lib/utils/platform-detection.util';

import { FeatureFlag } from '../services/feature-flags/feature-flags.constants';
import { useFlag } from '../services/feature-flags/hooks/use-flag.hooks';

export enum UpdatingType {
    SOFT_UPDATE = 'softUpdate',
    FORCE_UPDATE = 'forceUpdate',
}

type VersionsInfo = {
    ios: {
        [UpdatingType.SOFT_UPDATE]: {
            versions: Array<string>;
            message: string;
            link: string;
        };
        [UpdatingType.FORCE_UPDATE]: {
            versions: Array<string>;
            message: string;
            link: string;
        };
    };
    android: {
        [UpdatingType.SOFT_UPDATE]: {
            versions: Array<string>;
            message: string;
            link: string;
            ruStoreLink: string;
        };
        [UpdatingType.FORCE_UPDATE]: {
            versions: Array<string>;
            message: string;
            link: string;
            ruStoreLink: string;
        };
    };
};

const compareVersions = (version1: string, version2: string) => {
    const version1Array = version1.split('.');
    const version2Array = version2.split('.');

    let state = 0;

    for (let index = 0; index < 3; index++) {
        if (Number(version1Array[index]) < Number(version2Array[index])) {
            state = -1;

            break;
        } else if (Number(version1Array[index]) > Number(version2Array[index])) {
            state = 1;

            break;
        }
    }

    return state;
};

export const checkIsVersionConsist = (versions: Array<string>, currentVersion: string) => {
    let isConsist = false;

    for (let index = 0; index < versions.length; index++) {
        const condition = versions[index]!.split(' ')[0];
        const version = versions[index]!.split(' ')[1] || '';

        const versionComparison = compareVersions(currentVersion, version);

        if (condition === '<' && versionComparison < 0) {
            isConsist = true;
            break;
        }

        if (condition === '<=' && versionComparison <= 0) {
            isConsist = true;
            break;
        }

        if (condition === '==' && versionComparison === 0) {
            isConsist = true;
            break;
        }

        if (condition === '>=' && versionComparison >= 0) {
            isConsist = true;
            break;
        }

        if (condition === '>' && versionComparison > 0) {
            isConsist = true;
            break;
        }
    }

    return isConsist;
};

export const useVersionChecker = () => {
    const versionsFlag = useFlag(FeatureFlag.versions);
    const versionsVariant = useVariant('versions');

    const getUpdateDataByType = useCallback(
        (type: UpdatingType) => {
            if (!versionsFlag || !versionsVariant.payload?.value) {
                return {
                    enable: false,
                    message: '',
                    link: '',
                    ruStoreLink: '',
                };
            }

            const versionsData = JSON.parse(versionsVariant.payload?.value) as unknown as VersionsInfo;
            const platformData = isAndroid ? versionsData.android : versionsData.ios;

            const needUpdate = checkIsVersionConsist(platformData[type].versions, DeviceConstants.currentVersion);
            const ruStoreLink = { ...(isAndroid && { ruStoreLink: versionsData.android[type].ruStoreLink }) };

            return {
                ...ruStoreLink,
                enable: needUpdate,
                message: platformData[type].message,
                link: platformData[type].link,
            };
        },
        [versionsFlag, versionsVariant.payload?.value],
    );

    return {
        [UpdatingType.FORCE_UPDATE]: getUpdateDataByType(UpdatingType.FORCE_UPDATE),
        [UpdatingType.SOFT_UPDATE]: getUpdateDataByType(UpdatingType.SOFT_UPDATE),
    };
};
