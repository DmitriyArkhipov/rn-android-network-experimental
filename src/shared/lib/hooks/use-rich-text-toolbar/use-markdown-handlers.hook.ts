import type React from 'react';
import { useState } from 'react';
import { type SelectionNativeEvent } from 'react-native-editor';

import { MarkdownFormat } from '@/shared/lib/constants/markdown-formats.constants';

export const useMarkdownHandlers = (
    setActiveFormats: React.Dispatch<React.SetStateAction<MarkdownFormat[]>>,
    openModalHandler: () => void,
    setLink: (url: string) => void,
    setIsEditLinkMode: (isEditLinkMode: boolean) => void,
    clearLinkStates: () => void,
    handleShowFormats: () => void,
    handleHideFormats: () => void,
    getIsEditableLink?: (url: string) => boolean,
    onMentionPress?: () => void,
) => {
    const [wasWordSelected, setWasWordSelected] = useState(false);

    const handlePressFormat = (link: string) => (format: MarkdownFormat) => {
        if (format === MarkdownFormat.MENTION) {
            onMentionPress?.();

            return;
        }
        if (format === MarkdownFormat.LINK) {
            if (getIsEditableLink?.(link)) {
                openModalHandler();
            }

            return;
        }

        setActiveFormats((activeFormats) => {
            if (activeFormats.includes(format)) {
                return activeFormats.filter((activeFormat) => activeFormat !== format);
            }

            return [...activeFormats, format];
        });
    };

    const handleSelectionChange = (start: number, end: number, _: string, event: SelectionNativeEvent) => {
        clearLinkStates();

        const { url } = event.nativeEvent;

        if (url) {
            setLink(url);
            setIsEditLinkMode(true);
        }

        const selectionLength = end - start;

        if (selectionLength > 0) {
            setWasWordSelected(true);
            handleShowFormats();
        } else if (wasWordSelected) {
            setWasWordSelected(false);
            handleHideFormats();
        }
    };

    return { handlePressFormat, handleSelectionChange };
};
