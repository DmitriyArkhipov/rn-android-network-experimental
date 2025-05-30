import {
    type GetParamsByPath,
    type GetResponseByPath,
    type PostBodyByPath,
    type PostResponseByPath,
    type PutBodyByPath,
} from '@/shared/api/types/api-utils.types';

import { type components } from './generated-api.types';

export type AccountResponse = GetResponseByPath<'/v1/accounts/me'>;
export type AccountRelation = NonNullable<AccountResponse['relations']>[number];
export type AccountUpdateRequest = PutBodyByPath<'/v1/accounts/me'>;

export type ChannelShortListResponse = GetResponseByPath<'/channels/posts/feed'>;
export type ChannelShortResponse = ChannelShortListResponse['channels'][number];
export type ChannelPostSnippetResponse = NonNullable<ChannelShortResponse['snippets']>[number];

export type ParticipantByIdResponse = GetResponseByPath<'/v1/participants/by_id'>;
export type ChannelParticipantFullInfo = ParticipantByIdResponse['participants'][0];

export type ChannelParticipantDisplayData = ChannelParticipantFullInfo['display'];

export type SuggestResponse = components['schemas']['SuggestResponse'];
export type Tag = components['schemas']['TagBodyResponse'];

export type CreatedMessageResponse = components['schemas']['CreatedMessageResponse'];
export type MessagesListResponse = components['schemas']['MessagesListResponse'];
export type MessageBodyResponse = components['schemas']['MessageBodyResponse'];

// @ts-expect-error - auto-ts-ignore

export type RepostedAccountsListViewModel = components['schemas']['RepostedAccountsListViewModel'];
// @ts-expect-error - auto-ts-ignore

export type RepostedAccountsViewModel = components['schemas']['RepostedAccountsViewModel'];
// @ts-expect-error - auto-ts-ignore

export type ReactionAccountViewModel = components['schemas']['ReactionAccountViewModel'];
// @ts-expect-error - auto-ts-ignore

export type MessageReactionsGetViewModel = components['schemas']['MessageReactionsGetViewModel'];

export type PostViewsByRoleStatisticsViewModel = GetResponseByPath<'/v1/posts/{post_id}/stats/views_by_role'>;

export type ViewStatisticsResponse = GetResponseByPath<'/v2/posts/{post_id}/stats/views_by_group_role'>;

export type ViewStatisticsRoleGroup = ViewStatisticsResponse['groups'][0];

export type ViewStatisticsCompany = ViewStatisticsResponse['companies'][0];

export type ViewStatisticsDomain = ViewStatisticsResponse['domains'][0];

export type ViewStatisticsRole = ViewStatisticsRoleGroup['positions'][0];

export type ChannelSubscriptionResponse = components['schemas']['ChannelSubscriptionResponse'];
export type AccountByIdResponse = components['schemas']['AccountByIdResponse'];
export type TagBodyResponse = components['schemas']['TagBodyResponse'];

export type SearchChannelsGlobalParams = GetParamsByPath<'/channels/search/posts'>;
export type GetAccountPostsParams = GetParamsByPath<'/v1/accounts/{account_id}/posts'>;

export type GetAccountCommentsParams = GetParamsByPath<'/accounts/me/comments'>;
export type SearchAccountsParams = GetParamsByPath<'/accounts/search'>;

export type SearchCommunitiesGlobalParams = GetParamsByPath<'/channels/search/communities'>;

export type ChannelShortByIdResponse = components['schemas']['ChannelShortByIdResponse'];
export type SuggestItem = Partial<components['schemas']['TagBodyResponse']> &
    Partial<components['schemas']['PositionResponse']> &
    Partial<components['schemas']['CompanySuggestResponse']> &
    Partial<components['schemas']['AccountResponse']>;
export type PositionResponse = components['schemas']['PositionResponse'];
export type CompanySuggestResponse = components['schemas']['CompanySuggestResponse'];
export type CityResponse = components['schemas']['CityResponse'];
export type ChannelSubscribersCountResponse = components['schemas']['ChannelSubscribersCountResponse'];
export type AccountsRelationType = components['schemas']['AccountsRelationType'];
export type AccountShortListResponse = components['schemas']['AccountShortListResponse'];

export type AccountMeRelationResponse = GetResponseByPath<'/v1/accounts/me/relation/FOLLOW/{direction}'>;
export type AccountMeRelationParams = GetParamsByPath<'/v1/accounts/me/relation/FOLLOW/{direction}'>;
export type AccountRelationParams = GetParamsByPath<'/v1/accounts/{account_id}/relation/{relation_type}/{direction}'>;
export type CreateMessageRequest = components['schemas']['CreateMessageRequest'];
export type UpdateMessageRequest = components['schemas']['UpdateMessageRequest'];

