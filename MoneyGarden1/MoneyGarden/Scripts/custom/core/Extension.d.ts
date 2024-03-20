/**
 * @author hubluesky
 * @see Func
 * @todo If have any questions, just call me.
 */
interface Math {
    /** 两个PI的长度 */
    TwoPI: number;
    /** 角度转弧度 */
    DegreeToRadian: number;
    /** 弧度转角度 */
    RadianToDegree: number;
    /**
     * 对value取最大和最小
     * @param min 最小值
     * @param max 最大值
     * @param value 要取最大最小的值
     * @returns 返回最大最小的结果
     */
    minmax(min: number, max: number, value: number): number;
    /**
     * 随机正负号
     * @returns 返回-1或者+1
     */
    randomSign(): number;
    /**
     * 在min和max范围内随机浮点数
     * @param min 最小值（包含）
     * @param max 最大值（包含）
     * @returns 返回随机结果
     */
    randomRange(min: number, max: number): number;
    /**
     * 随机一个整数
     * @param min 最小值（包含）
     * @param max 最大值（不包含）
     * @returns 返回一个整数值
     */
    randomIntRange(min: number, max: number): number;
    /**
     * 随机一个整数
     * @param start 起始值（包含）
     * @param end 结束值（包含）
     * @returns 返回一个整数值
     */
    randomIntBetween(start: number, end: number): number;
    /**
     * 随机数组里任意一个值
     * @param array 数组
     * @returns 返回数组的一项
     */
    randomArrayValue<T>(array: ReadonlyArray<T>): T;
    /**
     * 随机数组里任意多个值
     * @param array 数组
     * @param count 随机数量
     * @returns 返回装了随机项的新数组
     */
    randomArrayValues<T>(array: ReadonlyArray<T>, count?: number): T[];
    /**
     * 插值，根据比例求出在min和max之间的值
     * @param min 最小值（包含）
     * @param max 最大值（包含）
     * @param t 比例0~1
     * @returns 返回中间值
     */
    lerp(min: number, max: number, t: number): number;
    /**
     * 平滑插值
     * @param current 当前值
     * @param target 目标值
     * @param lambda 平滑参数，波长
     * @param delayTime 时长
     */
    damp(current: number, target: number, lambda: number, delayTime: number): number;
    /**
     * 两个角度之间的增量值。
     * Math.deltaAngle(90, 1080) // 90
     * Math.deltaAngle(15, 194) // 179
     * Math.deltaAngle(15, 196) // -179
     * @param current
     * @param target
     */
    deltaAngle(current: number, target: number): number;
    /**
     * 平滑插值角度
     * @param current 当前值
     * @param target 目标值
     * @param smoothingTime 平滑时长
     * @param maxSpeed 最大旋转速度，即每秒多少度
     * @param delayTime 间隔时长
     */
    dampAngle(current: number, target: number, smoothingTime: number, maxSpeed: number, delayTime: number): number;
    /**
     * 反向插值，求出value在min和max之间的比例
     * @param min 最小值（包含）
     * @param max 最大值（包含）
     * @param value 中间值
     * @returns 返回中间值在min和max的比例
     */
    inverseLerp(min: number, max: number, value: number): number;
    /**
     * 夹取，把value卡在min和max之间，包含min和max
     * @param value 要夹取的值
     * @param min 最小值（包含）
     * @param max 最大值（包含）
     * @returns 返回夹取后的值
     */
    clamp(value: number, min: number, max: number): number;
    /**
     * 把值卡在0到1之间
     * @param v 要卡的值
     * @returns 返回夹取后的值
     */
    saturate(v: number): number;
    /**
     * 获得小数部分
     * @param value 浮点数
     * @returns 返回小数部分
     */
    fraction(value: number): number;
    /**
     * 合并两个整数，high 和 low 必须是整数
     * @param high 高位数
     * @param low 低位数
     * @returns 返回合并后的值
     */
    mergeInterval(high: number, low: number): number;
    /**
     * 拆分整数，把value拆分成两个整数
     * @param value 合并的值
     * @returns 返回拆分后的高低值
     */
    splitInterval(value: number): {
        high: number;
        low: number;
    };
    /**
     * 把一个自然数转为整数
     * @example 有一组数 0, 1, 2, 3, 4, 5, 6, 7, 8, 9，经过转换后，变为 0, -1, +1, -2, +2, -3, +3, -4, +4, -5
     * @param index 自然数
     */
    naturalToInteger(index: number): number;
    /**
     * 把一个字符串转成hash
     * @param value 字符串
     * @returns 返回hash值
     */
    toHash(value: string): number;
}
interface DateConstructor {
    /**
     * 获得以秒为单位的数值
     * @returns 获得秒数
     */
    getTimeSeconds(): number;
}
interface StringConstructor {
    /**
     * 判断字符串是否为null或者为“”
     * @param value 字符串
     * @returns 返回结果
     */
    isEmptyOrNull(value: string): boolean;
    /**
     * 格式化字符串。使用大括号+数字来表示参数。参数起始为0，参数可以不按顺序来。
     * @example
     * let format = "这是一段需要翻译的文本，有{1}，有{0}, 有{2}";
     * let text = String.format(format, "鸡", "鸭", "鹅");
     * text的内容为：这是一段需要翻译的文本，有鸭，有鸡, 有鹅
     * @param format 要格式化的字符串
     * @param params 格式化参数
     * @returns 返回格式化好的字符串
     */
    format(format: string, ...params: any[]): string;
}
interface ObjectConstructor {
    /**
     * 根据对象原型创建一个实例
     * @param prototype 对象原型
     * @returns 返回对象实例
     */
    createInstance<T>(prototype: Object): T;
    /**
     * 根据一个全局对象名，创建一个实例，该对象必须是window的一个属性。
     * @param className 对象名称
     * @param params 构造函数参数
     * @returns 返回对象实例
     */
    createClass<T>(className: string, ...params: any[]): T;
    /**
     * 判断一个实例是否有指定的属性或者函数
     * @example
     * interface A {
     *     value: string;
     * }
     *
     * let b: { value: string };
     * let result = Object.hasProperty<A>(b, "value"); // result is true
     *
     * @param instance 对象实例
     * @param property 指定的属性或者函数
     * @returns 返回结果
     */
    hasProperty<T>(instance: any, property: keyof T): instance is T;
}
interface Function {
    /**
     * 注入一个函数在原函数调用之前调用，如果注入的函数返回值是false，则原函数不会被执行
     * @example
     * Math.abs = Math.abs.before(function (value: number): boolean {
     *     value = value < 0 ? -value : value;
     *     return false;
     * });
     *
     * @param func 注入的函数
     * @returns 返回注入的函数
     */
    before<T extends (...args: any[]) => any>(func: T): any;
    /**
     * 注入一个函数在原函数调用之后调用，如果注入的函数返回值为非空，则代替原函数返回值返回
     * @example
     * Math.abs = Math.abs.after(function (value: number): void {
     *     value = value < 0 ? -value : value;
     * });
     *
     * @param func 注入的函数
     * @returns 返回注入的函数
     */
    after<T extends (...args: any[]) => any>(func: T): any;
}
/** 用来表示任意函数 */
declare type AnyFunction = (...args: any[]) => any;
/** 用来表示任意构造函数 */
declare type AnyConstructor<T = any> = new (...args: any[]) => T;
/** 用来排除对象不需要的属性或者函数 */
declare type ObjectExclude<T, E> = {
    [k in keyof T]: T[k] extends E ? never : k;
}[keyof T];
/** 用来指定对象需要的属性或者函数 */
declare type ObjectInclude<T, E> = {
    [k in keyof T]: T[k] extends E ? k : never;
}[keyof T];
/** 用来指定只需要对象的属性，过滤掉函数。 */
declare type ObjectProperties<T> = ObjectExclude<T, Function>;
/** 用来指定只需要对象的函数，过滤掉属性。 */
declare type ObjectFunctions<T> = ObjectInclude<T, Function>;
