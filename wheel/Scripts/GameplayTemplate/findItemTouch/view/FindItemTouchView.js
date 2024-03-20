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
     * 目标物品（触控）事件类型
     * @param 目标物品（触控）事件参数类型 {@link FindItemTouchEventParamType}
     */
    var FindItemTouchEvent;
    (function (FindItemTouchEvent) {
        FindItemTouchEvent["onDown"] = "onDown";
        FindItemTouchEvent["onUp"] = "onUp";
        FindItemTouchEvent["onClick"] = "onClick";
        FindItemTouchEvent["CorrectTarget"] = "CorrectTarget";
        FindItemTouchEvent["ErrorTarget"] = "ErrorTarget";
    })(FindItemTouchEvent = ps.FindItemTouchEvent || (ps.FindItemTouchEvent = {}));
    /** 触控到目标（区域）后对节点的操作 */
    var Touched;
    (function (Touched) {
        Touched[Touched["NONE"] = 0] = "NONE";
        Touched[Touched["HIDE"] = 1] = "HIDE";
        Touched[Touched["DESTROY"] = 2] = "DESTROY";
        Touched[Touched["ONCE"] = 3] = "ONCE";
    })(Touched = ps.Touched || (ps.Touched = {}));
    /**
     * 目标物品（触控）
     * @description 目标物品（触控）
     * @author bin
     * @date 2022/12/28 18:17:22
     */
    var FindItemTouchView = /** @class */ (function (_super) {
        __extends(FindItemTouchView, _super);
        function FindItemTouchView(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 是否克隆联动节点目标事件节点 */
            _this.isCloneRelationEventNode = true;
            /** 是否保持事件节点位置与当前目标（区域）位置相同 */
            _this.isCustomEventTargetNodePointToGameObj = true;
            /** 是否手指按下触发，否则为点击 */
            _this._isDown = false;
            /** 触控到目标（区域）后对节点的操作 */
            _this._touched = Touched.NONE;
            /** 触控到目标（区域）后的音效 */
            _this._soundName = "";
            /** 事件相关 */
            _this.event = new ps.EventDispatcher();
            _this._addEvented = false;
            _this._isFinded = false;
            /** 序列化 */
            _this.serializableFields = {
                _isDown: qc.Serializer.AUTO,
                _touched: qc.Serializer.AUTO,
                _soundName: qc.Serializer.AUTO,
                _action: qc.Serializer.AUTO,
                _customEventOnDown: qc.Serializer.CUSTOMEVENT,
                _customEventOnUp: qc.Serializer.CUSTOMEVENT,
                _customEventOnClick: qc.Serializer.CUSTOMEVENT,
                _customEventTarget: qc.Serializer.CUSTOMEVENT,
                _customEventTargetNode: qc.Serializer.NODE,
                _customEventRelationNode: qc.Serializer.NODE,
            };
            return _this;
        }
        Object.defineProperty(FindItemTouchView.prototype, "isFinded", {
            get: function () {
                return this._isFinded;
            },
            enumerable: false,
            configurable: true
        });
        FindItemTouchView.prototype.createGui = function () {
            return {
                _isDown: {
                    title: "是否手指按下触发，否则为点击",
                    component: "switch",
                },
                _touched: {
                    title: "触控到目标（区域）后对节点的操作",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: Touched.NONE,
                                label: "无操作"
                            },
                            {
                                value: Touched.HIDE,
                                label: "隐藏"
                            },
                            {
                                value: Touched.DESTROY,
                                label: "销毁"
                            },
                            {
                                value: Touched.ONCE,
                                label: "不再触发"
                            }
                        ],
                        placeholder: "触控到目标（区域）后对节点的操作",
                    },
                },
                _soundName: {
                    title: "触控到目标（区域）后的音效",
                    component: "input",
                },
                _action: {
                    title: "触控到目标（区域）后的埋点",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _customEventOnDown: {
                    title: "触控按下事件",
                },
                _customEventOnUp: {
                    title: "触控抬起事件",
                },
                _customEventOnClick: {
                    title: "点击事件",
                },
                _customEventTarget: {
                    title: "触控到目标（区域）事件",
                },
                _customEventTargetNode: {
                    title: "触控到目标（区域）事件节点",
                },
                _customEventRelationNode: {
                    title: "触控到目标（区域）联动节点",
                    tail: "触控到目标时，联动节点的目标效果会同时触发",
                },
            };
        };
        FindItemTouchView.prototype.awake = function () {
            this.gameObject.interactive = true;
        };
        /** 试玩初始化的处理 */
        FindItemTouchView.prototype.onInit = function () {
            // console.info("[info] FindItemTouchView.onInit");
            this.addEvent();
        };
        FindItemTouchView.prototype.addEvent = function () {
            if (this._addEvented) {
                return;
            }
            this.gameObject.onDown.add(this._onDown, this);
            this.gameObject.onClick.add(this._onClick, this);
            this._addEvented = true;
        };
        FindItemTouchView.prototype.removeEvent = function () {
            if (!this._addEvented) {
                return;
            }
            this.gameObject.onDown.remove(this._onDown, this);
            this.gameObject.onUp.remove(this._onUp, this);
            this.gameObject.onClick.remove(this._onClick, this);
            this._addEvented = false;
        };
        /** 触发目标（区域）时，派发事件 */
        FindItemTouchView.prototype.dispatchEvent = function (param) {
            this.event.dispatch(FindItemTouchEvent.CorrectTarget, param);
        };
        FindItemTouchView.prototype.triggerCustomEvent = function (globalPoint) {
            if (this._customEventTargetNode) {
                var node = void 0;
                if (this.isCloneRelationEventNode) {
                    node = this.game.add.clone(this._customEventTargetNode);
                    if (this._customEventTarget) {
                        var customEvent = ps.cloneCustomEventByCustomEventFieldToNode(this._customEventTarget, {
                            from: this._customEventTargetNode,
                            to: node
                        });
                        if (customEvent) {
                            ps.playVpActions(customEvent.action);
                        }
                    }
                }
                else {
                    if (this._customEventTarget) {
                        ps.triggerCustomEventByCustomEventField(this._customEventTarget);
                    }
                    node = this._customEventTargetNode;
                }
                node === null || node === void 0 ? void 0 : node.setPropertyIgnoreLayout({ prop: "x" });
                node === null || node === void 0 ? void 0 : node.setPropertyIgnoreLayout({ prop: "y" });
                this.gameObject.addChild(node);
                // node?.parent.setChildIndex(node, node.parent.children.length - 1);
                var _a = node.parent.toLocal(globalPoint), x = _a.x, y = _a.y;
                node.x = x;
                node.y = y;
            }
        };
        FindItemTouchView.prototype.checkAllowTouch = function (e) {
            if (this._findItemEventId != void 0) {
                if (this._findItemEventId !== e.source.eventId) {
                    return false;
                }
            }
            else {
                this._findItemEventId = e.source.eventId;
            }
            return true;
        };
        /** 触控按下时处理 */
        FindItemTouchView.prototype._onDown = function (target, e) {
            // console.info("[info] FindItemTouchView._onDown");
            if (!this.checkAllowTouch(e)) {
                return;
            }
            if (!this._isDown) {
                return;
            }
            this.event.dispatch(FindItemTouchEvent.onDown, {
                script: this,
                target: target,
                event: e,
                globalPoint: new qc.Point(e.source.x, e.source.y),
                isRelation: false,
            });
            this._customEventOnDown && ps.triggerCustomEventByCustomEventField(this._customEventOnDown);
            this._onTouch(e);
            this.gameObject.onUp.remove(this._onUp, this);
            this.gameObject.onUp.addOnce(this._onUp, this);
        };
        /** 触控抬起时处理 */
        FindItemTouchView.prototype._onUp = function (target, e) {
            // console.info("[info] FindItemTouchView._onUp");
            if (!this.checkAllowTouch(e)) {
                return;
            }
            this.event.dispatch(FindItemTouchEvent.onUp, {
                script: this,
                target: target,
                event: e,
                globalPoint: new qc.Point(e.source.x, e.source.y),
                isRelation: false,
            });
            this._customEventOnUp && ps.triggerCustomEventByCustomEventField(this._customEventOnUp);
            this._findItemEventId = null;
        };
        /** 点击时处理 */
        FindItemTouchView.prototype._onClick = function (target, e) {
            // console.info("[info] FindItemTouchView._onClick");
            if (!this.checkAllowTouch(e)) {
                return;
            }
            if (this._isDown) {
                return;
            }
            this.event.dispatch(FindItemTouchEvent.onClick, {
                script: this,
                target: target,
                event: e,
                globalPoint: new qc.Point(e.source.x, e.source.y),
                isRelation: false,
            });
            this._customEventOnClick && ps.triggerCustomEventByCustomEventField(this._customEventOnClick);
            this._onTouch(e);
        };
        /** 音效处理 */
        FindItemTouchView.prototype.playSound = function () {
            if (this._soundName) {
                var nodeAudio = UIRoot.getChild(this._soundName);
                if (nodeAudio && (ps.AudioTrigger === null || ps.AudioTrigger === void 0 ? void 0 : ps.AudioTrigger.playSound)) {
                    ps.AudioTrigger.playSound(nodeAudio, true, false, 1);
                }
                else {
                    ps.Audio.playSound(this._soundName);
                }
            }
        };
        /** 埋点处理 */
        FindItemTouchView.prototype.sendAction = function () {
            if (this._action) {
                ps.sendAction(this._action);
            }
        };
        FindItemTouchView.prototype.onTouched = function () {
            switch (this._touched) {
                case Touched.NONE:
                    break;
                case Touched.HIDE:
                    this.gameObject.alpha = 0;
                    this.gameObject.visible = false;
                    break;
                case Touched.DESTROY:
                    this.gameObject.destroy();
                    break;
                case Touched.ONCE:
                    this.removeEvent();
                    break;
            }
        };
        FindItemTouchView.prototype._onTouch = function (event) {
            var _a;
            var onTouch = function (script, globalPoint, isRelation) {
                script.playSound();
                script.sendAction();
                script.onTouched();
                script.dispatchEvent({
                    script: script,
                    target: script.gameObject,
                    event: event,
                    globalPoint: globalPoint,
                    isRelation: isRelation,
                });
                script.triggerCustomEvent(globalPoint);
                script._isFinded = true;
            };
            var touchPoint = this.isCustomEventTargetNodePointToGameObj ?
                this.gameObject.getWorldPosition() :
                new qc.Point(event.source.x, event.source.y);
            onTouch(this, touchPoint, false);
            // 联动节点。触控到目标时，联动节点的目标效果会同时触发
            var relationScript = (_a = this._customEventRelationNode) === null || _a === void 0 ? void 0 : _a.getScript(FindItemTouchView);
            if (relationScript) {
                var relationPoint = this._customEventRelationNode.toGlobal(this.gameObject.toLocal(touchPoint));
                onTouch(relationScript, relationPoint, true);
            }
        };
        /** 当脚本被移除时，会自动调用 */
        FindItemTouchView.prototype.onDestroy = function () {
            // console.info("[info] FindItemTouchView.onDestroy");
        };
        return FindItemTouchView;
    }(ps.Behaviour));
    ps.FindItemTouchView = FindItemTouchView;
    qc.registerBehaviour("ps.FindItemTouchView", FindItemTouchView);
    FindItemTouchView["__menu"] = "玩法模板/寻找物品（触控）玩法/目标物品（触控）（FindItemTouchView）";
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
//# sourceMappingURL=FindItemTouchView.js.map