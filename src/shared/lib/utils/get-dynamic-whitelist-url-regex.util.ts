import { RegExpConstants } from '@/shared/lib/constants/regex.constants';
import { isEmpty } from '@/shared/lib/services/lodash.util';

import { FeatureFlag } from '../services/feature-flags/feature-flags.constants';
import { getFeatureValue } from '../services/feature-flags/utils/get-feature-value.util';

type DomainsList = { domains: Array<string> };

const WHITE_LIST_DOMAINS = ['*.setka.ru', '*.hh.ru', 'set.ki/rules'];

export const getDynamicWhitelistUrlRegex = () => {
    const flagVariant = getFeatureValue(FeatureFlag.dynamic_whitelist_domains);

    const { domains } = JSON.parse(flagVariant || '{}') as DomainsList;

    const domainsList = !isEmpty(domains) ? domains : WHITE_LIST_DOMAINS;

    const domainsRegex = domainsList
        .map((domain) => {
            if (domain.startsWith('*.') || domain.startsWith('\\*.')) {
                // Регулярку ниже заменить на '*.' после полной раскатки версии 1.190 и выше
                return domain.replace(/[\\]*[*]./, RegExpConstants.subdomainRegex);
            }

            return domain;
        })
        .join('|');

    return `^https://(${domainsRegex})`;
};
