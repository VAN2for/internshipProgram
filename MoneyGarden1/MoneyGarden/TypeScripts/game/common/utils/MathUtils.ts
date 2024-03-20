namespace ps {

    /**
     * 数学工具类
     * @author: hs.lin
     * @date: 2020/07/03 09:56:02
     */
    export class MathUtils {

        public static readonly DEGREE_2_RADIAN_FACTOR = Math.PI / 180;

        /**
         * 是否两值之间
         * @param $t 
         * @param $v1 
         * @param $v2 
         * @param $includeEqual 
         */
        public static isBetween($t: number, $v1: number, $v2: number, $includeEqual = false): boolean {
            if ($includeEqual) {
                return $t >= Math.min($v1, $v2) && $t <= Math.max($v1, $v2);
            } else {
                return $t > Math.min($v1, $v2) && $t < Math.max($v1, $v2);
            }
        }

        /** 返回大小组合 */
        public static minMax($v1: number, $v2: number): { min: number, max: number } {
            return { min: Math.min($v1, $v2), max: Math.max($v1, $v2) };
        }

        /** 依据范围取值 */
        public static calValueBetween($t: number, $min: number, $max: number): number {
            const { min, max } = this.minMax($min, $max);
            return Math.max(Math.min(max, $t), min);
        }

        /**
         * 范围内随机，不包含 $max
         * @param $min 
         * @param $max 
         */
        public static randomBetween($min: number, $max: number): number {
            const { min, max } = this.minMax($min, $max);
            return min + Math.random() * (max - min);
        }

        /** 计算直角三角形斜边长度 */
        public static calLen($x: number, $y: number): number {
            return Math.sqrt($x * $x + $y * $y);
        }

        /** as3时常用的缓动公式，需要每一帧调用 */
        public static easeTo($cur: number, $to: number, $easeFactor: number): number {
            return $cur + ($to - $cur) * $easeFactor;
        }

        public static pNormalize(pt: XY): XY {
            const len = this.calLen(pt.x, pt.y);
            if (!len) {
                return { x: 1, y: 0 };
            }
            return { x: pt.x / len, y: pt.y / len };
        }

        public static pRotateByAngle($p1: XY, $p2: XY, $rad: number): XY {
            return this.pAdd($p2, this.pRotate(this.pSub($p1, $p2), this.pForAngle($rad)));
        }

        public static pMul($p: XY, $factor: number): XY {
            return { x: $p.x * $factor, y: $p.y * $factor };
        }

        public static pAdd($p1: XY, $p2: XY): XY {
            return { x: $p1.x + $p2.x, y: $p1.y + $p2.y };
        }

        public static pSub($p1: XY, $p2: XY): XY {
            return { x: $p1.x - $p2.x, y: $p1.y - $p2.y };
        }

        public static pForAngle($rad: number): XY {
            return { x: Math.cos($rad), y: Math.sin($rad) };
        }

        public static pRotate($p1: XY, $p2: XY): XY {
            return { x: $p1.x * $p2.x - $p1.y * $p2.y, y: $p1.x * $p2.y + $p1.y * $p2.x }
        }

        /** 数字相等 */
        public static isEqual($a: number, $b: number, $threshold = 0.000000001): boolean {
            return Math.abs($a - $b) < $threshold;
        }

        /** 修复欧拉旋转角度，保证范围[0,360) */
        public static fixRotationDegree($degree: number): number {
            if ($degree < 0) {
                $degree += 360 * (Math.abs(Math.ceil($degree / 360)) + 1);
            }
            return $degree % 360;
        }

        public static isInRect($x: number, $y: number, $rectX: number, $rectY: number, $rectW: number, $rectH: number, $equal = false) {
            if ($equal) {
                return $x >= $rectX && $x <= $rectX + $rectW && $y >= $rectY && $y <= $rectY + $rectH;
            } else {
                return $x > $rectX && $x < $rectX + $rectW && $y > $rectY && $y < $rectY + $rectH;
            }
        }


        /** 计算旋转角度，返回值范围[0,360) */
        public static calRotation($myX: number, $myY: number, $targetX: number, $targetY: number) {
            const deltaX = $targetX - $myX;
            const deltaY = $targetY - $myY;
            return this.calRotationByDelta(deltaX, deltaY);
        }


        /** 是否在三维盒子中，注意盒子中心点在底部中心 */
        public static isInBox($testX: number, $testY: number, $testZ: number, $boxX: number, $boxY: number, $boxZ: number, $boxLongZ: number, $boxWidthX: number, $boxHeightY: number) {
            return this.isBetween($testY, $boxY, $boxY + $boxHeightY) &&
                this.isBetween($testX, $boxX - $boxWidthX * .5, $boxX + $boxWidthX * .5) &&
                this.isBetween($testZ, $boxZ - $boxLongZ * .5, $boxZ + $boxLongZ * .5);
        }


        /** 计算旋转角度，返回值范围[0,360) */
        public static calRotationByDelta($deltaX: number, $deltaY: number) {
            let result = 0;
            if (!$deltaX) {
                result = ($deltaY > 0 ? 1 : -1) * 90;
            } else {
                result = Math.atan($deltaY / $deltaX) * 180 / Math.PI;
                if ($deltaX < 0) {
                    result = result - 180;
                }
            }
            return this.fixRotationDegree(result);
        }


        /**
        * 生成贝塞尔的点
        * @param $points 
        * @param $outputNum 输出的点数据数量
        * @see https://blog.csdn.net/nicepainkiller/article/details/91390452
        */
        public static createBezierPoints($points: XY[], $outputNum: number): XY[] {
            const result: XY[] = [];
            for (let i = 0; i < $outputNum; i++) {
                result.push(this.multiPointBezier($points, i / $outputNum));
            }
            return result;
        }

        public static pDis($a: XY, $b: XY): number {
            return this.calLen($a.x - $b.x, $a.y - $b.y);
        }

        public static lerp($from: number, $to: number, $factor: number): number {
            return $from + ($to - $from) * $factor;
        }

        public static pLerp($from: XY, $to: XY, $factor: number): XY {
            return {
                x: this.lerp($from.x, $to.x, $factor),
                y: this.lerp($from.y, $to.y, $factor),
            };
        }

        private static multiPointBezier($points: XY[], $percent: number): XY {
            const len = $points.length;
            let x = 0, y = 0;
            for (let i = 0; i < len; i++) {
                const point = $points[i];
                x += point.x * Math.pow((1 - $percent), (len - 1 - i)) * Math.pow($percent, i) * (this.erxiangshi(len - 1, i));
                y += point.y * Math.pow((1 - $percent), (len - 1 - i)) * Math.pow($percent, i) * (this.erxiangshi(len - 1, i));
            }
            return { x: x, y: y };
        }


        private static erxiangshi($start: number, $end: number): number {
            let cs = 1, bcs = 1;
            while ($end > 0) {
                cs *= $start;
                bcs *= $end;
                $start--;
                $end--;
            }
            return (cs / bcs);
        }
    }
}