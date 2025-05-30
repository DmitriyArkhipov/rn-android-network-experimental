import { type ChannelShortResponse, type MessageBodyResponse } from '@/shared/api/types/api.types';
import { type Attachment } from '@/shared/api/types/attachments.types';
import { Layout } from '@/shared/lib/utils/layout/layout-dimensions.constants';

const deviceWidth = Layout.window.width;
const MAX_HEIGHT = 375;

export type ImageSize = {
    width: number;
    height: number;
};

export type ImagesInfo = {
    [key: string]: {
        size: {
            width?: number;
            height?: number;
        };
    };
};

export type PostsImageSizes = {
    [postId: string]: Array<ImageSize>;
};

// число 0.0005 получино эксперементально. суть - незначительно уменьшаем делимое, чтобы сумма частных из-за погрешности не стала больше делимого
export const getResizedWidth = (partWindow: number, width: number = deviceWidth, separatorMargin: number = 2) =>
    (width - separatorMargin * (partWindow - 1) - 0.0005) / partWindow;

const getSizes = (imageInfo: ImagesInfo, images: Array<string>, width: number): Array<ImageSize> => {
    let imageSizesArray: Array<ImageSize> = [];

    if (images.length === 1) {
        const imageSize = imageInfo[images[0]!]?.size ?? { width: 0, height: 0 };

        let photoHeight = imageSize.height!;
        let photoWidth = imageSize.width!;

        if (imageSize.width! > width || imageSize.height! > MAX_HEIGHT) {
            const calculatedHeight = (imageSize.height! / imageSize.width!) * width;
            photoHeight = calculatedHeight > MAX_HEIGHT ? MAX_HEIGHT : calculatedHeight;
            photoWidth = calculatedHeight > MAX_HEIGHT ? (imageSize.width! / imageSize.height!) * photoHeight : width;
        }

        imageSizesArray.push({
            width: photoWidth,
            height: photoHeight,
        });
    } else if (images.length === 2) {
        const imageWidth = getResizedWidth(2, width);

        let imageWithMinHeightSizes = imageInfo[images[0]!]!.size;
        if (imageWithMinHeightSizes.height! > imageInfo[images[1]!]!.size.height!) {
            imageWithMinHeightSizes = imageInfo[images[1]!]!.size;
        }

        const calculatedHeight =
            ((imageWithMinHeightSizes?.height || 0) / (imageWithMinHeightSizes?.width || 1)) * imageWidth;
        let imageHeight = calculatedHeight < imageWidth ? imageWidth : calculatedHeight;
        if (imageHeight > MAX_HEIGHT) {
            imageHeight = MAX_HEIGHT;
        }

        imageSizesArray = [
            {
                width: imageWidth,
                height: imageHeight,
            },
            {
                width: imageWidth,
                height: imageHeight,
            },
        ];
    } else if (images.length === 3) {
        const firstImageSizes = imageInfo[images[0]!]!.size;

        const isFirstPhotoVertical = firstImageSizes.height! > firstImageSizes.width!;

        const bigImageWidth = isFirstPhotoVertical ? (width - 2) / 2 : (width / 3) * 2 + 2;
        const calculatedHeight = isFirstPhotoVertical
            ? ((firstImageSizes?.height || 0) / (firstImageSizes?.width || 1)) * bigImageWidth
            : bigImageWidth;
        const bigPhotoHeight = calculatedHeight > MAX_HEIGHT ? MAX_HEIGHT : calculatedHeight;

        const smallImagesWidth = width - bigImageWidth - 2;
        const smallImagesHeight = (bigPhotoHeight - 2) / 2;

        imageSizesArray = [
            {
                width: bigImageWidth,
                height: bigPhotoHeight,
            },
            {
                width: smallImagesWidth,
                height: smallImagesHeight,
            },
            {
                width: smallImagesWidth,
                height: smallImagesHeight,
            },
        ];
    } else if (images.length === 4) {
        const imageWidth = getResizedWidth(2, width);

        imageSizesArray = images.map(() => ({
            width: imageWidth,
            height: imageWidth,
        }));
    } else if (images.length === 6) {
        const imageWidth = getResizedWidth(3, width);
        let imageHeight = imageWidth;

        let allVertical = true;
        for (let index = 0; index < images.length; index++) {
            const { size } = imageInfo[images[index]!]!;

            if (size.height! <= size.width!) {
                allVertical = false;
            }
        }

        if (allVertical) {
            imageHeight = imageWidth * 1.38;
        }

        imageSizesArray = images.map(() => ({
            width: imageWidth,
            height: imageHeight,
        }));
    } else {
        const firstRowImageWidth = getResizedWidth(2, width);
        const secondRowImageWidth = getResizedWidth(images.length - 2, width);

        let imageWithMinHeightSizes = imageInfo[images[0]!]!.size;
        if (imageWithMinHeightSizes.height! > imageInfo[images[1]!]!.size.height!) {
            imageWithMinHeightSizes = imageInfo[images[1]!]!.size;
        }

        const calculatedHeight =
            ((imageWithMinHeightSizes?.height || 0) / (imageWithMinHeightSizes?.width || 1)) * firstRowImageWidth;
        let firstRowImageHeight = calculatedHeight < firstRowImageWidth ? firstRowImageWidth : calculatedHeight;
        if (firstRowImageHeight > 300) {
            firstRowImageHeight = 300;
        }

        imageSizesArray = images.map((_, index) => {
            if (index < 2) {
                return {
                    width: firstRowImageWidth,
                    height: firstRowImageHeight,
                };
            }

            return {
                width: secondRowImageWidth,
                height: secondRowImageWidth * 1.4,
            };
        });
    }

    return imageSizesArray;
};

export const mapPostImageSizes = (posts: Array<ChannelShortResponse>, width = deviceWidth): PostsImageSizes =>
    posts.reduce((mapedImageHeight, post) => {
        const images =
            post.first_messages?.[0]?.img?.map((imageUrl) => {
                const parts = imageUrl.split('/');

                return parts[parts.length - 1];
            }) || [];
        if (!images.length) {
            return mapedImageHeight;
        }

        const imageInfo = post.first_messages![0]!.img_info;

        // @ts-expect-error - auto-ts-ignore

        const imageSizesArray: Array<ImageSize> = getSizes(imageInfo, images, width);

        return {
            ...mapedImageHeight,
            [post.id]: imageSizesArray,
        };
    }, {});

export const messageImageSize = (comments: Array<MessageBodyResponse>, width = deviceWidth): PostsImageSizes =>
    comments.reduce((mapedImageHeight, comment) => {
        const images =
            comment?.img?.map((imageUrl) => {
                const parts = imageUrl.split('/');

                return parts[parts.length - 1];
            }) || [];
        if (!images.length) {
            return mapedImageHeight;
        }

        const imageInfo = comment.img_info;
        // @ts-expect-error - auto-ts-ignore

        const imageSizesArray = getSizes(imageInfo, images, width);

        return {
            ...mapedImageHeight,
            [comment.id]: imageSizesArray,
        };
    }, {});

export const newAttachmentsImageSize = (attachments: Array<Attachment>, width = deviceWidth): Array<ImageSize> => {
    if (!attachments.length) {
        return [];
    }

    const imageInfo: ImagesInfo = {};
    const images: Array<string> = [];

    attachments.forEach((attachment) => {
        imageInfo[attachment.path] = {
            size: {
                width: attachment.width,
                height: attachment.height,
            },
        };

        images.push(attachment.path);
    });

    return getSizes(imageInfo, images, width);
};
