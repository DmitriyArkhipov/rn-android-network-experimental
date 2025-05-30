export type ChallengeResponse = {
    next_attempt_time_send_otp: string;
    challenge_expiration_time: string;
    otp_code_length: number;
    challenge_id: string;
};

export type ChallengeByIdResponse = {
    access_token: string;
    token_type: string;
    access_token_expired_at: string;
    refresh_token_expired_at: string;
    refresh_token: string;
};

export type AuthResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    token_type: string;
};
