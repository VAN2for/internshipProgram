
namespace ps {
    /** 打印接口 */
    export class Print {
        /** 打印绿色信息 */
        static green(text: string | number) {
            Print.colorful(` ${text} `, "white", "#00bb00");
        }
        /** 打印蓝色信息 */
        static blue(text: string | number) {
            Print.colorful(` ${text} `, "white", "#00aaaa");
        }
        /** 打印橙色信息 */
        static orange(text: string | number) {
            Print.colorful(` ${text} `, "white", "#ff8800");
        }
        /** 打印红色信息 */
        static red(text: string | number) {
            Print.colorful(` ${text} `, "white", "#bb0000");
        }
        /** 打印紫色信息 */
        static purple(text: string | number) {
            Print.colorful(` ${text} `, "white", "#800080");
        }
        /**
         * 打印彩色信息
         * @param text 文字
         * @param color 颜色
         * @param bgColor 背景颜色
         */
        static colorful(text: string | number, color: string, bgColor: string = "white") {
            console.log(`%c${text}`, `color:${color};background:${bgColor};`);
        }
    }
}