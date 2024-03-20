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
     * 拖尾组件
     * @description 用于游戏中的拖尾效果，如：拖拽屏幕拖尾、指引拖尾
     * @author JingBin
     */
    var Trail = /** @class */ (function (_super) {
        __extends(Trail, _super);
        function Trail(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 是否拖拽屏幕拖尾 */
            _this.isDragEff = true;
            /** 目标透明度小于多少时不跟随 */
            _this.alphaMinNotEff = 1;
            /** 效果宽度 */
            _this.width = 40;
            /** 效果颜色 */
            _this.color = new qc.Color('#ffffff');
            /** 消失时间 */
            _this.duration = 300;
            /** 延迟消失时间 */
            _this.delay = 0;
            /** 是否Y轴缩小消失 */
            _this.scaleYEffect = true;
            /** 是否透明度降低消失 */
            _this.alphaEffect = false;
            /** 序列化 */
            _this.serializableFields = {
                isDragEff: qc.Serializer.BOOLEAN,
                target: qc.Serializer.NODE,
                width: qc.Serializer.NUMBER,
                alphaMinNotEff: qc.Serializer.NUMBER,
                color: qc.Serializer.COLOR,
                duration: qc.Serializer.NUMBER,
                delay: qc.Serializer.NUMBER,
                scaleYEffect: qc.Serializer.BOOLEAN,
                alphaEffect: qc.Serializer.BOOLEAN,
            };
            return _this;
        }
        Trail.prototype.awake = function () {
            this.alphaMinNotEff = Math.max(Math.min(this.alphaMinNotEff, 1), 0);
        };
        Trail.prototype.update = function () {
            if (!this.target || !this.target.visible || this.target.alpha < this.alphaMinNotEff || !this.target.parent)
                return;
            var p = ps.Tools.transPos(this.target, this.gameObject);
            this.pos(p.x, p.y);
        };
        /** 试玩初始化的处理 */
        Trail.prototype.onInit = function () {
            //ps.Print.purple('Trail.onInit')
        };
        /** 试玩开始时的处理 */
        Trail.prototype.onStart = function () {
            //ps.Print.purple('Trail.onStart')
        };
        Trail.prototype.onDown = function () {
            if (this.isDragEff)
                this.reset();
        };
        Trail.prototype.onDrag = function (e) {
            if (!this.isDragEff)
                return;
            var p = e.source;
            var p1 = this.gameObject.toLocal(new qc.Point(p.x, p.y));
            this.pos(p1.x, p1.y);
        };
        Trail.prototype.reset = function () {
            this.preX = null;
            this.preY = null;
        };
        /** 设置新位置 */
        Trail.prototype.pos = function (x, y) {
            if (!this.preX) {
                this.preX = x;
                this.preY = y;
                return;
            }
            var long = ps.Mathf.getDistance(this.preX, this.preY, x, y);
            if (long === 0)
                return this;
            var ag = ps.Mathf.getRadian(this.preX, this.preY, x, y);
            this.emit(x, y, ag, long);
            this.preX = x;
            this.preY = y;
            return this;
        };
        Trail.prototype.emit = function (x, y, rotation, long) {
            var p = new SParticle(this.game, this.gameObject, long, this.width, this.color);
            p.x = x;
            p.y = y;
            p.rotation = rotation;
            p.play(this.duration, this.delay, this.scaleYEffect, this.alphaEffect);
            this.gameObject.addChild(p);
            if (this.target && this.target.parent === this.gameObject)
                this.gameObject.setChildIndex(p, this.gameObject.getChildIndex(this.target));
        };
        return Trail;
    }(ps.Behaviour));
    ps.Trail = Trail;
    qc.registerBehaviour('ps.Trail', Trail);
    Trail['__menu'] = 'Custom/Trail';
    var SParticle = /** @class */ (function (_super) {
        __extends(SParticle, _super);
        function SParticle(game, parent, long, width, color) {
            var _this = _super.call(this, game, parent) || this;
            // this.lineStyle(0)
            _this.beginFill(color.toNumber());
            _this.drawRect(-long, -width / 2, long, width);
            _this.drawCircle(-long, 0, width);
            // this.drawPolygon(0, -25, [0, 0, 0, 50, -long * 1.5, 25], "#ffffff", undefined, 0)
            // this.cacheAs = "bitmap"
            // const cacheAsBitmap = this.addScript('qc.CacheAsBitmap') as qc.CacheAsBitmap
            // cacheAsBitmap.cacheType = qc.CacheAsBitmap.CACHE_FOR_SELF
            // cacheAsBitmap.boundsType = qc.CacheAsBitmap.BOUNDS_ALL
            // cacheAsBitmap.boundsInScreen = true
            // cacheAsBitmap.dirty = false
            _this.endFill();
            return _this;
        }
        SParticle.prototype.play = function (duration, delay, hasScaleY, hasAlpha) {
            if (delay === void 0) { delay = 0; }
            var props = {};
            if (hasScaleY)
                props.scaleY = 0;
            if (hasAlpha)
                props.alpha = 0;
            ps.Tween.to(this, props, duration, void 0, delay).onComplete.addOnce(this.removeSelf, this);
        };
        return SParticle;
    }(qc.Graphics));
})(ps || (ps = {}));
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
