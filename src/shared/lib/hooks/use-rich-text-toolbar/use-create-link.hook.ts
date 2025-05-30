import { type MutableRefObject, useCallback, useState } from 'react';
import { type TextInputSelectionChangeEventData } from 'react-native';

import { RegExpConstants } from '@/shared/lib/constants/regex.constants';

import { type RichTextInput } from '../../../ui/components/rich-text-input/rich-text-input.types';

export const useCreateLink = (
    currentSelection: MutableRefObject<TextInputSelectionChangeEventData['selection']>,
    textInputRef: MutableRefObject<RichTextInput | undefined>,
) => {
    const [link, setLink] = useState('');
    const [isEditLinkMode, setIsEditLinkMode] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const clearLinkStates = useCallback(() => {
        setLink('');
        setIsEditLinkMode(false);
    }, []);

    const openModalHandler = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    const closeModalHandler = useCallback(() => {
        textInputRef.current?.focus();
        setIsModalVisible(false);
    }, [textInputRef]);

    const editLink = useCallback(() => {
        if (!link) {
            textInputRef.current?.removeLink();
            clearLinkStates();
        } else {
            textInputRef.current?.setLink(link);
        }
    }, [clearLinkStates, link, textInputRef]);

    const linkSubmitSuccessHandler = useCallback(() => {
        if (isEditLinkMode) {
            editLink();

            return;
        }

        const { start, end } = currentSelection.current;

        const linkRegexp = new RegExp(RegExpConstants.advancedHttpLink);

        if (linkRegexp.test(link)) {
            textInputRef.current?.setLink(link);

            return;
        }

        if (start === end) {
            textInputRef.current?.appendWord(link);
        }
        clearLinkStates();
    }, [clearLinkStates, currentSelection, editLink, isEditLinkMode, link, textInputRef]);

    return {
        link,
        isModalVisible,
        isEditLinkMode,
        setLink,
        clearLinkStates,
        openModalHandler,
        setIsEditLinkMode,
        closeModalHandler,
        linkSubmitSuccessHandler,
    };
};
