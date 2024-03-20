/* eslint-disable @typescript-eslint/no-explicit-any */
namespace ps {
    /**
     * 数组的工具类
     * @author: hs.lin
     * @date: 2020/07/03 10:29:16
     */
    export class ArrayUtils {
        /**
         * 数组中随机取一个元素
         * @param $arr 
         * @param $exclude 不包含的数组
         */
        public static randomOne<T>($arr: ReadonlyArray<T>, $exclude?: T[]): T {
            let len = $arr.length;
            if (!len) return undefined;
            if ($exclude?.length) {
                $arr = $arr.filter($el => $exclude.indexOf($el) !== -1);
                len = $arr.length;
                if (!len) return undefined;
            }
            return $arr[Math.random() * len >> 0];
        }

        /**
         * 打散数组，返回原数组
         * @param $a 
         */
        public static disturb<T>($a: T[]): T[] {
            $a.sort(() => Math.random() - .5);
            return $a;
        }

        /** 
         * 数组中删除元素
         * @returns 返回元素删除前所在索引，不存在则返回-1
         */
        public static remove<T>($arr: T[], $element: T): number {
            const index = $arr.indexOf($element);
            if (index !== -1) {
                $arr.splice(index, 1);
            }
            return index;
        }


        /**
         * 假设parent中有属性item1,item2,item3,...，此方法能返回所有相关item的数组
         * @param $parent 
         * @param $nameSection 
         * @param $beginIndex 
         */
        public static getChildrenByNameSection<CHILD>($parent: any, $nameSection: string, $beginIndex = 1, $filterClass?: any, $isGetChildByName = false): CHILD[] {
            const result: CHILD[] = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const name = $nameSection + $beginIndex;
                const child: CHILD = $isGetChildByName ? $parent.getChildByName(name) : $parent[name];
                if (child) {
                    if (!$filterClass || child instanceof $filterClass) {
                        result.push(child);
                        $beginIndex++;
                    }
                } else {
                    break;
                }
            }
            return result;
        }
    }
}