import { useCallback } from 'react';

import ImagePicker, {
    isPickerError,
    type OpenPickerCallback,
    type PickerError,
    smartAlbums,
} from '@/shared/lib/services/image-picker/image-picker.service';

type UseImagePickerOptions = {
    onError?: (error: PickerError) => void;
};

export const useImagePicker = (options?: UseImagePickerOptions) => {
    const { onError } = options ?? {};

    const openGallery = useCallback<OpenPickerCallback>(
        async (pickerOptions) => {
            try {
                return await ImagePicker.openPicker({
                    smartAlbums,
                    ...pickerOptions,
                });
            } catch (e) {
                if (isPickerError(e)) {
                    onError?.(e);
                }

                return undefined;
            }
        },
        [onError],
    );

    const openCamera = useCallback<OpenPickerCallback>(
        async (pickerOptions) => {
            try {
                return await ImagePicker.openCamera(pickerOptions);
            } catch (e) {
                if (isPickerError(e)) {
                    onError?.(e);
                }

                return undefined;
            }
        },
        [onError],
    );

    return {
        openGallery,
        openCamera,
    };
};
