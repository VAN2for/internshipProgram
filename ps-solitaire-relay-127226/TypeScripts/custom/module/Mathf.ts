/** 数学计算模块 */
namespace ps.Mathf {
    /** 角度转弧度 */
    export function angleToRadian(a: number) {
        return a * (Math.PI / 180);
    }
    /** 弧度转角度 */
    export function radianToAngle(r: number) {
        return r / (Math.PI / 180);
    }
    /**
     * 判断给出的数据是否在数值范围内
     * @param value 输入的数值
     * @param min 最小值，默认0
     * @param max 最大值，默认1
     * @param includeBoundary 包含边界，默认true
     */
    export function inRange(value: number, min: number = 0, max: number = 1, includeBoundary = true) {
        if (includeBoundary) return value >= min && value <= max;
        else return value > min && value < max;
    }
    /**
     * 把输入的数据限定在数值范围内
     * @param value 输入的数值
     * @param min 最小值，默认0
     * @param max 最大值，默认1
     */
    export function clamp(value: number, min: number = 0, max: number = 1) {
        value = Math.min(value, max);
        value = Math.max(value, min);
        return value;
    }
    /**
     * 计算两点距离
     * @param x1 点1的X坐标
     * @param y1 点1的Y坐标
     * @param x2 点2的X坐标
     * @param y2 点2的Y坐标
     * @param rounding 取整类型，默认不取整
     */
    export function getDistance(x1: number, y1: number, x2: number, y2: number, rounding?: "round" | "ceil" | "floor") {
        let result = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        if (rounding) result = Math[rounding](result);
        return result;
    }

