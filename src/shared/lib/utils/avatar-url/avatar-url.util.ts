import { type Source } from 'react-native-fast-image';

import { UPLOAD_MAX_WIDTH } from './image-upload.constants';

export const avatarUrl = (sourceUrl: Maybe<string>, filesize: number): Source => {
    if (!sourceUrl) {
        return {};
    }

    const parsedAvatarUrl = new URL(sourceUrl);
    const headers = {};

    if (filesize >= 200) {
        // @ts-expect-error - auto-ts-ignore

        headers.Accept = 'image/jpeg';
    }

    let filesizeParam = `w${filesize}`;

    if (filesize * 2 > UPLOAD_MAX_WIDTH) {
        filesizeParam = `w${UPLOAD_MAX_WIDTH}`;
    } else {
        filesizeParam = `w${filesize * 2}`;
    }

    parsedAvatarUrl.searchParams.set('filesize', filesizeParam);

    return {
        uri: parsedAvatarUrl.toString(),
        headers,
    };
};
