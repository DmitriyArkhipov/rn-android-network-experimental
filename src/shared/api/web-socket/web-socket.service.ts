// TODO: FSD Нужно избавиться от использования стора тут
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useUnreadMessagesCount } from '@/entities/chats-legacy/lib/chat.hooks';
import { setNewMessage, setReadByOpponent } from '@/entities/chats-legacy/model/chats.actions';
import { useNotificationsCount } from '@/entities/notifications/lib/hooks/notifications.hooks';
import { selectAccountId } from '@/entities/profile/model/profile.selectors';

import config from '@/shared/api/config/config.util';
import { getWebSocketUrl } from '@/shared/api/data/chat.data';
import { ChatsQueryKeysLegacy } from '@/shared/api/data/chats-legacy/chats-legacy.types';
import { invalidateNotificationsUnreadCount } from '@/shared/api/data/notifications/use-get-notifications-unread-count';
import {
    type WsNewP2PMessage,
    type WsP2PReadByOpponent,
    type WsSubscribeData,
    type WsUnsubscribeData,
} from '@/shared/api/types/api.types';
import { FeatureFlag } from '@/shared/lib/services/feature-flags/feature-flags.constants';
import { runFeature } from '@/shared/lib/services/feature-flags/utils/run-feature.util';
import { EmitterEvents } from '@/shared/lib/utils/emitter/emitter.constants';
import emitterUtil from '@/shared/lib/utils/emitter/emitter.util';

import { queryClient } from '../react-query';

import { EventTypes } from './web-socket.constants';

let webSocket: WebSocket;

export const useSubscribeToWebSocketMessages = () => {
    const accountId = useSelector(selectAccountId);
    const dispatch = useDispatch();

    const { fetchUnreadMessagesCount } = useUnreadMessagesCount();
    const { fetchNotificationsCount } = useNotificationsCount();

    useEffect(() => {
        let timer: null | ReturnType<typeof setTimeout> = null;
        const close = () => {
            const authToken = config.auth.accessToken;
            if (authToken) {
                timer = setTimeout(() => {
                    start();
                }, 1000);
            }
        };

        const message = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            switch (data?.type) {
                case EventTypes.NEW_P2P_CHANNEL_CREATED: {
                    queryClient.invalidateQueries({ queryKey: [ChatsQueryKeysLegacy.CHATS_LIST] });

                    break;
                }
                case EventTypes.NEW_P2P_MESSAGE: {
                    const dataP2P: WsNewP2PMessage = data;
                    dispatch(
                        setNewMessage({
                            eventType: EventTypes.NEW_P2P_MESSAGE,
                            // @ts-expect-error - auto-ts-ignore

                            accountId: dataP2P.from_account_id,
                            channelId: dataP2P.channel_id,
                            messageId: dataP2P.message_id,
                        }),
                    );

                    fetchUnreadMessagesCount();

                    break;
                }
                case EventTypes.P2P_READ_BY_OPPONENT: {
                    const dataP2P: WsP2PReadByOpponent = data;
                    dispatch(
                        setReadByOpponent({
                            eventType: EventTypes.P2P_READ_BY_OPPONENT,
                            channelId: dataP2P.channel_id,
                            messageId: dataP2P.message_id,
                            lastReadDt: dataP2P.participant_last_read_dt,
                        }),
                    );

                    break;
                }
                case EventTypes.NEW_POST_COMMENT: {
                    if (!data?.current_device) {
                        emitterUtil.emit(EmitterEvents.NEW_POST_COMMENT, {
                            channel_id: data?.channel_id,
                            message_id: data?.message_id,
                        });
                    }
                    break;
                }
                case EventTypes.NEW_NOTIFICATION: {
                    const isNotificationsScreenRedesignEnabled = runFeature(
                        FeatureFlag.SETKA_5155_notifications_screen_redesign,
                        true,
                        false,
                    );

                    if (isNotificationsScreenRedesignEnabled) {
                        invalidateNotificationsUnreadCount();
                    } else {
                        fetchNotificationsCount();
                    }

                    break;
                }
                default:
                    break;
            }
        };

        const start = async () => {
            const { url } = await getWebSocketUrl();
            webSocket = new WebSocket(url);
            webSocket.addEventListener('close', close);
            webSocket.addEventListener('message', message);
        };

        const clean = () => {
            webSocket?.removeEventListener('close', close);
            webSocket?.removeEventListener('message', message);
            webSocket?.close();
            if (timer !== null) {
                clearTimeout(timer);
                timer = null;
            }
        };

        if (accountId) {
            start();
        } else {
            clean();
        }

        return () => {
            clean();
        };
    }, [accountId, dispatch, fetchNotificationsCount, fetchUnreadMessagesCount]);
};

export const sendConnectToNewComments = async (data: WsSubscribeData | WsUnsubscribeData) => {
    while (webSocket?.readyState === 0) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 200));
    }

    webSocket?.send(JSON.stringify(data));
};