    /**
     * 计算两点形成的向量弧度
     * @param x1 点1的X坐标
     * @param y1 点1的Y坐标
     * @param x2 点2的X坐标
     * @param y2 点2的Y坐标
     */
    export function getRadian(x1: number, y1: number, x2: number, y2: number) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.atan2(dy, dx);
    }
    /**
     * 计算两点形成的向量角度
     * @param x1 点1的X坐标
     * @param y1 点1的Y坐标
     * @param x2 点2的X坐标
     * @param y2 点2的Y坐标
     */
    export function getAngle(x1: number, y1: number, x2: number, y2: number) {
        return radianToAngle(getRadian(x1, y1, x2, y2));
    }
    /**
     *  检测点与对象的碰撞(矩形)
     * @param target 目标对象(矩形)
     * @param x 目标点的X坐标
     * @param y 目标点的YU坐标
     */
    export function collision(target, x?: number, y?: number) {
        if (x === undefined) {
            x = target.parent.mouseX;
            y = target.parent.mouseY;
        }
        let tx = target.x;
        let ty = target.y;
        let tw = target.width;
        let th = target.height;

        if (target.anchorX != undefined && !isNaN(target.anchorX)) {
            tx -= target.anchorX * tw;
        }
        if (target.anchorY != undefined && !isNaN(target.anchorY)) {
            ty -= target.anchorY * th;
        }
        return x >= tx && x <= tx + tw && y >= ty && y <= ty + th;
    }
    /**
    * 把字符串或数字转换成数字
    * @param v 字符串或数字
    */
    export function parseNumber(v: number | string) {
        if (typeof (v) === "string") {
            if (v === "") return;
            return parseFloat(v);
        }
        return v;
    }
    /** 挂机游戏数值单位转换 */
    function formatNumber(v: number, units: string[] = ["A", "B", "C", "D"]) {
        let s = v + "";
        let c = s.length;
        let sang = Math.ceil(c / 3) - 1;
        let remainder = c % 3;
        for (let i = 0; i < sang; i++) {
            v /= 1000;
        }
        let unit = units[sang] ? units[sang] : "缺少单位"
        s = v.toFixed(4 - (remainder === 0 ? 3 : remainder));
        return s + unit;
    }
    /** 阻尼计算 */
    export function damp(v1: number, v2: number, damping: number) {
        let d = v2 - v1;
        return v1 + d / damping;
    }
    /** 线性计算 */
    export function lerp(v1: number, v2: number, t: number) {
        return v1 + (v2 - v1) * t;
    }
    /** [x1,y1,x2,y2...]=>[{x:x1,y:y1},[{x:x2,y:y2}...] */
    function ArrayToPoints(arr: number[]) {
        arr = arr.concat();
        let points = [];
        while (true) {
            let x = arr.shift();
            let y = arr.shift();
            if (x != undefined && y != undefined) {
                points.push({ x: x, y: y });
            } else {
                return points;
            }
        }
    }

    //静斌============================================================
    /** 
     * 保留N位小数（四舍五入）
     * @param {number} val 待修改值
     * @param {number} n = 2 N位小数，大于等于0
     * @returns {number} 保留N位小数后的结果
     * 
     * @description
     * round() 方法可把一个数字舍入为最接近的整数。
     * 例如：Math.round(x)，则是将x取其最接近的整数。
     * 其取舍的方法使用的是四舍五入中的方法，符合数学中取舍的规则。
     * 
     * @description
     * toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
     * 例如将数据Num保留2位小数，则表示为：toFixed(Num)；
     * 但是其四舍五入的规则与数学中的规则不同，使用的是银行家舍入规则，
     * 银行家舍入：所谓银行家舍入法，其实质是一种四舍六入五取偶（又称四舍六入五留双）法
     */
    export function keepDecimal(val: number, n: number = 2, rounding: "round" | "ceil" | "floor" = "round"): number {
        n = Math.max(0, n);
        const square = Math.pow(10, n);
        return Math[rounding](val * square) / square; //Math.round(val * 100) / 100; //15.78
    }
    /**
     * 通过速度求时间（秒）
     * @param {number} x1 点1，X坐标
     * @param {number} y1 点1，Y坐标
     * @param {number} x2 点2，X坐标
     * @param {number} y2 点2，Y坐标
     * @param {number} speed 速度
     * @returns {number} 通过传入的速度，求出时间（秒）
     */
    export function getTimeBySpeed(x1: number, y1: number, x2: number = x1, y2: number = y1, speed: number): number {
        return Math.ceil(getDistance(x1, y1, x2, y2) / speed);
    }
    /**
     * 两点间按一定分割间距（密度）取出所有点
     * @param {number} x1 点1，X坐标
     * @param {number} y1 点1，Y坐标
     * @param {number} x2 点2，X坐标
     * @param {number} y2 点2，Y坐标
     * @param {number} density = 1 分割间距（密度）
     * @returns {{x?:number,y?:number}[]} 分割结果所有的点
     */
    export function pointListByDensity(x1: number, y1: number, x2: number, y2: number, density: number = 1): { x?: number, y?: number }[] {
        let pos: { x?: number, y?: number };
        let insideNull: boolean; //其中一个点坐标为空
        if (x1 != void 0 && y1 != void 0) {
            pos = pos || {};
            pos.x = x1;
            pos.y = y1;
        } else {
            insideNull = true;
        }
        if (x2 != void 0 && y2 != void 0) {
            pos = pos || {};
            pos.x = x2;
            pos.y = y2;
        } else {
            insideNull = true;
        }

        if (!pos) {
            return;
        }
        let posList: { x?: number, y?: number }[] = [];
        if (insideNull) {
            posList.push(pos);
        } else {
            const dis = this.getDistance(x1, y1, x2, y2); //两点间距
            if (dis <= 0) posList.push({ x: x1, y: y1 })
            else {
                density = Math.min(density, dis); //分割间距（密度）
                const splitCnt = dis / density; //分割等份数

                for (let i: number = 1; i <= splitCnt; i++) {
                    const posX: number = Math.round(x1 - (x1 - x2) * i / splitCnt);
                    const posY: number = Math.round(y1 - (y1 - y2) * i / splitCnt);
                    posList.push({ x: posX, y: posY });
                }
                //按密度分割后，第一个点如果不是x1, y1，存进去
                const firstPos = posList[0];
                if (firstPos.x != x1 || firstPos.y != y1) {
                    posList.unshift({ x: x1, y: y1 });
                }
                //按密度分割后，最后一个点如果不是x2, y2，存进去
                const lastPos = posList[posList.length - 1];
                if (lastPos.x != x2 || lastPos.y != y2) {
                    posList.push({ x: x2, y: y2 });
                }
            }
            // console.log(x1, y1, x2, y2, posList);
        }

        return posList;
    }
}