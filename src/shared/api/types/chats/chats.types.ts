import {
    type GetParamsByPath,
    type GetResponseByPath,
    type PostBodyByPath,
    type PostResponseByPath,
} from '../api-utils.types';

export type GetChatListResponse = GetResponseByPath<'/v1/chats'>;
export type GetChatResponse = GetResponseByPath<'/v1/chats/{recipient_id}'>;
export type GetUserSupportChatResponse = GetResponseByPath<'/v1/user_support/session'>;

export type Chat = GetChatListResponse['chats'][number];
export type ChatMessage = GetChatListResponse['chats'][number]['messages'][number];
export type ChatRecipient = GetChatListResponse['chats'][number]['recipient'];

export type GetChatParams = GetParamsByPath<'/v1/chats/{recipient_id}'> & { recipientUuid: string };
export type GetChatsParams = GetParamsByPath<'/v1/chats'>;
export type DeleteChatMessageParams = { messageId: string };

export type PostMessageData = PostBodyByPath<'/v1/chats/messages'>;
export type PostMessageDataItem = PostBodyByPath<'/v1/chats/messages'>[number];
export type PostMessageResponse = PostResponseByPath<'/v1/chats/messages'>;

export type PostAttachmentsResponse = PostResponseByPath<'/v1/chats/messages/{message_id}/attachments'>;
