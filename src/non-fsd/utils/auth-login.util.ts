import getStore from '@/app/model';

import { setChallengeState } from '@/entities/otp/model/otp.actions';
import { setLogin } from '@/entities/settings/model/settings.actions';

import { HttpError } from '@/shared/api/api-client/utils/http-error';
import { postSmsChallenge } from '@/shared/api/data/authorization.data';
import { snack } from '@/shared/ui/design-system';

import { push } from '@/navigation/navigation-methods.util';
import { Screens } from '@/navigation/screens.constants';

export const handleQuickAuth = async (login: string, otpCode: string) => {
    const store = getStore();

    store?.dispatch(setLogin(login!));

    try {
        const challengeResponse = await postSmsChallenge(login);

        store?.dispatch(
            setChallengeState({
                nextAttemptTimeSendOtp: challengeResponse.next_attempt_time_send_otp,
                challengeExpirationTime: challengeResponse.challenge_expiration_time,
                otpCodeLength: challengeResponse.otp_code_length,
                challengeId: challengeResponse.challenge_id,
            }),
        );

        push(Screens.ONBOARDING_OTP, {
            maskedPhoneNumber: login,
            initialOtpCode: otpCode,
        });
    } catch (error) {
        if (error instanceof HttpError) {
            snack.negative({
                text: 'ошибка при быстрой авторизации',
            });
        }
    }
};
