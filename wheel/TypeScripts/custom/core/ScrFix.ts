namespace ps {
    export var DESIGN_LONG = 1334;
    export var DESIGN_SHORT = 750;

    export type orientationType = "p" | "l" | "def";
    export type mobileType = "pad" | "ipx" | "def";
    /**
     * 屏幕状态
     */
    export class ScrFix {
        private static _width: number;
        private static _height: number;
        static set width(v: number) {
            this._width = v;
        }
        static get width() {
            if (ps.editor && ps.editor.scene.gameSize) return ps.editor.scene.gameSize.width;
            if (this._width === undefined) {
                return qc_game.width;
            }
            return this._width;
        }
        static set height(v: number) {
            this._height = v;
        }
        static get height() {
            if (ps.editor && ps.editor.scene.gameSize) return ps.editor.scene.gameSize.height;
            if (this._height === undefined) {
                return qc_game.height;
            }
            return this._height;
        }
        static get scale() {
            return ScrFix.isP ? ScrFix.width / 750 : ScrFix.height / 750;
        }
        /** 屏幕中心点X */
        static get cx() {
            return this.width / 2;
        }
        /** 屏幕中心点Y */
        static get cy() {
            return this.height / 2;
        }
        /** 宽高比 */
        static get ratio() {
            return this.width / this.height;
        }
        /** 横竖屏 l横屏 p竖屏 */
        static get orientation() {
            if (this.ratio > 1) return "l";
            else return "p";
        }
        /** 是竖屏 */
        static get isP() {
            return ScrFix.orientation === "p";
        }
        /** 是横屏 */
        static get isL() {
            return ScrFix.orientation === "l";
        }
        /** 屏幕类型 def pad ipx   */
        static get mobileType(): mobileType {
            if (ScrFix.isP ? this.ratio > 10 / 16 : this.ratio < 16 / 10) {
                return "pad";
            }
            if (ScrFix.isP ? this.ratio < 9 / 17 : this.ratio > 17 / 9) {
                return "ipx";
            }
            return "def";
        }
        /** 是pad */
        static get isPAD() {
            return ScrFix.mobileType === "pad";
        }
        /** 是ipx */
        static get isIPX() {
            return ScrFix.mobileType === "ipx";
        }
        /** 返回横竖屏对应的参数
         * @param   valueP 竖屏参数
         * @param   valueL 横屏参数
         */
        static v(valueP: any, valueL: any) {
            return ScrFix.isP ? valueP : valueL;
        }
        /** 返回各个类型的屏幕对应的参数 */
        static v2(args: { np?: any; nl?: any; pp?: any; pl?: any; xp?: any; xl?: any }) {
            if (ScrFix.isPAD) return ScrFix.isP ? args.pp : args.pl;
            if (ScrFix.isIPX) return ScrFix.isP ? args.xp : args.xl;
            return ScrFix.isP ? args.np : args.nl;
        }
    }
}
