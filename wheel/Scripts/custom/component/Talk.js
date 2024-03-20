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
     * 对话框组件
     * @description 可用于游戏对话框。传不同ID切换不同对话内容；勾选使用冒泡组件，可做弹出、收起、持续漂浮动画效果
     * @author JingBin
     */
    var Talk = /** @class */ (function (_super) {
        __extends(Talk, _super);
        function Talk(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 所有对话内容节点 */
            _this.Nodes = [];
            /** 当前对话内容纹理索引 */
            _this.TalkIdx = 0;
            /** 对话框锚点，一般用于对话弹出冒泡效果顶点 */
            _this.TalkPivot = new qc.Point();
            /** 序列化 */
            _this.serializableFields = {
                BgTex: qc.Serializer.TEXTURE,
                Bg: qc.Serializer.AUTO,
                Texs: qc.Serializer.TEXTURES,
                Nodes: qc.Serializer.NODES,
                TalkIdx: qc.Serializer.INT,
                TalkPivot: qc.Serializer.POINT,
                Talk: qc.Serializer.AUTO,
                _UseBubble: qc.Serializer.AUTO,
                orgX: qc.Serializer.AUTO,
                orgY: qc.Serializer.AUTO,
            };
            _this._UseBubble = true;
            _this.runInEditor = true;
            return _this;
        }
        Talk.prototype.awake = function () {
            if (this.orgX == void 0)
                this.orgX = this.gameObject.x;
            if (this.orgY == void 0)
                this.orgY = this.gameObject.y;
            if (this.BgTex && (!this.Bg || !this.Bg.parent)) {
                if (!this.Bg)
                    this.Bg = this.game.add.image();
                this.Bg.texture = this.BgTex;
                this.Bg.resetNativeSize();
                this.gameObject.addChild(this.Bg);
                this.Bg.anchoredX = this.Bg.anchoredY = 0;
                this.Bg.visible = true;
                this.Bg.name = 'Bg';
                this.gameObject.width = this.Bg.width;
                this.gameObject.height = this.Bg.height;
            }
            this.gameObject.pivotX = this.TalkPivot.x;
            this.gameObject.pivotY = this.TalkPivot.y;
            this.gameObject.x = this.orgX + this.gameObject.width * this.gameObject.pivotX;
            this.gameObject.y = this.orgY + this.gameObject.height * this.gameObject.pivotY;
            if (this.Texs && this.Texs.length > 0 && (!this.Talk || !this.Talk.parent)) {
                if (!this.Talk)
                    this.Talk = this.game.add.image();
                this.Talk.texture = this.Texs[0];
                this.Talk.resetNativeSize();
                this.gameObject.addChild(this.Talk);
                this.Talk.pivotX = this.Talk.pivotY = .5;
                this.Talk.setAnchor(new qc.Point(.5, .5), new qc.Point(.5, .5));
                this.Talk.anchoredX = this.Talk.anchoredY = 0;
                this.Talk.visible = true;
                this.Talk.name = 'Talk';
            }
            this.showCurrHideOther(0);
            this.UseBubble(this._UseBubble);
            if (this.Bubble)
                this.Bubble.awake();
        };
        Talk.prototype.refresh = function () {
            this.awake();
            this.show();
        };
        Talk.prototype.UseBubble = function (b) {
            var _this = this;
            if (b === void 0) {
                return this._UseBubble;
            }
            else {
                this._UseBubble = b = !!b;
                var bubbles = this.gameObject.getScripts(ps.Bubble);
                if (b) {
                    if (bubbles && bubbles.length > 0) {
                        this.Bubble = bubbles.shift();
                        bubbles.forEach(function (bubble) {
                            _this.gameObject.removeScript(bubble);
                            bubble.remove();
                            bubble.destroy();
                        });
                        bubbles = null;
                    }
                    if (!this.Bubble)
                        this.Bubble = this.gameObject.addScript('ps.Bubble');
                }
                else {
                    if (bubbles && bubbles.length > 0)
                        bubbles.forEach(function (bubble) {
                            _this.gameObject.removeScript(bubble);
                            bubble.remove();
                            bubble.destroy();
                        });
                    if (this.Bubble) {
                        this.Bubble.remove();
                        this.Bubble.destroy();
                        this.Bubble = null;
                    }
                }
            }
        };
        /**
         * 显示对话
         * @param {number} idx 对话内容索引
         */
        Talk.prototype.show = function (idx) {
            if (idx === void 0) { idx = this.TalkIdx; }
            if (this.Talk) {
                if (idx >= 0 && idx < this.Texs.length) {
                    this.TalkIdx = idx;
                    this.Talk.texture = this.Texs[this.TalkIdx];
                    this.Talk.resetNativeSize();
                }
            }
            this.showCurrHideOther(idx);
            if (this.Bubble)
                this.Bubble.show();
            else
                this.gameObject.visible = true;
        };
        /** 隐藏对话 */
        Talk.prototype.hide = function () {
            if (this.Bubble)
                this.Bubble.hide();
            else
                this.gameObject.visible = false;
        };
        Talk.prototype.showCurrHideOther = function (idx) {
            this.Nodes.forEach(function (node, i) { return node.visible = i == idx; });
        };
        return Talk;
    }(ps.Behaviour));
    ps.Talk = Talk;
    qc.registerBehaviour('ps.Talk', Talk);
    Talk["__menu"] = 'Custom/Talk';
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
//# sourceMappingURL=Talk.js.map