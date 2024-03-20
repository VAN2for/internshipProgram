/**
 * 拓展工具模块
 */
namespace ps.Tools {
    /**
     * 把当前对象坐标系转换到目标对象坐标系
     * @param current 当前对象
     * @param target 目标对象
     * @param point 坐标点
     */
    export function transPos(current: qc.Node, target: qc.Node, point = new qc.Point) {
        let pos = new qc.Point(current.x + point.x, current.y + point.y);
        pos = current.parent.toGlobal(pos);
        pos = target.parent.toLocal(pos);
        return pos;
    }

    /** 
     * 检测对象是否为空
     * @param {Object} obj 待检测对象
     * @returns {boolean} 对象是否为空（包含{}、对象里所有val都为空）
     */
    export function objIsNull(obj: Object): boolean {
        if (!obj || obj === "{}" || ps.Tools.jsonToStr(obj) === "{}") {
            return true;
        }
        for (const key in obj) {
            const val = obj[key];
            if (val != void 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * 删除数组中的指定值
     * @param {any[]} arr 待检测数组
     * @param {any} val 待删除的指定值
     */
    export function deleteElement(arr: any[], val: any) {
        if (!arr || arr.length <= 0) return;
        let index = arr.indexOf(val);
        if (index >= 0) {
            arr.splice(index, 1);
            return true;
        }
    }

    /**
     * 转换数字
     * @param {number} num 待转换数字
     * @param {boolean} isComma 是否每3位加一个","
     * @param {number} min 是否限制最小位数，不够位数时补0
     * @param {number} unitType 单位类型 0:无单位  1:K、M、G  2:百、千、万、百万、千万。。。
     * @param {number} retain 保留几位小数，默认为：2
     * @param {"round"|"ceil"|"floor“} rounding 取整方式
     */
    export function switchNum(num: number, isComma?: boolean, min?: number, unitType: number = 0, retain: number = 2, rounding: "round" | "ceil" | "floor" = "round"): string {
        let unit: string = "";
        switch (unitType) {
            /** K、M、G */
            case 1:
                if (num >= 1000000000) {
                    unit = "G";
                    num /= 1000000000;
                } else if (num >= 1000000) {
                    unit = "M";
                    num /= 1000000;
                } else if (num >= 1000) {
                    unit = "K";
                    num /= 1000;
                }
                break;
            /** 百、千、万、百万、千万。。。 */
            case 2:
                if (num >= 100000000) {
                    unit = "亿";
                    num /= 100000000;
                } else if (num >= 10000000) {
                    unit = "千万";
                    num /= 10000000;
                } else if (num >= 1000000) {
                    unit = "百万";
                    num /= 1000000;
                } else if (num >= 100000) {
                    unit = "十万";
                    num /= 100000;
                } else if (num >= 10000) {
                    unit = "万";
                    num /= 10000;
                } else if (num >= 1000) {
                    unit = "千";
                    num /= 1000;
                } else if (num >= 100) {
                    unit = "百";
                    num /= 100;
                }
                break;
            /** 无单位 */
            default:
                break;
        }
        num = Mathf.keepDecimal(num, retain, rounding);

        let str: string = num + "";
        if (min != void 0) {
            const diff: number = min - str.length;
            if (diff > 0) {
                for (let i: number = 0; i < diff; i++) {
                    str = "0" + str;
                }
            }
        }
        if (isComma) {
            // const arr: string[] = str.split(".");
            let str1: string = str//arr[0];
            // const str2: string = arr.length > 1 ? arr[1] : "";
            const rgx: RegExp = /(\d+)(\d{3})/;
            while (rgx.test(str1)) {
                str1 = str1.replace(rgx, "$1" + "," + "$2");
            }
            str = str1// + str2;
        }
        return str + unit;
    }

    /**
     * 转换小时为 00:00 格式
     */
    export function switchHour(hour: number, is24: boolean = true): string {
        let str: string;
        const max: number = is24 ? 23 : 11;
        if (hour > max) {
            hour %= (max + 1);
        }
        if (hour < 10) {
            str = `0${hour}:00`;
        } else {
            str = `${hour}:00`;
        }
        return str;
    }

    /** 
     * 字符串填充方法
     * 用另一个字符串填充当前字符串（如果需要的话，会重复多次），以便产生的字符串达到给定的长度。从当前字符串的左侧开始填充。
     */
    export function padString(str: string, length: number, char: string): string {
        const padding = char.repeat(length - str.length);
        return padding.slice(0, length - str.length) + str;
    }

    /**
     * 毫秒数转换为：时 分 秒
     * @param milliseconds 毫秒数
     * @returns { hours: 时, minutes: 分, seconds: 秒 }
     */
    export function formatTime(milliseconds: number): {
        hours: string,
        minutes: string,
        seconds: string,
    } {
        const date = new Date(milliseconds);
        const hours = padString(date.getUTCHours().toString(), 2, "0");
        const minutes = padString(date.getUTCMinutes().toString(), 2, "0");
        const seconds = padString(date.getUTCSeconds().toString(), 2, "0");
        return { hours, minutes, seconds };
    }

    /**
     * 毫秒数转换为：分 秒
     * @param milliseconds 毫秒数
     * @returns { minutes: 分, seconds: 秒 }
     */
    export function formatMilliseconds(milliseconds: number): {
        minutes: string | number,
        seconds: string | number,
    } {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return { minutes: formattedMinutes, seconds: formattedSeconds };
    }

    /**
     * 字符串转JSON
     * @param str 待转换字符串数据
     */
    export function strToJson(str: string): Object {
        if (typeof str !== "string") return str
        return JSON.parse(str)
    }

    /**
     * JSON转字符串
     * @param obj 待转换JSON数据
     */
    export function jsonToStr(obj: Object): string {
        if (typeof obj !== "object") return obj
        return JSON.stringify(obj)
    }

    /** 字符串转颜色 */
    export function stringToColor(str: string) {
        str = str.replace("#", "");
        let r = str.slice(0, 2);
        let g = str.slice(2, 4);
        let b = str.slice(4, 6);
        r = hex2int(r);
        g = hex2int(g);
        b = hex2int(b);
        let a = str.slice(7, 8);
        if (a) a = hex2int(a);
        else a = "255";
        return { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseInt(a) };
    }

    /** 16进制转10进制 */
    export function hex2int(hex) {
        var len = hex.length,
            a = new Array(len),
            code;
        for (var i = 0; i < len; i++) {
            code = hex.charCodeAt(i);
            if (48 <= code && code < 58) {
                code -= 48;
            } else {
                code = (code & 0xdf) - 65 + 10;
            }
            a[i] = code;
        }

        return a.reduce(function (acc, c) {
            acc = 16 * acc + c;
            return acc;
        }, 0);
    }

    /** 深度克隆一个对象 */
    export function deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    export function ignoreLayoutProps(node: qc.Node, params: { prop: string, value?: unknown }[]) {
        if (!qc.Node.prototype.setPropertyIgnoreLayout) {
            return;
        }
        params.forEach(element => {
            node.setPropertyIgnoreLayout(element);
        });
    }

    export function ignoreLayoutPropsDeep(node: qc.Node, params: { prop: string, value?: unknown }[]) {
        if (!qc.Node.prototype.setPropertyIgnoreLayout) {
            return;
        }
        this.ignoreLayoutProps(node, params);
        node.children.forEach(element => {
            this.ignoreLayoutProps(element, params);
        });
    }
}