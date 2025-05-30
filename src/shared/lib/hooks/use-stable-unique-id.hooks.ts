import { useMemo } from 'react';

import { generateUniqueId } from '@/shared/lib/utils/generate-unique-id.util';

export const useStableUniqueId = () => useMemo(generateUniqueId, []);
