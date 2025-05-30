import ImageResizer, { type ResizeFormat } from '@bam.tech/react-native-image-resizer';

import { type Attachment } from '@/shared/api/types/attachments.types';
import { UPLOAD_MAX_WIDTH } from '@/shared/lib/utils/avatar-url/image-upload.constants';

type Params = {
    image: Attachment;
    format: ResizeFormat;
    quality: number;
};

export const imageResize = async ({ format, image, quality }: Params) => {
    const createImageSize = (width: number, height: number, newWidth: number) => {
        if (width > UPLOAD_MAX_WIDTH || height > UPLOAD_MAX_WIDTH) {
            const newHeight = (height / width) * newWidth;

            return {
                width: newWidth,
                height: newHeight,
            };
        }

        return { width, height };
    };

    const { height, width } = createImageSize(image.width, image.height, UPLOAD_MAX_WIDTH);

    const resizedImage = await ImageResizer.createResizedImage(image.path, width, height, format, quality);

    return {
        resizedImage,
    };
};
