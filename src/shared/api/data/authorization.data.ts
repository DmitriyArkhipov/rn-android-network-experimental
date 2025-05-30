import apiClientService from '@/shared/api/api-client/api-client.service';
import type { ChallengeByIdResponse, ChallengeResponse } from '@/shared/api/types/auth.types';

export const postChallengeById = (challenge_id: string, otp_code: string): Promise<ChallengeByIdResponse> =>
    apiClientService.request<ChallengeByIdResponse>({
        method: 'post',
        url: `v1/oauth/challenges/${challenge_id}/response`,
        data: { otp_code },
    });

export const postSmsChallenge = async (login: string, token?: string): Promise<ChallengeResponse> =>
    apiClientService.request<ChallengeResponse>(
        {
            method: 'post',
            url: 'v1/oauth/challenges/sms',
            data: token ? { token, login } : { login },
        },
        false,
        true,
    );

export const postSmsChallengeRetry = async (challengeId: string, token?: string): Promise<ChallengeResponse> =>
    apiClientService.request<ChallengeResponse>(
        {
            method: 'post',
            url: `v1/oauth/challenges/sms/${challengeId}/retry`,
            data: token ? { token } : {},
        },
        false,
        true,
    );

export const postRevokeSession = () =>
    apiClientService.request({
        method: 'post',
        url: `v1/oauth/revoke`,
    });
