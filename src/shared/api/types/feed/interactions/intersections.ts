import { type paths } from '@/shared/api/types/generated-api.types';

export type FeedsInteractions =
    paths['/v1/feeds/interactions']['get']['responses']['200']['content']['application/json'];
