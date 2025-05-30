import { useCallback, useState } from 'react';

type UseManualRefetchParams = {
    onRefetch: () => Promise<any>;
};

export const useManualRefetch = ({ onRefetch }: UseManualRefetchParams) => {
    const [isRefetching, setIsRefetching] = useState(false);

    const refetch = useCallback(async () => {
        setIsRefetching(true);

        try {
            await onRefetch();
        } finally {
            setIsRefetching(false);
        }
    }, [onRefetch]);

    return {
        refetch,
        isRefetching,
    };
};
