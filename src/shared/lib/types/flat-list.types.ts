import { type FlatListProps } from 'react-native';
import { type FlashListProps } from '@shopify/flash-list';

export type FlatListProp<Item, Prop extends keyof FlatListProps<Item>> = NonNullable<FlatListProps<Item>[Prop]>;

export type FlashListProp<Item, Prop extends keyof FlashListProps<Item>> = NonNullable<FlashListProps<Item>[Prop]>;