export type RecipientPreferencesResponse = GetResponseByPath<'/v1/notification_preferences'>;
export type NotificationPreferences = RecipientPreferencesResponse['preferences'];
export type NotificationSettings = NotificationPreferences[string]['delivery'];

export type NotificationsListResponse = components['schemas']['NotificationsListResponse'];
export type NotificationResponse =
    // @ts-expect-error - auto-ts-ignore

    | components['schemas']['NotificationResponse_Literal__NotificationType.ACCOUNT_MENTIONED___ACCOUNT_MENTIONED_____NotificationContentAccountMentioned_']
    // @ts-expect-error - auto-ts-ignore
    | components['schemas']['NotificationResponse_Literal__NotificationType.AUTHOR_POST_NEW_COMMENTS___AUTHOR_POST_NEW_COMMENTS_____NotificationContentAuthorPostNewComments_']
    // @ts-expect-error - auto-ts-ignore
    | components['schemas']['NotificationResponse_Literal__NotificationType.NEW_POST_IN_COMMUNITY___NEW_POST_IN_COMMUNITY_____NotificationContentNewPostInCommunity_']
    // @ts-expect-error - auto-ts-ignore
    | components['schemas']['NotificationResponse_Literal__NotificationType.POST_NEW_COMMENTS___POST_NEW_COMMENTS_____NotificationContentPostNewComments_']
    // @ts-expect-error - auto-ts-ignore
    | components['schemas']['NotificationResponse_Literal__NotificationType.YOUR_COMMUNITY_DELETED___YOUR_COMMUNITY_DELETED_____NotificationCommunityDeleted_']
    // @ts-expect-error - auto-ts-ignore
    | components['schemas']['NotificationResponse_str__dict_'];
export type NotificationsCountResponse = components['schemas']['NotificationsCountResponse'];

export type WsConnectUrl = components['schemas']['WsConnectUrl'];
export type WsSubscribeData = components['schemas']['WsSubscribeData'];
export type WsUnsubscribeData = components['schemas']['WsUnsubscribeData'];
export type WsNewP2PMessage = components['schemas']['WsNewP2PMessage'];
export type WsP2PReadByOpponent = components['schemas']['WsP2PReadByOpponent'];
export type CreatedPostResponse = components['schemas']['CreatedPostResponse'];
export type PostShortListResponse = components['schemas']['PostShortListResponse'];
export type PostShortResponse = components['schemas']['PostShortResponse'];
export type PostWithNetworkShortResponse = components['schemas']['PostWithNetworkShortResponse'];
export type ShortParticipantByChannelResponse = components['schemas']['ShortParticipantByChannelResponse'];
export type ChannelsUnreadCountResponse = components['schemas']['ChannelsUnreadCountResponse'];
export type CreateCommunityRequest = components['schemas']['CreateCommunityRequest'];
export type DisplayedAuthorEnum = components['schemas']['DisplayedAuthorEnum'];
export type CreatedCommunityResponse = components['schemas']['CreatedCommunityResponse'];
export type CommunityUpdateRequest = components['schemas']['CommunityUpdateRequest'];
export type UpdatedCommunityResponse = components['schemas']['UpdatedCommunityResponse'];
export type UpdatePostRequest = PutBodyByPath<'/v1/posts/{channel_id}'>;
export type WorkExperienceBodyResponse = components['schemas']['WorkExperienceBodyResponse'];
export type ChannelRoleResponse = components['schemas']['ChannelRoleResponse'];
export type CommunitySettingsResponse = components['schemas']['CommunitySettingsResponse'];
export type WorkExperienceBodyRequest =
    // @ts-expect-error - auto-ts-ignore

    components['schemas']['jager_app__api__routes__public__v1__accounts__schemas__WorkExperienceBodyRequest'];
export type AccountWorkExperiencesListResponse = components['schemas']['AccountWorkExperiencesListResponse'];
export type AccountWorkExperiencesListRequest =
    // @ts-expect-error - auto-ts-ignore

    components['schemas']['jager_app__api__routes__public__v1__accounts__schemas__AccountWorkExperiencesListRequest'];
export type RelationDirection = components['schemas']['RelationDirection'];

export type GetUserFeedChannelsPostsParams = GetParamsByPath<'/channels/posts/feed'>;
export type GetPostsTrendsParams = GetParamsByPath<'/posts/feed/recommendation'>;

