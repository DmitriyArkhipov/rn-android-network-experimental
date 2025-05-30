import { useCallback, useMemo, useState } from 'react';

import { debounce } from '@/shared/lib/services/lodash.util';

export const useSearchInput = () => {
    const [searchValue, setSearchValue] = useState('');

    // FIXME: попробовать сделать через либу use-debounce
    const onChangeText = useMemo(() => debounce((value: string) => setSearchValue(value), 400), []);

    const onClearText = useCallback(() => {
        setSearchValue('');
    }, []);

    return {
        searchValue,
        onChangeText,
        onClearText,
    };
};
