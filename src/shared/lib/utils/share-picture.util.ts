import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share, { type ShareOptions } from 'react-native-share';

export const sharePicture = async (url: string) => {
    const uri = (
        await ReactNativeBlobUtil.config({
            fileCache: true,
            appendExt: 'png',
        }).fetch('GET', url)
    ).path();

    const options = Platform.select<ShareOptions>({
        ios: {
            activityItemSources: [
                {
                    placeholderItem: { type: 'url', content: uri },
                    item: {
                        default: { type: 'url', content: uri },
                    },
                    linkMetadata: {
                        originalUrl: ' ',
                        image: uri,
                    },
                },
            ],
        },
        default: {
            url: `file://${uri}`,
        },
    });

    return Share.open(options);
};
