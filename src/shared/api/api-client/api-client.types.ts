// import { type ResizeFormat } from '@bam.tech/react-native-image-resizer';
import { type AxiosRequestConfig } from 'axios';

export type ImageUploadOptions = { format?: any; quality?: number };

export type CustomAxiosRequestConfig = {
    retryCount?: number;
} & AxiosRequestConfig;
