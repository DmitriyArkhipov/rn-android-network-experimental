import apiClientService from '@/shared/api/api-client/api-client.service';

export const verifyCaptcha = (captcha: string, state: string): Promise<void> => {
    const formdata = new FormData();
    formdata.append('state', state);
    formdata.append('text', captcha);

    return apiClientService.request({
        url: 'captcha/verify',
        method: 'post',
        data: formdata,
        headers: {
            'Content-Type': 'multipart/form-data;',
        },
    }) as unknown as Promise<void>;
};

export const generateCaptcha = (state: string): Promise<{ state: string; image_url: string }> => {
    const formdata = new FormData();
    formdata.append('state', state);

    return apiClientService.request({
        url: 'captcha/new',
        method: 'post',
        data: formdata,
        headers: {
            'Content-Type': 'multipart/form-data;',
        },
    }) as Promise<{ state: string; image_url: string }>;
};
