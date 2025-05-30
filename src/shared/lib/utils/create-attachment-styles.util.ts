import { type ImageStyle, type StyleProp } from 'react-native';

import { calculateBorderRadiusAndMargin } from '@/shared/lib/utils/calculate-attachments-styles.util';
import { type CalculatedStylesType } from '@/shared/ui/components/attach-collection/attach-collection.types';

export const createAttachmentStyles = ({
    previewImage,
    imageIndex,
    imagesCount,
}: CalculatedStylesType): StyleProp<ImageStyle> => {
    return [calculateBorderRadiusAndMargin(imageIndex, imagesCount), previewImage.containerLayout];
};
