import { type MutableRefObject, useCallback, useState } from 'react';
import { type TextInputSelectionChangeEventData } from 'react-native';

import { type MarkdownFormat } from '@/shared/lib/constants/markdown-formats.constants';

import { type RichTextInput } from '../../../ui/components/rich-text-input/rich-text-input.types';

import { useCreateLink } from './use-create-link.hook';
import { useMarkdownHandlers } from './use-markdown-handlers.hook';

export const useRichTextToolbar = (
    currentSelection: MutableRefObject<TextInputSelectionChangeEventData['selection']>,
    textInputRef: MutableRefObject<RichTextInput | undefined>,
    getIsEditableLink?: (url: string) => boolean,
    onMentionPress?: () => void,
) => {
    const [formatsShown, setFormatsShown] = useState(false);
    const [activeFormats, setActiveFormats] = useState<MarkdownFormat[]>([]);

    const handleShowFormats = useCallback(() => {
        setFormatsShown(true);
    }, []);

    const handleHideFormats = useCallback(() => {
        setFormatsShown(false);
    }, []);

    const {
        link,
        isModalVisible,
        isEditLinkMode,
        setLink,
        clearLinkStates,
        openModalHandler,
        setIsEditLinkMode,
        closeModalHandler,
        linkSubmitSuccessHandler,
    } = useCreateLink(currentSelection, textInputRef);

    const { handlePressFormat, handleSelectionChange } = useMarkdownHandlers(
        setActiveFormats,
        openModalHandler,
        setLink,
        setIsEditLinkMode,
        clearLinkStates,
        handleShowFormats,
        handleHideFormats,
        getIsEditableLink,
        onMentionPress,
    );

    const handleActiveFormatsChange = useCallback((e: { nativeEvent: { formats: MarkdownFormat[] } }) => {
        const newFormats = e.nativeEvent.formats;

        if (newFormats.length) {
            setFormatsShown(true);
        }

        setActiveFormats(newFormats);
    }, []);

    return {
        link,
        formatsShown,
        activeFormats,
        isModalVisible,
        isEditLinkMode,
        setLink,
        openModalHandler,
        setIsEditLinkMode,
        handleShowFormats,
        handleHideFormats,
        handlePressFormat: handlePressFormat(link),
        closeModalHandler,
        linkSubmitSuccessHandler,
        handleActiveFormatsChange,
        onInputSelectionChange: handleSelectionChange,
    };
};
