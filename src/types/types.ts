export type ResolveFunction<R> = (d: R) => any;
export type RejectFunction<E> = (e: E) => any;

export type ForkMethod<E, R> = (
  reject: RejectFunction<E>,
  resolve: ResolveFunction<R>
) => void;
export type MappableFunction = (d: any) => any;
export type ChainableFunction<T> = (d: any) => T;
export interface MappableFunctor {
  map: (fn: MappableFunction) => MappableFunctor;
}

export type ObjectMappingFunction = (arr: [k: string, v: any]) => any;
