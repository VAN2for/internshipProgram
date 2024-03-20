namespace ps.ease {
export type EasingFunction = (amount: number) => number;
export interface ICustomEase {
    readonly easeFunc: EasingFunction;
}
}