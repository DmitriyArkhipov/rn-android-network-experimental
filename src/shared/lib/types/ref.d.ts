type InferRefAttributes<Ref> = Ref extends React.RefAttributes<infer RefElement> ? RefElement : never;

declare type InferRef<T> = T extends React.ForwardRefExoticComponent<infer Ref> ? InferRefAttributes<Ref> : never;
