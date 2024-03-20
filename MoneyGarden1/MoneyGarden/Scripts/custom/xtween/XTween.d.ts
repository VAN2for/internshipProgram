declare type UnknownProps = Record<string, any>;
declare type FlagExcludedType<Base, Type> = {
    [Key in keyof Base]: Base[Key] extends Type ? never : Key;
};
declare type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
declare type KeyPartial<T, K extends keyof T> = {
    [P in K]?: T[P];
};
declare type OmitType<Base, Type> = KeyPartial<Base, AllowedNames<Base, Type>>;
declare type ConstructorType<T> = OmitType<T, Function>;
declare type InterpolationFunction = (start: number, end: number, ratio: number) => number;
declare type LerpFunction<T> = (target: T, property: string, valuesStart: ConstructorType<T>, start: number, end: number, ratio: number, interpolation: InterpolationFunction) => void;
declare type EasingFunction = (amount: number) => number;
declare namespace ps {
    /**
     * Tween的可选参数
     */
    interface ITweenOption<T> {
        /**
         * 缓动函数，可以使用已有的，也可以传入自定义的函数。
         */
        easing?: EasingFunction;
        /**
         * 插值函数，参数的意义 start:起始值，end:目标值，ratio:当前进度
         */
        progress?: InterpolationFunction;
        /**
         * 回调，当缓动动作启动时触发。
         */
        onStart?: (target?: T) => void;
        /**
         * 回调，当缓动动作更新时触发。
         */
        onUpdate?: (target?: T, ratio?: number) => void;
        /**
         * 回调，当缓动动作完成时触发。
         */
        onComplete?: (target?: T) => void;
    }
    /**
     * 这是一个补间动画
     * 支持对象的number属性
     * 支持自定义插值，默认是线性插值。可以自定义为贝塞尔等。
     * 支持每一个动作进行onStart, onUpdate, onComplete事件回调。
     * 支持泛型参数推导。可以对要补间的动画参数进行语法检查和补全。
     * 支持连续拼接动作。
     *
     * ```
     *  // 注意使用时需要每帧更新一下
     *  setInterval(XTween.updateTweens, 1);
     *
     *  class Target {
     *      visable: boolean = false;
     *      position = { x: 0, y: 0, z: 0 };
     *      rotation: number = 0;
     *      alpha: number = 0;
     *      width: number = 100;
     *      height: number = 200;
     *  }
     *
     *  let target = new Target();
     *  let target2 = new Target();
     *
     *  xtween(target)
     *      .to(1000, { width: 500, rotation: 360 }, { easing: XTween.Easing.Back.Out })
     *      .to(1500, { height: 600 }, {
     *          onComplete: (target) => {
     *              console.log("onComplete 1", target);
     *          }
     *      })
     *      .delay(1000)
     *      .repeat(4, true, xtween(target).to(300, { alpha: 1 }).to(300, { alpha: 0 }))
     *      .sequence(xtween(target).to(1000, { rotation: 100 }), xtween(target2).to(1000, { rotation: 100 }))
     *      .call(() => {
     *          console.log("Call 1", target, target2);
     *      })
     *      .to(1500, { position: { x: 10, y: 20, z: 30 } }, {
     *          onStart: (target) => {
     *              console.log("onStart ", target);
     *          }
     *      })
     *      .set({ visable: false })
     *      .call(() => {
     *          console.log("Call 2", target, target2);
     *      })
     *      .start();
     * ```
     */
    class XTween<T> {
        static Easing: {
            Linear: {
                None: (amount: number) => number;
            };
            Quadratic: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Cubic: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Quartic: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Quintic: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Sinusoidal: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Exponential: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Circular: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Elastic: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Back: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
            Bounce: {
                In: (amount: number) => number;
                Out: (amount: number) => number;
                InOut: (amount: number) => number;
            };
        };
        readonly target: T;
        private readonly actionList;
        private indexAction;
        private timeScale;
        private onFinallyFunc;
        private _isPlaying;
        private _isPaused;
        get isPlaying(): boolean;
        get isPaused(): boolean;
        /**
         * 创建一个补间动画
         * @param target 要补间的目标对象
         */
        constructor(target: T);
        /**
         * 设置时间缩放，默认是1
         * @param timeScale 时间缩放比例
         */
        setTimeScale(timeScale: number): this;
        /**
         * 对目标对象属性进行补间动作
         * @param duration 补间时长，单位毫秒
         * @param properties 属性集
         * @param options 补间可选参数
         * @returns 返回当前补间动画实例
         */
        to(duration: number, properties: ConstructorType<T>, options?: ITweenOption<T>): this;
        /**
          * 对目标对象属性进行补间动作
          * @param duration 补间时长，单位毫秒
          * @param properties 属性集
          * @param options 补间可选参数
          * @returns 返回当前补间动画实例
          */
        by(duration: number, properties: ConstructorType<T>, options?: ITweenOption<T>): this;
        /**
         * 对目录对象属性进行设置
         * @param properties 属性集
         * @returns 返回当前补间动画实例
         */
        set(properties: ConstructorType<T>): this;
        /**
         * 对当前补间动作进行延迟
         * @param duration 补间时长，单位毫秒
         * @returns 返回当前补间动画实例
         */
        delay(duration: number): this;
        /**
         * 在当前补间动作执行函数回调
         * @param callback 函数对象
         * @param thisArg 函数的this对象
         * @param argArray 函数的参数
         * @returns 返回当前补间动画实例
         */
        call<F extends (...args: any) => any>(callback: F, thisArg?: any, ...argArray: Parameters<F>): this;
        /**
         * 在当前补间动作加入一个按顺序执行的Tween集合
         * @param tweens Tween集合，该集合的Tween的target不需要与当前的target类型相同，每个Tween的target类型都可以不相同。
         * @returns 返回当前补间动画实例
         */
        sequence(...tweens: XTween<any>[]): this;
        /**
         * 在当前补间动作加入一个同时执行的Tween集合
         * @param tweens Tween集合，该集合的Tween的target不需要与当前的target类型相同，每个Tween的target类型都可以不相同。
         * @returns 返回当前补间动画实例
         */
        parallel(...tweens: XTween<any>[]): this;
        /**
         * 在当前补间动作加入一个重复执行的Tween
         * @param repeatTimes 重复次数，无限次数使用Infinity
         * @param pingPong 是否来回缓动
         * @param repeatTween 需要被重复执行的Tween
         * @returns 返回当前补间动画实例
         */
        repeat(repeatTimes: number, pingPong: boolean, repeatTween: XTween<any>): this;
        /**
         * 在当前补间动作加入一个无限重复执行的Tween
         * @param pingPong 是否来回缓动
         * @param repeatTween 需要被重复执行的Tween
         * @returns 返回当前补间动画实例
         */
        repeatForever(pingPong: boolean, repeatTween: XTween<any>): this;
        /**
         * 在当前补间动作加入一个Tween
         * @param thenTween 要插入执行的Tween
         * @returns 返回当前补间动画实例
         */
        then(thenTween: XTween<any>): this;
        /**
         * 开始当前Tween的所有动作
         * @returns 返回当前补间动画实例
         */
        start(): this;
        /**
         * 暂停当前Tween的所有动作
         * @returns 返回当前补间动画实例
         */
        pause(): this;
        /**
         * 恢复当前Tween的所有动作
         * @returns 返回当前补间动画实例
         */
        resume(): this;
        /**
         * 停止当前Tween的所有动作
         * @returns 返回当前补间动画实例
         */
        stop(): this;
        /**
         * 设置tween最终结果回调，如果tween是正常结束，返回参数为true，如果是非正常结束，返回参数为false。
         * @param callback 回调函数
         * @returns 返回当前补间动画实例
         */
        onFinally(callback: (isCompleted: boolean) => void): this;
        /**
         * 初始化所有Action，这是内部函数，请不要外部调用
         */
        _intializeActions(): void;
        /**
         * 开始所有Action，这是内部函数，请不要外部调用
         */
        _startActions(): void;
        /**
         * 翻转所有Action，这是内部函数，请不要外部调用
         */
        _reverseActions(): void;
        /**
         * 更新所有Action。这是内部函数，请不要外部调用
         * @returns 返回true表示执行所有Action完毕。false表示下一帧继续。
         */
        _updateActions(deltaTime: number): boolean;
        /**
         * 清理tween状态。这是内部函数，请不要外部调用
         */
        _clear(): void;
        /**
         * 创建一个重复执行的Tween
         * @param repeatTimes 重复次数，无限次数使用Infinity
         * @param pingPong 是否来回缓动
         * @param repeatTween 需要被重复执行的Tween
         * @returns 返回补间动画实例
         */
        static repeat<T>(repeatTimes: number, pingPong: boolean, repeatTween: XTween<T>): XTween<T>;
        /**
         * 创建一个无限重复执行的Tween
         * @param pingPong 是否来回缓动
         * @param repeatTween 需要被重复执行的Tween
         * @returns 返回补间动画实例
         */
        static repeatForever<T>(pingPong: boolean, repeatTween: XTween<T>): XTween<T>;
        /**
         * 创建一个按顺序执行的Tween集合
         * @param tweens Tween集合，每个Tween的target类型都可以不相同。
         * @returns 返回补间动画实例
         */
        static sequence(...tweens: XTween<any>[]): XTween<any>;
        /**
         * 创建一个同时执行的Tween集合
         * @param tweens Tween集合，每个Tween的target类型都可以不相同。
         * @returns 返回补间动画实例
         */
        static parallel(...tweens: XTween<any>[]): XTween<any>;
        /**
         * 删除所有的Tween
         */
        static removeAllTweens(): void;
        /**
         * 删除目标身上所有的Tween
         * @param target 目标对象
         */
        static removeTargetTweens<T>(target: T): void;
        /**
         * 目标是否包含Tween
         * @param target 目标对象
         */
        static containTweens<T>(target: T): boolean;
        /**
         * Tween的更新函数
         * @example
         * setInterval(XTween.updateTweens, 1);
         */
        static updateTweens(): void;
    }
    function xtween<T>(target: T): XTween<T>;
}
