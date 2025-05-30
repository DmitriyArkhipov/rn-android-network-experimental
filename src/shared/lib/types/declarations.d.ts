declare module '*.svg' {
    import type React from 'react';
    import { type SvgProps } from 'react-native-svg';

    const content: React.FC<SvgProps>;
    export default content;
}

declare module '*.png' {
    import type { ImageSourcePropType } from 'react-native';

    const value: ImageSourcePropType;
    export = value;
}

type Maybe<T> = T | null | undefined;

declare module 'react-native-url-polyfill/auto';

declare type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

declare type ToString<T extends string | number | bigint | boolean | null | undefined> = `${T}`;
