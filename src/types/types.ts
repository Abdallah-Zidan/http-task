export type ResolveFunction = (d: any) => any;
export type RejectFunction = (e: any) => any;
export type ForkMethod = (
  reject: RejectFunction,
  resolve: ResolveFunction
) => void;
export type MappableFunction = (d: any) => any;
export type ChainableFunction<T>=(d:any)=>T;
export interface MappableFunctor {
  map: (fn: MappableFunction) => MappableFunctor;
}

export type ObjectMappingFunction = (arr: [k: string, v: any]) => any;
