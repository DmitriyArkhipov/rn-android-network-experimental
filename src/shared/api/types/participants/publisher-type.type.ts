export enum PublisherType {
    ALL_DETAILS = 'ALL_DETAILS',
    ONLY_COMPANY = 'ONLY_COMPANY',
    ONLY_POSITION = 'ONLY_POSITION',
    ONLY_COMPANY_AND_POSITION = 'ONLY_COMPANY_AND_POSITION',
    COMMUNITY = 'COMMUNITY',
}

export type PublisherTypeSelectorItem = {
    type: PublisherType;
    title?: string;
};
