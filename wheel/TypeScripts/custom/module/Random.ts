/** 随机数模块 */
namespace ps.Random {
    /**
     *  取一个随机数四舍五入 
     * @param v 边界1
     * @param v2 边界2,默认0
     */
    export function round(v1: number, v2: number = 0) {
        return range(v1, v2, "round");
    }
    /**
     * 取一个随机数向下取整 
     * @param v 边界1
     * @param v2 边界2,默认0
     */
    export function floor(v1: number, v2: number = 0) {
        return range(v1, v2, "floor");
    }
    /** 取一个随机数向上取整
      * @param v 边界1
     * @param v2 边界2,默认0
     */
    export function ceil(v1: number, v2: number = 0) {
        return range(v1, v2, "ceil");
    }
    /**
     *  范围随机
     * @param min 边界1
     * @param max 边界2
     * @param rounding  取整类型，默认不取整
     */
    export function range(v1: number, v2: number, rounding?: "round" | "ceil" | "floor") {
        let min = Math.min(v1, v2);
        let max = Math.max(v1, v2);
        let result = ran(max - min) + min;
        if (rounding) result = Math[rounding](result);
        return result;
    }
    /**
     *  取一个随机数
     * @param v 值，默认1
     * @param rounding 取整类型，默认不取整
     */
    export function ran(v: number = 1, rounding?: "round" | "ceil" | "floor") {
        let result = Math.random() * v;
        if (rounding) result = Math[rounding](result);
        return result;
    }
    /**
     * 随机概率
     * @param v 值
     * @param max 最大值，默认1 
     */
    export function rate(v: number, max = 1) {
        return ran(max) < v;
    }

    /**
     * 正太分布随机
     * 假如mean=0，std_dev=1,有68.26%的概率返回范围是[-1,1],返回值最大范围是[-5,5]
     * @param mean 数学期望，默认0
     * @param std_dev 标准差，默认1
     */
    export function normalDistribution(mean = 0, std_dev = 1) {
        let u = 0, v = 0, w = 0, c = 0;
        do {
            //获得两个（-1,1）的独立随机变量
            u = range(-1, 1);
            v = range(-1, 1);
            w = u * u + v * v;
        } while (w == 0 || w >= 1)
        //这里就是 Box-Muller转换
        c = Math.sqrt((-2 * Math.log(w)) / w);
        //返回2个标准正态分布的随机数，封装进一个数组返回
        //当然，因为这个函数运行较快，也可以扔掉一个
        //return [u*c,v*c];
        //return u*c;
        let nd = u * c;
        //
        return mean + (nd * std_dev);
    }

    /** 随机取一个元素 */
    export function getElement(args) {
        let index = floor(args.length);
        return args[index];
    }
    /**
     * 随机抽取多个元素（不重复
     * @param arr 要抽取的对象数组
     * @param amount 要抽取的数量
     */
    export function getElements(arr: any[], amount: number) {
        if (arr.length < amount) {
            console.error("抽取数量大于数组长度");
            return;
        }
        let carr = arr.concat();
        let narr = [];
        for (let i = 0; i < amount; i++) {
            let index = Random.floor(carr.length);
            narr.push(carr[index]);
            carr.splice(index, 1);
        }
        return narr;
    }
    /** 概率抽取,N选1
     *  参数格式为{type1:weight1,type2:weight2,type3:weight3}
     */
    export function drawOne(obj: {}) {
        let allWeight = 0;
        for (let key in obj) {
            let weight = obj[key];
            allWeight += weight;
        }
        let v = Math.random() * allWeight;
        let sum = 0;
        for (let key in obj) {
            sum += obj[key];
            if (v < sum) {
                return key;
            }
        }
    }
}