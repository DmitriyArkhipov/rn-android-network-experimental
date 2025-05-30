export type NetworkIcon = {
    type: 'EMOJI' | 'URL';
    icon: string;
};

/** @todo заменить на тип из сваггера */
export type NetworkFeedInfo = {
    id: string;
    name: string;
    /** @deprecated */
    caption: string;
    /** @default null */
    icon: NetworkIcon | null;
    /** @default 0 */
    members_count: number;
    /** max = 4 */
    member_avatar_urls: string[];
};
