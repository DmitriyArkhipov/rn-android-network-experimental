import { useCallback } from 'react';

import { type ActionSheetConfig, useActionSheet } from '@/shared/ui/design-system/layouts';

import { usePhotoAvailability } from './use-photo-availability.hooks';

type UseAttachmentsActionSheetOptions = {
    isDeletable?: boolean;
};

type OpenAttachmentParams = {
    handleOpenCamera?: () => void;
    handleOpenGallery?: () => void;
    handleDeletePhoto?: () => void;
};

export const useAttachmentsActionSheet = (options?: UseAttachmentsActionSheetOptions) => {
    const { isDeletable } = options ?? {};

    const { openActionSheet } = useActionSheet();

    const { isMemoryAvailable } = usePhotoAvailability();

    const openAttachmentsModal = useCallback(
        ({ handleDeletePhoto, handleOpenCamera, handleOpenGallery }: OpenAttachmentParams) => {
            const actionSheetOptions: ActionSheetConfig['options'] = [];

            if (isMemoryAvailable && handleOpenCamera) {
                actionSheetOptions.push({
                    label: 'сделать фото',
                    onPress: handleOpenCamera,
                    iconName: 'photo',
                    testID: 'button_take_photo',
                });
            }

            if (handleOpenGallery) {
                actionSheetOptions.push({
                    label: 'загрузить',
                    onPress: handleOpenGallery,
                    iconName: 'folder',
                    testID: 'button_upload_photo',
                });
            }

            if (isDeletable && handleDeletePhoto) {
                actionSheetOptions.push({
                    label: 'удалить',
                    onPress: handleDeletePhoto,
                    iconName: 'trash',
                    type: 'negative',
                    testID: 'button_delete_photo',
                });
            }

            openActionSheet({ options: actionSheetOptions });
        },
        [isDeletable, isMemoryAvailable, openActionSheet],
    );

    return {
        openAttachmentsModal,
        isMemoryAvailable,
    };
};
