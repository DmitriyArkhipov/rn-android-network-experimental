import { useState } from 'react';

import { savePicture } from '@/shared/lib/services/save-picture.util';

export const useSavePhoto = () => {
    const [isLoading, setIsLoading] = useState(false);

    const savePhoto = async (url: string) => {
        setIsLoading(true);
        try {
            await savePicture(url);
        } finally {
            setIsLoading(false);
        }
    };

    return [isLoading, savePhoto] as const;
};
