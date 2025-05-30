import { type paths } from '@/shared/api/types/generated-api.types';

type HttpMethod = 'get' | 'post' | 'delete' | 'patch' | 'update' | 'put';

export type GetResponseByPath<T extends keyof paths> = ResponseByPathAndMethod<T, 'get'>;
export type GetParamsByPath<T extends keyof paths> = ParamsByPathAndMethod<T, 'get'>;

export type PutBodyByPath<T extends keyof paths> = BodyByPathAndMethod<T, 'put'>;

export type PostResponseByPath<T extends keyof paths> = ResponseByPathAndMethod<T, 'post'>;
export type PostBodyByPath<T extends keyof paths> = BodyByPathAndMethod<T, 'post'>;

export type PatchBodyByPath<T extends keyof paths> = BodyByPathAndMethod<T, 'patch'>;

type ParamsByPathAndMethod<Path extends keyof paths, Method extends HttpMethod> =
    paths[Path] extends Record<
        Method,
        {
            parameters: {
                query?: infer Params;
            };
        }
    >
        ? Params
        : never;

type BodyByPathAndMethod<Path extends keyof paths, Method extends Exclude<HttpMethod, 'get' | 'delete'>> =
    paths[Path] extends Record<
        Method,
        {
            requestBody?: {
                content: {
                    'application/json': infer Body;
                };
            };
        }
    >
        ? Body
        : never;

type ResponseByPathAndMethod<Path extends keyof paths, Method extends HttpMethod> =
    paths[Path] extends Record<
        Method,
        {
            responses: {
                200: {
                    content: {
                        'application/json': infer Response;
                    };
                };
            };
        }
    >
        ? Response
        : never;
