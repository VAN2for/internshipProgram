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
     * 切水果
     * @description 切水果
     * @author weijia
     * @date 2023/02/03 16:28:31
     */
    var CutFruitItem;
    (function (CutFruitItem) {
        // 命中目标物品
        CutFruitItem[CutFruitItem["correctTarget"] = 0] = "correctTarget";
        // 抵达终点位置
        CutFruitItem[CutFruitItem["arriveDestination"] = 1] = "arriveDestination";
        // 降落到终点位置
        CutFruitItem[CutFruitItem["dropDestination"] = 2] = "dropDestination";
    })(CutFruitItem = ps.CutFruitItem || (ps.CutFruitItem = {}));
    var CutFruitItemEffect;
    (function (CutFruitItemEffect) {
        CutFruitItemEffect[CutFruitItemEffect["NONE"] = 0] = "NONE";
        CutFruitItemEffect[CutFruitItemEffect["HIDE"] = 1] = "HIDE";
        CutFruitItemEffect[CutFruitItemEffect["DESTROY"] = 2] = "DESTROY";
    })(CutFruitItemEffect = ps.CutFruitItemEffect || (ps.CutFruitItemEffect = {}));
    var ItemState;
    (function (ItemState) {
        ItemState[ItemState["RISE"] = 0] = "RISE";
        ItemState[ItemState["DROP"] = 1] = "DROP";
        ItemState[ItemState["END"] = 2] = "END";
    })(ItemState || (ItemState = {}));
    var CutItem = /** @class */ (function (_super) {
        __extends(CutItem, _super);
        function CutItem(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.event = new ps.EventDispatcher();
            _this.canRepeat = false; //是否可以重复触发
            _this._touched = CutFruitItemEffect.NONE; //被命中后的效果
            _this.minTargetY = 0; //终点位置Y轴最小值
            _this.maxTargetY = 0; //终点位置Y轴最大值
            _this.needDrop = false; //到达目标位置后是否需要降落
            _this.needDestination = false; //到达目标位置后是否需要降落
            _this.sendMinSpeedX = 0; //发射X轴速度最小值
            _this.sendMaxSpeedX = 0; //发射X轴速度最大值
            _this.sendSpeedX = 0; //发射X轴速度
            _this.sendSpeedY = 0; //发射Y轴速度
            _this.acceleration = 0; //加速度
            _this.moveTime = 0; //运动时间
            _this.isTarget = false; //是否被触发
            _this._arrive = CutFruitItemEffect.NONE; //到达终点位置的效果
            _this._drop = CutFruitItemEffect.NONE; //降落终点后的效果
            _this.moveState = ItemState.RISE; //运动状态
            _this.targetY = 0; //上升过程终点位置
            _this.dropTargetY = 0; //下降过程终点位置
            /** 序列化 */
            _this.serializableFields = {
                audioName: qc.Serializer.STRING,
                canRepeat: qc.Serializer.BOOLEAN,
                _touched: qc.Serializer.AUTO,
                _arrive: qc.Serializer.AUTO,
                _drop: qc.Serializer.AUTO,
                needDrop: qc.Serializer.BOOLEAN,
                needDestination: qc.Serializer.BOOLEAN,
                minTargetY: qc.Serializer.NUMBER,
                maxTargetY: qc.Serializer.NUMBER,
                sendMinSpeedX: qc.Serializer.NUMBER,
                sendMaxSpeedX: qc.Serializer.NUMBER,
                sendSpeedY: qc.Serializer.NUMBER,
                dropSpeedX: qc.Serializer.NUMBER,
                dropSpeedY: qc.Serializer.NUMBER,
            };
            return _this;
        }
        CutItem.prototype.createGui = function () {
            return {
                _touched: {
                    title: "命中目标后对节点的操作",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "noAction",
                                label: "无操作",
                            },
                            {
                                value: "hide",
                                label: "隐藏",
                            },
                            {
                                value: "destroy",
                                label: "销毁",
                            },
                        ],
                    },
                },
                _drop: {
                    title: "到达降落终点对节点的操作：",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "noAction",
                                label: "无操作",
                            },
                            {
                                value: "hide",
                                label: "隐藏",
                            },
                            {
                                value: "destroy",
                                label: "销毁",
                            },
                        ],
                    },
                },
                _arrive: {
                    title: "到达终点后对节点的操作",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "noAction",
                                label: "无操作",
                            },
                            {
                                value: "hide",
                                label: "隐藏",
                            },
                            {
                                value: "destroy",
                                label: "销毁",
                            },
                        ],
                    },
                },
                needDestination: {
                    title: "是否需要发射终点位置",
                    component: "switch",
                },
                canRepeat: {
                    title: "是否可重复触发",
                    component: "switch",
                },
                needDrop: {
                    title: "到达发射终点位置后是否降落",
                    component: "switch",
                },
                sendMinSpeedX: {
                    title: "X轴最小发射速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                sendMaxSpeedX: {
                    title: "X轴最大发射速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                sendSpeedY: {
                    title: "Y轴发射速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                minTargetY: {
                    title: "发射终点位置Y最小偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                maxTargetY: {
                    title: "发射终点位置Y最大偏移",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                audioName: {
                    title: "命中时播放音效",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        };
        CutItem.prototype.playAudio = function () {
            this.audioName &&
                ps.AudioTrigger.playSound(UIRoot.getChild(this.audioName), true, false, 1);
        };
        CutItem.prototype.targetItemHandle = function (node, event) {
            if (!this.canRepeat && this.isTarget)
                return;
            this.isTarget = true;
            this.playAudio();
            this.event.dispatch(CutFruitItem.correctTarget, node, event);
            switch (this._touched) {
                case CutFruitItemEffect.NONE:
                    break;
                case CutFruitItemEffect.HIDE:
                    this.gameObject.alpha = 0;
                    this.gameObject.visible = false;
                    break;
                case CutFruitItemEffect.DESTROY:
                    ps.XTween.removeTargetTweens(this.gameObject);
                    this.gameObject.destroy();
                    break;
            }
        };
        /** 组件被激活后执行 */
        CutItem.prototype.awake = function () { };
        CutItem.prototype.onResize = function () {
            if (!this.needDestination) {
                this.targetY =
                    this.sendSpeedY > 0
                        ? this.game.stage.phaser.height +
                            this.gameObject.height
                        : 0 - this.gameObject.height;
            }
            this.dropTargetY = UIRoot.height + this.gameObject.height;
        };
        CutItem.prototype.initProps = function () {
            if (this.needDestination) {
                this.targetY =
                    this.gameObject.y +
                        Math.random() * (this.maxTargetY - this.minTargetY) +
                        this.minTargetY;
            }
            else {
                this.targetY =
                    this.sendSpeedY > 0
                        ? this.game.stage.phaser.height +
                            this.gameObject.height
                        : 0;
            }
            this.dropTargetY = UIRoot.height + this.gameObject.height;
            this.moveTime =
                Math.abs(this.targetY - this.gameObject.y) /
                    (this.sendSpeedY / 2);
            this.acceleration = this.sendSpeedY / this.moveTime;
            this.sendSpeedX =
                Math.random() * (this.sendMaxSpeedX - this.sendMinSpeedX) +
                    this.sendMinSpeedX;
        };
        /** 试玩初始化的处理 */
        CutItem.prototype.onInit = function () {
            // console.info("[info] CutItem.onInit");
        };
        CutItem.prototype.update = function () {
            if (this.moveState == ItemState.RISE) {
                var time = this.game.time.deltaTime;
                this.gameObject.x += (this.sendSpeedX * time) / 1000;
                var oldSpeedY = this.sendSpeedY;
                this.sendSpeedY =
                    this.sendSpeedY + (this.acceleration * time) / 1000;
                this.gameObject.y += (this.sendSpeedY * time) / 1000;
                if (!this.needDestination) {
                    var pos_y = this.gameObject.getWorldPosition().y;
                    if ((this.sendSpeedY > 0 && pos_y > this.targetY) ||
                        (this.sendSpeedY <= 0 && pos_y < 0)) {
                        this.moveState = ItemState.DROP;
                        this.event.dispatch(CutFruitItem.arriveDestination, this.gameObject);
                        switch (this._arrive) {
                            case CutFruitItemEffect.NONE:
                                break;
                            case CutFruitItemEffect.HIDE:
                                this.gameObject.alpha = 0;
                                this.gameObject.visible = false;
                                break;
                            case CutFruitItemEffect.DESTROY:
                                ps.XTween.removeTargetTweens(this.gameObject);
                                this.gameObject.destroy();
                                break;
                        }
                    }
                }
                if ((this.needDestination &&
                    this.sendSpeedY < 0 &&
                    this.gameObject.y <= this.targetY) ||
                    (this.sendSpeedY > 0 &&
                        this.gameObject.y >= this.targetY) ||
                    oldSpeedY * this.sendSpeedY <= 0) {
                    this.moveState = ItemState.DROP;
                    this.event.dispatch(CutFruitItem.arriveDestination, this.gameObject);
                    switch (this._arrive) {
                        case CutFruitItemEffect.NONE:
                            break;
                        case CutFruitItemEffect.HIDE:
                            this.gameObject.alpha = 0;
                            this.gameObject.visible = false;
                            break;
                        case CutFruitItemEffect.DESTROY:
                            ps.XTween.removeTargetTweens(this.gameObject);
                            this.gameObject.destroy();
                            break;
                    }
                }
            }
            else if (this.moveState == ItemState.DROP && this.needDrop) {
                var time = this.game.time.deltaTime;
                this.gameObject.x += (this.sendSpeedX * time) / 1000;
                this.sendSpeedY =
                    this.sendSpeedY + (this.acceleration * time) / 1000;
                this.gameObject.y += (this.sendSpeedY * time) / 1000;
                var pos_y = this.gameObject.getWorldPosition().y;
                if (pos_y > this.dropTargetY) {
                    this.moveState = ItemState.END;
                    this.event.dispatch(CutFruitItem.dropDestination, this.gameObject);
                    switch (this._drop) {
                        case CutFruitItemEffect.NONE:
                            break;
                        case CutFruitItemEffect.HIDE:
                            this.gameObject.alpha = 0;
                            this.gameObject.visible = false;
                            break;
                        case CutFruitItemEffect.DESTROY:
                            ps.XTween.removeTargetTweens(this.gameObject);
                            this.gameObject.destroy();
                            break;
                    }
                }
            }
        };
        /** 试玩开始时的处理 */
        CutItem.prototype.onStart = function () {
            // console.info("[info] CutItem.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        CutItem.prototype.onDestroy = function () {
            // console.info("[info] CutItem.onDestroy");
        };
        return CutItem;
    }(ps.Behaviour));
    ps.CutItem = CutItem;
    qc.registerBehaviour("ps.CutItem", CutItem);
    CutItem["__menu"] = "玩法模板/切水果玩法/（CutItem）";
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
//# sourceMappingURL=CutItem.js.map