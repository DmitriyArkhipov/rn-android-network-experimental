import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Control, useController } from 'react-hook-form';
import { LayoutAnimation } from 'react-native';

import apiClientService from '@/shared/api/api-client/api-client.service';
import { type UploadFileResponse } from '@/shared/api/types/api.types';
import { type Attachment } from '@/shared/api/types/attachments.types';
import { EmitterEvents } from '@/shared/lib/utils/emitter/emitter.constants';
import emitterUtil from '@/shared/lib/utils/emitter/emitter.util';

export type ImageLoadState = {
    isUploaded: boolean;
    isLoading: boolean;
    attachment: Attachment | string;
};

export type LoadedImagesState = {
    [path: string]: ImageLoadState;
};

export const useToolbarAttachments = <T>(
    // @ts-expect-error - auto-ts-ignore

    control: Control<T, object>,
    fieldName: string,
    initialAttachments: Array<Attachment> = [],
    animationLayoutHandler: () => void = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
) => {
    const initialImagesLoadedState = useMemo(
        () =>
            initialAttachments.reduce((result: LoadedImagesState, item: Attachment): LoadedImagesState => {
                const newResult: LoadedImagesState = { ...result };

                newResult[item.path] = { isUploaded: true, isLoading: false, attachment: item };

                return newResult;
            }, {}),
        [initialAttachments],
    );

    const {
        field: { onChange: onAttachmentsChange, value: attachments },
    } = useController<any, any>({
        name: fieldName,
        control,
    });

    const [loadedImagesState, setLoadedImagesState] = useState<LoadedImagesState>(initialImagesLoadedState);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [renderedAttachments, setRenderedAttachments] = useState<Array<Attachment | string>>(initialAttachments);

    // todo - Требует оптимизации
    // - Словарь с актуальными значениями состояний ячеек
    // для работы с актуальными значениями в асинхронных задачах
    // стейт иногда выдает устаревшие значения, поэтому он не подошел для синхронизации
    // и добавления значений
    const contextLoadedImagesState = useRef<LoadedImagesState>(loadedImagesState);

    // todo - Требует оптимизации
    // - Массив загруженных аттачей
    // требуется для того чтобы асинхронно захватывать актуальные загруженные данные
    // значения из attachments возвращаются не корректно
    const loadedAttachmentIds = useRef<Array<string>>(attachments);

    const removedAttachmentsPaths = useRef<Array<string>>([]);

    useEffect(() => {
        animationLayoutHandler();
    }, [animationLayoutHandler, renderedAttachments.length]);

    const clearAttachments = useCallback(() => {
        onAttachmentsChange([]);
        setLoadedImagesState({});
        setRenderedAttachments([]);
        loadedAttachmentIds.current = [];
        contextLoadedImagesState.current = {};
    }, [onAttachmentsChange]);

    const handleLoadedAttachment = useCallback((attachment: Attachment, loadPersent: number) => {
        const newLoadedImageState = { ...contextLoadedImagesState.current };

        if (loadPersent === 1) {
            newLoadedImageState[attachment.path] = {
                attachment,
                isLoading: false,
                isUploaded: true,
            };

            contextLoadedImagesState.current = newLoadedImageState;

            setLoadedImagesState(contextLoadedImagesState.current);
        }
    }, []);

    const isLoadingAll = useCallback(
        () =>
            Object.keys(contextLoadedImagesState.current)
                .map((key: string) => contextLoadedImagesState.current[key]!.isLoading)
                .filter((item: boolean) => item === true).length !== 0,
        [],
    );

    const handleLoadProgressImages = useCallback(
        async (newAttachments: Array<Attachment | string>) => {
            const newAttachmentsLoadingState = newAttachments.reduce(
                (result: LoadedImagesState, item: Attachment | string): LoadedImagesState => {
                    const newResult: LoadedImagesState = { ...result };
                    const path = (item as Attachment).path ?? item;

                    if (
                        !contextLoadedImagesState.current[path] ||
                        (!contextLoadedImagesState.current[path]?.isUploaded &&
                            !contextLoadedImagesState.current[path]?.isLoading)
                    ) {
                        newResult[path] = { isUploaded: false, isLoading: false, attachment: item };
                    }

                    return newResult;
                },
                {},
            );

            const uploadsMap: { [key: number]: string } = {};
            const uploads = Object.keys(newAttachmentsLoadingState).reduce(
                (result: Array<Promise<UploadFileResponse | undefined>>, key: string, index: number) => {
                    const newResult: Array<Promise<UploadFileResponse | undefined>> = [...result];

                    const newUploadPromise: Promise<UploadFileResponse | undefined> = new Promise(
                        (resolve, rejectUpload) => {
                            const removeEmitterSubscribe = emitterUtil.subscribe(
                                EmitterEvents.CANCEL_UPLOAD_IMAGE,
                                ({ uploadKey }: { uploadKey: string }) => {
                                    if (uploadKey === key) {
                                        removeEmitterSubscribe();
                                        resolve(undefined);
                                    }
                                },
                            );

                            apiClientService
                                .imageUpload({
                                    uploadedImage: newAttachmentsLoadingState[key]!.attachment as Attachment,
                                    onUploadProgress: handleLoadedAttachment,
                                })
                                .then((imageUploadResponse: UploadFileResponse) => {
                                    resolve(imageUploadResponse);
                                })
                                .catch((error: any) => {
                                    rejectUpload(error);
                                })
                                .finally(() => {
                                    removeEmitterSubscribe();
                                });
                        },
                    );

                    newResult.push(newUploadPromise);
                    uploadsMap[index] = (newAttachmentsLoadingState[key]!.attachment as Attachment).path;

                    return newResult;
                },
                [],
            );

            const startLoadingStates = Object.keys(newAttachmentsLoadingState).reduce(
                (result: LoadedImagesState, key: string): LoadedImagesState => {
                    const newResult: LoadedImagesState = { ...result };

                    newResult[key] = {
                        ...newAttachmentsLoadingState[key]!,
                        isLoading: true,
                    };

                    return newResult;
                },
                {},
            );

            contextLoadedImagesState.current = { ...contextLoadedImagesState.current, ...startLoadingStates };
            setLoadedImagesState(contextLoadedImagesState.current);
            setIsLoading(true);

            try {
                const imagesResponses = await Promise.all(uploads);

                const newAttachmentsLoaded = imagesResponses.reduce(
                    (result: Array<string>, response: UploadFileResponse | undefined, index: number): Array<string> => {
                        const newResult = [...result];

                        if (response && !removedAttachmentsPaths.current.includes(uploadsMap[index]!)) {
                            newResult.push(response.id);
                        }

                        return newResult;
                    },
                    [],
                );

                loadedAttachmentIds.current = [...loadedAttachmentIds.current, ...newAttachmentsLoaded];
                setIsLoading(isLoadingAll());
                onAttachmentsChange(loadedAttachmentIds.current);
            } catch (error) {
                clearAttachments();
                setIsLoading(false);
            }
        },
        [clearAttachments, handleLoadedAttachment, isLoadingAll, onAttachmentsChange],
    );

    const newAttachmentAdded = useCallback(
        (newAttachments: Array<Attachment>, handleLoading = true) => {
            setRenderedAttachments([...renderedAttachments, ...newAttachments]);

            if (handleLoading) {
                handleLoadProgressImages([...newAttachments, ...renderedAttachments]);
            }
        },
        [handleLoadProgressImages, renderedAttachments],
    );

    const removeLoadedImageState = useCallback((paths: Array<string>) => {
        const newContextLoadedImagesState = Object.keys(contextLoadedImagesState.current).reduce(
            (result: LoadedImagesState, key: string) => {
                const newResult = { ...result };

                if (!paths.includes(key)) {
                    newResult[key] = contextLoadedImagesState.current[key]!;
                }

                return newResult;
            },
            {},
        );

        paths.forEach((key: string) => {
            emitterUtil.emit(EmitterEvents.CANCEL_UPLOAD_IMAGE, { uploadKey: key });
        });

        contextLoadedImagesState.current = newContextLoadedImagesState;
    }, []);

    const removeAttachment = useCallback(
        (index: number) => {
            const currentRemovedAttachment = renderedAttachments.toSpliced(index, 1);
            setRenderedAttachments(currentRemovedAttachment);

            removedAttachmentsPaths.current = [
                ...removedAttachmentsPaths.current,
                ...currentRemovedAttachment.map((item: any) => item.path ?? item),
            ];

            loadedAttachmentIds.current = loadedAttachmentIds.current.toSpliced(index, 1);
            onAttachmentsChange(loadedAttachmentIds.current);

            removeLoadedImageState(removedAttachmentsPaths.current);
            setIsLoading(isLoadingAll());
        },
        [isLoadingAll, onAttachmentsChange, removeLoadedImageState, renderedAttachments],
    );

    return {
        attachments: renderedAttachments as Array<Attachment>,
        newAttachmentAdded,
        removeAttachment,
        clearAttachments,
        loadedImagesState,
        isLoading,
    };
};
