export const isPrivateChannelUtil = (channel: Maybe<{ visibility_type: 'PUBLIC' | 'PRIVATE' }>) =>
    channel?.visibility_type === 'PRIVATE';
