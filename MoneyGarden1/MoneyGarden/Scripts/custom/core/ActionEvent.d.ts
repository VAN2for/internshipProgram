declare type Never = {
    readonly s: unique symbol;
};
declare type ActionArgs<P1, P2, P3, P4, P5, P6, P7, P8, P9> = P1 extends Never ? [] : P2 extends Never ? [P1] : P3 extends Never ? [P1, P2] : P4 extends Never ? [P1, P2, P3] : P5 extends Never ? [P1, P2, P3, P4] : P6 extends Never ? [P1, P2, P3, P4, P5] : P7 extends Never ? [P1, P2, P3, P4, P5, P6] : P8 extends Never ? [P1, P2, P3, P4, P5, P6, P7] : P9 extends Never ? [P1, P2, P3, P4, P5, P6, P7, P8] : [
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9
];
declare type Action<P1 = Never, P2 = Never, P3 = Never, P4 = Never, P5 = Never, P6 = Never, P7 = Never, P8 = Never, P9 = Never> = {
    (...args: ActionArgs<P1, P2, P3, P4, P5, P6, P7, P8, P9>): void;
};
declare type Func<R = void, P1 = Never, P2 = Never, P3 = Never, P4 = Never, P5 = Never, P6 = Never, P7 = Never, P8 = Never, P9 = Never> = {
    (...args: ActionArgs<P1, P2, P3, P4, P5, P6, P7, P8, P9>): R;
};
interface ActionData<P1, P2, P3, P4, P5, P6, P7, P8, P9> {
    event: Action<P1, P2, P3, P4, P5, P6, P7, P8, P9>;
    target?: any;
}
/**
 * 这是一个事件派发器，提供了Action的泛型推导功能。
 * @example
 * let event = new ActionEvent<number, string>();
 * let action1:Action<number, string>;
 * // 添加事件
 * event.AddEvent(action1);
 * // 删除事件
 * event.RemoveEvent(action1);
 * // 派发事件
 * event.DispatchAction(1, "t");
 * @author hubluesky
 * @see Action
 * @todo If have any questions, just call me.
 */
declare class ActionEvent<P1 = Never, P2 = Never, P3 = Never, P4 = Never, P5 = Never, P6 = Never, P7 = Never, P8 = Never, P9 = Never> {
    protected eventList: ActionData<P1, P2, P3, P4, P5, P6, P7, P8, P9>[];
    get isEmpty(): boolean;
    get length(): number;
    AddEvent(event: Action<P1, P2, P3, P4, P5, P6, P7, P8, P9>, target?: any): void;
    Contains(event: Action<P1, P2, P3, P4, P5, P6, P7, P8, P9>, target?: any): boolean;
    RemoveEvent(event: Action<P1, P2, P3, P4, P5, P6, P7, P8, P9>, target?: any): void;
    ClearEvents(): void;
    DispatchAction(...args: ActionArgs<P1, P2, P3, P4, P5, P6, P7, P8, P9>): void;
}
