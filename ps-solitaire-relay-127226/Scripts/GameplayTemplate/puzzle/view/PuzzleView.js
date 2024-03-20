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
     * 拼图块
     * @description 拼图块
     * @author bin
     * @date 2022/12/09 10:59:51
     */
    var PuzzleView = /** @class */ (function (_super) {
        __extends(PuzzleView, _super);
        function PuzzleView(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 是否自动吸附 */
            _this._isAutoAdsorb = true;
            /** 序列化拓展 */
            _this.serializableFields["_isAutoAdsorb"] = qc.Serializer.AUTO;
            return _this;
        }
        PuzzleView.prototype.createGui = function () {
            return {
                allTriggerTargets: {
                    title: "所有可命中目标",
                    component: "nodes",
                },
                returnAnimDuration: {
                    title: "缓动动画耗时(ms)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                diffX: {
                    title: "拖拽时x偏移值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                diffY: {
                    title: "拖拽时y偏移值",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                diffS: {
                    title: "拖拽时缩放倍数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                missed: {
                    title: "错过目标后操作:",
                    component: "select",
                    field: {
                        // 配置下拉列表选项
                        options: [
                            {
                                value: ps.Missed.NORMAL,
                                label: "无操作",
                            },
                            {
                                value: ps.Missed.SET_TO_ORG,
                                label: "设置回原位",
                            },
                            {
                                value: ps.Missed.RETURN_TO_ORG,
                                label: "缓动回原位",
                            },
                        ],
                    },
                },
                missHide: {
                    title: "错过目标后，是否隐藏",
                    component: "switch",
                },
                dragSpace: {
                    title: "是否在顶层拖拽",
                    component: "select",
                    field: {
                        // 配置下拉列表选项
                        options: [
                            {
                                value: "World",
                                label: "是",
                            },
                            {
                                value: "Local",
                                label: "否",
                            },
                        ],
                    },
                },
                _isAutoAdsorb: {
                    title: "是否自动吸附",
                    component: "switch",
                },
            };
        };
        PuzzleView.prototype.awake = function () {
            var _a;
            this.triggered = ps.Triggered.NORMAL;
            this.triggerHide = false;
            if ((_a = this.allTriggerTargets) === null || _a === void 0 ? void 0 : _a.length) {
                this.targetObj = this.allTriggerTargets[0];
            }
        };
        /** 试玩初始化的处理 */
        PuzzleView.prototype.onInit = function () {
            // console.info("[info] PuzzleView.onInit");
            _super.prototype.onInit.call(this);
            this.itemEvent.addOnce(ps.DraggableItemEvent.TriggerTarget, this.onTriggerTarget, this);
            if (this._isAutoAdsorb) {
                this.itemEvent.addOnce(ps.DraggableItemEvent.HitTarget, this.onTriggerTarget, this);
            }
            this.itemEvent.addOnce(ps.DraggableItemEvent.toTargetComplete, this.onToTargetComplete, this);
        };
        PuzzleView.prototype.onTriggerTarget = function (e, hitTarget) {
            this.itemEvent.remove(ps.DraggableItemEvent.TriggerTarget, this.onTriggerTarget, this);
            this.itemEvent.remove(ps.DraggableItemEvent.HitTarget, this.onTriggerTarget, this);
            this.gameObject.interactive = false;
            this.returnToTarget();
        };
        PuzzleView.prototype.onToTargetComplete = function (target) {
            var view = target.getScript(ps.PuzzleTargetView);
            if (!(view === null || view === void 0 ? void 0 : view.isHideTarget)) {
                return;
            }
            if (view.block) {
                view.block.visible = true;
                this.gameObject.visible = false;
            }
            if (view.blockMask) {
                view.blockMask.visible = false;
            }
        };
        return PuzzleView;
    }(ps.DraggableItem));
    ps.PuzzleView = PuzzleView;
    qc.registerBehaviour("ps.PuzzleView", PuzzleView);
    PuzzleView["__menu"] = "玩法模板/拼图玩法/拼图块（PuzzleView）";
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
//# sourceMappingURL=PuzzleView.js.map