export type GetWhoRepostedParams = GetParamsByPath<'/v1/reposts/{post_id}/reposted-by-accounts'>;
export type GetChannelsToRepostParams = GetParamsByPath<'/v1/reposts/channels-to-repost'>;
export type GetWhoReactedParams = GetParamsByPath<'/v1/messages/{message_id}/reactions'>;

export type CreateAccountComplaintRequest = components['schemas']['CreateAccountComplaintRequest'];
export type CreateChannelComplaintRequest = components['schemas']['CreateChannelComplaintRequest'];
export type CreateCommunityComplaintRequest = components['schemas']['CreateCommunityComplaintRequest'];
export type CountryResponse = components['schemas']['CountryResponse'];
export type SuggestCountryResponse = { items: CountryResponse[] };
export type ComplaintIdResponse = components['schemas']['ComplaintIdResponse'];
export type CompanyLongSuggestResponse = components['schemas']['CompanyLongSuggestResponse'];
export type PositionLongResponse = components['schemas']['PositionLongResponse'];
export type AccountShortResponse = components['schemas']['AccountShortResponse'];
export type TgTemporaryTokenViewModel = components['schemas']['TgTemporaryTokenViewModel'];
export type TgCrosspostingStatusViewModel = components['schemas']['TgCrosspostingStatusViewModel'];
export type DomainViewModel = components['schemas']['DomainViewModel'];
export type DomainListViewModel = components['schemas']['DomainListViewModel'];
export type DomainResponseDTO = components['schemas']['DomainResponseDTO'];
export type MemberStatusType = components['schemas']['MemberStatusEnum'];

export type CommunityJoinRequestsListViewModel = GetResponseByPath<'/v1/communities/{community_id}/join_requests'>;
export type CommunitiesJoinRequestsGetParams = NonNullable<
    GetParamsByPath<'/v1/communities/{community_id}/join_requests'>
>;
export type CommunityInviteViewModel = NonNullable<GetResponseByPath<'/v1/communities/{community_id}/invites'>>;
export type CommunityInviteCreatePostParams = NonNullable<PostBodyByPath<'/v1/communities/{community_id}/invites'>>;

export type CommunityJoinRequestViewModel =
    GetResponseByPath<'/v1/communities/{community_id}/join_requests'>['join_requests'][0];
export type PrivateCommunityShortResponseViewModel =
    GetResponseByPath<'/v1/communities/{community_id}/invites/{invite_id}'>;
export type CommunityJoinRequestsCreateResponse = PostResponseByPath<'/v1/communities/{community_id}/join_requests'>;

export type OnboardingResponse = components['schemas']['OnboardingResponse'];
export type CompanyDetailViewModel = components['schemas']['CompanyDetailViewModel'];

export type ShortenerResponse = components['schemas']['ShortenerResponseListModelView'];
// @ts-expect-error - auto-ts-ignore

export type ShortenerRequest = components['schemas']['ShortenerRequestWriteSchema'];
export type ShortenerRequestTypeEnum = components['schemas']['UrlTypeEnum'];
export type LongUrlShortenerResponse = components['schemas']['ShortenerResponseReadSchema'];

export type AccountByUuidResponse = GetResponseByPath<'/v1/accounts/by_uuid'>;
export type UserStatusListResponse = GetResponseByPath<'/v1/status'>;
export type UserStatusInfo = UserStatusListResponse['statuses'][number];
export type UpdateUserStatusRequest = PostBodyByPath<'/accounts/me/status'>;

export type AccountSessionMetadataRequest = PostBodyByPath<'/v2/accounts/session_metadata'>;
export type AccountSessionMetadataResponse = GetResponseByPath<'/v2/accounts/session_metadata'>;

export type UploadFileResponse = {
    id: string;
};

export enum MemberStatusEnum {
    REGISTERED = 'REGISTERED',
    INVITED = 'INVITED',
    NOT_REGISTERED = 'NOT_REGISTERED',
}

export type ChannelVisibilityType = ChannelShortResponse['visibility_type'];

export type GetSubscriptionCommunityGroupsResponse =
    GetResponseByPath<'/v1/accounts/me/subscriptions/communities/groups'>;

export type GetUnreadCommunitiesCount = { count: number };

export type MentionsResponse = GetResponseByPath<'/v1/mentions/accounts/search'>;
export type Mention = MentionsResponse['result'][0];
export type MentionsParams = GetParamsByPath<'/v1/mentions/accounts/search'>;

export type DesiredFullInfoJobResponse = GetResponseByPath<'/v2/posts/{post_id}/full_desired_info'>;

export type IndustriesUpdateRequest = components['schemas']['IndustriesUpdateRequest'];
