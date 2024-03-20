var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ps;
(function (ps) {
    /**
     * 刮图层
     * @description 刮图层
     * @author bin
     * @date 2022/04/22 11:21:42
     */
    var Scrape = /** @class */ (function (_super) {
        __extends(Scrape, _super);
        function Scrape(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.scrapeColor = 0x3b271a;
            _this.scrapeAlpha = 1;
            _this.scrapeSize = 160;
            /** 序列化 */
            _this.serializableFields = {
                scrapeSize: qc.Serializer.NUMBER,
            };
            return _this;
        }
        /** 组件被激活后执行 */
        Scrape.prototype.awake = function () {
            // console.info("[info] ScratchOffGame.awake");
        };
        /** 试玩初始化的处理 */
        Scrape.prototype.onInit = function () {
            // console.info("[info] ScratchOffGame.onInit");
            /* 已经手动给引擎设置了第18个枚举值，将graphics的混合模式设置为PIXI.blendModes.ERASE即可 */
            // if (PIXI["blendModesWebGL"] && PIXI["blendModesWebGL"][17] == null)
            //     PIXI["blendModesWebGL"][17] = [game.renderer["gl"].ZERO, game.renderer["gl"].ZERO];
            this.graphics = new qc.Graphics(qc_game, this.gameObject);
            this.graphics.blendMode = PIXI.blendModes.ERASE;
            this.cacheAsBitmap = this.gameObject.addScript('qc.CacheAsBitmap');
            this.graphics.lineStyle(this.scrapeSize, this.scrapeColor, this.scrapeAlpha);
        };
        // 按下时
        Scrape.prototype.onDown = function (event) {
            var pointer = event.source;
            var point = new qc.Point(pointer.x, pointer.y);
            var localPoint = this.gameObject.toLocal(point);
            localPoint.x = Math.floor(localPoint.x);
            localPoint.y = Math.floor(localPoint.y);
            // 画圆
            this.graphics.drawCircle(localPoint.x, localPoint.y, 0.5);
            this.graphics.endFill();
            // 设置为true以刷新缓存图片
            this.cacheAsBitmap.dirty = true;
            // 更新当前点的位置 
            this.nowLocalPointY = localPoint.y;
            this.nowLocalPointX = localPoint.x;
        };
        // 按下拖拽时
        Scrape.prototype.onDrag = function (event) {
            var pointer = event.source;
            var point = new qc.Point(pointer.x, pointer.y);
            var localPoint = this.gameObject.toLocal(point);
            localPoint.x = Math.floor(localPoint.x);
            localPoint.y = Math.floor(localPoint.y);
            // 画线
            this.graphics.moveTo(this.nowLocalPointX, this.nowLocalPointY);
            this.graphics.lineTo(localPoint.x, localPoint.y);
            // 画圆
            this.graphics.drawCircle(localPoint.x, localPoint.y, 0.5);
            this.graphics.endFill();
            // 设置为true以刷新缓存图片
            this.cacheAsBitmap.dirty = true;
            // 更新当前点的位置
            this.nowLocalPointX = localPoint.x;
            this.nowLocalPointY = localPoint.y;
        };
        Scrape.prototype.onUp = function (event) {
        };
        Scrape.prototype.update = function () {
        };
        /** 试玩开始时的处理 */
        Scrape.prototype.onStart = function () {
            // console.info("[info] Scrape.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        Scrape.prototype.onDestroy = function () {
            // console.info("[info] Scrape.onDestroy");
        };
        return Scrape;
    }(ps.Behaviour));
    ps.Scrape = Scrape;
    qc.registerBehaviour("ps.Scrape", Scrape);
    Scrape["__menu"] = "Custom/Scrape";
    /**
    帧回调（preUpdate、update、postUpdate）
    如果实现了这几个函数，系统会自动每帧进行调度（当挂载的Node节点处于可见、并且本脚本的enable=true时）
    初始化（awake）
    如果实现了awake函数，系统会在Node节点构建完毕（反序列化完成后）自动调度
    脚本可用/不可用（onEnable、onDisable）
    当脚本的enable从false->true时，会自动调用onEnable函数；反之调用onDisable函数
    ps:在awake结束时,如果当前脚本的enable为true，会自动调用onEnable函数
    交互回调（onClick、onUp、onDown、onDrag、onDragStart、onDragEnd）
    当挂载的Node具备交互时，一旦捕获相应的输入事件，这些函数会自动被调用
    脚本析构（onDestroy）
    当脚本被移除时，会自动调用onDestroy函数，用户可以定义必要的资源回收代码
    //PlaySmart新增回调(继承ps.Behaviour)
    pl状态回调(onInit、onStart、onEnding、onRetry)
    如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
    */
})(ps || (ps = {}));
//# sourceMappingURL=Scrape.js.map