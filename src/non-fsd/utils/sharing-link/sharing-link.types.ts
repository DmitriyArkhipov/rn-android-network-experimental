export enum SharedLinkContentType {
    POST = 'post',
    QUESTION = 'question',
    CHANNEL = 'channel',
    PROFILE = 'profile',
    INVITE = 'invite',
    COMMUNITY = 'community',
    NETWORK = 'network',
    VACANCY = 'vacancy',
    RESUME = 'resume',
}

export type UTMSource = 'share_content' | 'share_refferal';
export type UTMCampaign = 'inapp_setka';

export type UTMParams = {
    utm_medium: SharedLinkContentType;
    utm_source: UTMSource;
    utm_campaign: UTMCampaign;
    utm_content?: string;
    utm_term?: string;
};

export type UTMDynamicParams = Omit<UTMParams, 'utm_campaign'>;

export type ShareLinkParams = Omit<UTMDynamicParams, 'utm_term'>;
