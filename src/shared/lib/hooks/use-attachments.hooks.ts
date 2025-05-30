import { useCallback } from 'react';

import { type Attachment } from '@/shared/api/types/attachments.types';
import { useAttachmentsActionSheet } from '@/shared/lib/hooks/use-attachments-action-sheet.hooks';
import { useImagePicker } from '@/shared/lib/hooks/use-image-picker';
import { type PickerError } from '@/shared/lib/services/image-picker/image-picker.service';

import { usePhotoAvailability } from './use-photo-availability.hooks';

type UseAttachmentsOptions = {
    currentAttachmentsCount?: number;
    maxAttachmentsCount?: number;
    onSuccess?: (attachments: Array<Attachment>) => void;
    onError?: (error: PickerError) => void;
};

const ATTACHMENT_WIDTH = 300;
const ATTACHMENT_HEIGHT = 300;

export const useAttachments = ({
    currentAttachmentsCount,
    maxAttachmentsCount = 1,
    onSuccess,
    onError,
}: UseAttachmentsOptions) => {
    const { openCamera, openGallery } = useImagePicker({ onError });
    const { openAttachmentsModal } = useAttachmentsActionSheet();

    const { isMemoryAvailable } = usePhotoAvailability();

    const maxFiles = currentAttachmentsCount && maxAttachmentsCount - currentAttachmentsCount;

    const handleOpenGallery = useCallback(async () => {
        const result = await openGallery({
            multiple: true,
            width: ATTACHMENT_WIDTH,
            height: ATTACHMENT_HEIGHT,
            showsSelectedCount: true,
            maxFiles,
        });

        if (!result) {
            return;
        }

        onSuccess?.(result);
    }, [maxFiles, onSuccess, openGallery]);

    const handleOpenCamera = useCallback(async () => {
        const result = await openCamera({ width: ATTACHMENT_WIDTH, height: ATTACHMENT_HEIGHT });

        if (!result) {
            return;
        }

        onSuccess?.([result]);
    }, [onSuccess, openCamera]);

    const openAttachmentsActionSheet = useCallback(() => {
        openAttachmentsModal({ handleOpenCamera, handleOpenGallery });
    }, [handleOpenCamera, handleOpenGallery, openAttachmentsModal]);

    return {
        openAttachmentsModal: openAttachmentsActionSheet,
        openGallery: handleOpenGallery,
        openCamera: handleOpenCamera,
        isMemoryAvailable,
    };
};
