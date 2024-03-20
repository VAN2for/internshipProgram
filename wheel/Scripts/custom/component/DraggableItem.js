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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var ps;
(function (ps) {
    var DraggableItemEvent;
    (function (DraggableItemEvent) {
        DraggableItemEvent["onDown"] = "onDown";
        DraggableItemEvent["onUp"] = "onUp";
        DraggableItemEvent["onClick"] = "onClick";
        DraggableItemEvent["onDragStart"] = "onDragStart";
        DraggableItemEvent["onDragEnd"] = "onDragEnd";
        DraggableItemEvent["TriggerTarget"] = "TriggerTarget";
        DraggableItemEvent["MissTarget"] = "MissTarget";
        DraggableItemEvent["toOrgComplete"] = "toOrgComplete";
        DraggableItemEvent["toTargetComplete"] = "toTargetComplete";
        DraggableItemEvent["HitTarget"] = "HitTarget";
        DraggableItemEvent["AwayTarget"] = "AwayTarget";
    })(DraggableItemEvent = ps.DraggableItemEvent || (ps.DraggableItemEvent = {}));
    var DragSpace;
    (function (DragSpace) {
        DragSpace["World"] = "World";
        DragSpace["Local"] = "Local";
    })(DragSpace = ps.DragSpace || (ps.DragSpace = {}));
    var Triggered;
    (function (Triggered) {
        Triggered[Triggered["NORMAL"] = 0] = "NORMAL";
        Triggered[Triggered["SET_TO_ORG"] = 1] = "SET_TO_ORG";
        Triggered[Triggered["RETURN_TO_ORG"] = 2] = "RETURN_TO_ORG";
    })(Triggered = ps.Triggered || (ps.Triggered = {}));
    var Missed;
    (function (Missed) {
        Missed[Missed["NORMAL"] = 0] = "NORMAL";
        Missed[Missed["SET_TO_ORG"] = 1] = "SET_TO_ORG";
        Missed[Missed["RETURN_TO_ORG"] = 2] = "RETURN_TO_ORG";
    })(Missed = ps.Missed || (ps.Missed = {}));
    /**
     * 拖拽组件
     */
    var DraggableItem = /** @class */ (function (_super) {
        __extends(DraggableItem, _super);
        function DraggableItem(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.itemEvent = new ps.EventDispatcher();
            /** 缓动动画耗时(ms) */
            _this.returnAnimDuration = 100;
            /** 拖拽时x偏移值 */
            _this.diffX = 0;
            /** 拖拽时y偏移值 */
            _this.diffY = 0;
            /** 拖拽时缩放倍数 */
            _this.diffS = 1;
            _this.triggered = Triggered.SET_TO_ORG; //命中目标后的操作
            _this.triggerHide = true; //命中目标后，是否自动隐藏
            _this.missed = Missed.RETURN_TO_ORG; //错过目标后的操作
            _this.missHide = false; //错过目标后，是否自动隐藏
            _this._dragSpace = DragSpace.World;
            /** 序列化 */
            _this.serializableFields = {
                allTriggerTargets: qc.Serializer.NODES,
                targetObj: qc.Serializer.AUTO,
                worldObj: qc.Serializer.AUTO,
                returnAnimDuration: qc.Serializer.AUTO,
                diffX: qc.Serializer.AUTO,
                diffY: qc.Serializer.AUTO,
                diffS: qc.Serializer.AUTO,
                triggered: qc.Serializer.AUTO,
                triggerHide: qc.Serializer.AUTO,
                missed: qc.Serializer.AUTO,
                missHide: qc.Serializer.AUTO,
                dragSpace: qc.Serializer.AUTO,
            };
            _this._hasDradEnd = false;
            return _this;
        }
        Object.defineProperty(DraggableItem.prototype, "worldObj", {
            get: function () {
                return this.isDargSpaceWorld
                    ? this.game.world
                    : this._worldObj || this.game.world;
            },
            set: function (value) {
                this._worldObj = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DraggableItem.prototype, "dragSpace", {
            get: function () {
                return this._dragSpace;
            },
            set: function (value) {
                this._dragSpace = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DraggableItem.prototype, "newS", {
            get: function () {
                return this.isDargSpaceWorld
                    ? this.gameObject.getWorldScale().x
                    : this.orgS;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DraggableItem.prototype, "isDargSpaceWorld", {
            get: function () {
                return this.dragSpace === DragSpace.World;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DraggableItem.prototype, "isDargSpaceLocal", {
            get: function () {
                return this.dragSpace === DragSpace.Local;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DraggableItem.prototype, "interactive", {
            set: function (bol) {
                this.gameObject.interactive = bol;
            },
            enumerable: false,
            configurable: true
        });
        DraggableItem.prototype.onInit = function () {
            var _a;
            if (!this.orgParent) {
                this.orgParent = this.gameObject.parent;
            }
            if (this.orgIndex == void 0) {
                this.orgIndex = this.gameObject.parent.getChildIndex(this.gameObject);
            }
            this.interactive = true;
            this.orgX = this.gameObject.x;
            this.orgY = this.gameObject.y;
            this.orgS = this.gameObject.scaleX;
            if (!((_a = this.allTriggerTargets) === null || _a === void 0 ? void 0 : _a.length)) {
                console.info("\u5F53\u524D\u8282\u70B9".concat(this.gameObject.name, "\u6CA1\u914D\u7F6E\u62D6\u62FD\u76EE\u6807\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u6B63\u786E"));
            }
            this.gameObject.onDown.add(this._onDown, this);
        };
        DraggableItem.prototype.checkAllowTouch = function (e) {
            if (ps.DraggableItemEventId != void 0) {
                if (ps.DraggableItemEventId !== e.source.eventId) {
                    return false;
                }
            }
            else {
                ps.DraggableItemEventId = e.source.eventId;
            }
            return true;
        };
        DraggableItem.prototype._onDown = function (target, e) {
            // console.log("onDown", e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            // if (this.isDargSpaceWorld) {
            // const pos = this.gameObject.parent.toGlobal(new qc.Point(this.gameObject.x, this.gameObject.y));
            // pos = this.worldObj.toLocal(pos);
            this.gameObject.scaleX = this.gameObject.scaleY =
                this.newS * this.diffS;
            this.worldObj.addChild(this.gameObject);
            // this.gameObject.x = pos.x + this.diffX;
            // this.gameObject.y = pos.y + this.diffY;
            // this.gameObject.scaleX = this.gameObject.scaleY = this.orgS * this.diffS;
            var pointer = e.source;
            var gP = new qc.Point(pointer.x, pointer.y);
            var p = this.gameObject.parent.toLocal(gP);
            this.gameObject.x = p.x + this.diffX;
            this.gameObject.y = p.y + this.diffY;
            // this.gameObject.scaleX = this.gameObject.scaleY = this.newS * this.diffS;
            ps.Tween.to(this.gameObject, {
                scale: this.newS * this.diffS,
            }, this.returnAnimDuration, Phaser.Easing.Cubic.Out);
            // }
            this._hasDradEnd = false;
            this.itemEvent.dispatch(DraggableItemEvent.onDown, e);
            this.addOtherEvent();
        };
        DraggableItem.prototype.addOtherEvent = function () {
            this.gameObject.onDragStart.addOnce(this._onDragStart, this);
            this.gameObject.onDrag.add(this._onDrag, this);
            this.gameObject.onDragEnd.addOnce(this._onDragEnd, this);
            this.gameObject.onClick.addOnce(this._onClick, this);
            this.gameObject.onUp.addOnce(this._onUp, this);
        };
        DraggableItem.prototype.removeOtherEvent = function () {
            this.gameObject.onDragStart.remove(this._onDragStart, this);
            this.gameObject.onDrag.remove(this._onDrag, this);
            this.gameObject.onDragEnd.remove(this._onDragEnd, this);
            this.gameObject.onClick.remove(this._onClick, this);
            this.gameObject.onUp.remove(this._onUp, this);
        };
        DraggableItem.prototype._onDragStart = function (target, e) {
            // console.log("_onDragStart", target, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            // if (this.isDargSpaceWorld) {
            //     const target = this.gameObject
            //     let pos = target.parent.toGlobal(new qc.Point(target.x, target.y))
            //     pos = this.worldObj.toLocal(pos)
            //     this.worldObj.addChild(target)
            //     target.x = pos.x + this.diffX
            //     target.y = pos.y + this.diffY
            //     target.scaleX = target.scaleY = this.orgS * this.diffS
            // }
            this.itemEvent.dispatch(DraggableItemEvent.onDragStart, e);
        };
        DraggableItem.prototype._onDrag = function (target, e) {
            // console.log("_onDrag", target.parent.name, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            var pointer = e.source;
            var gP = new qc.Point(pointer.x, pointer.y);
            var p = target.parent.toLocal(gP);
            target.x = p.x + this.diffX;
            target.y = p.y + this.diffY;
            var hitTarget = this.checkHitTargetArea(gP);
            if (hitTarget) {
                if (this.lastHitTarget && this.lastHitTarget != hitTarget) {
                    this.itemEvent.dispatch(DraggableItemEvent.AwayTarget, e, this.lastHitTarget);
                    this.lastHitTarget = null;
                }
                this.lastHitTarget = hitTarget;
                this.itemEvent.dispatch(DraggableItemEvent.HitTarget, e, hitTarget);
            }
            else if (this.lastHitTarget) {
                this.itemEvent.dispatch(DraggableItemEvent.AwayTarget, e, this.lastHitTarget);
                this.lastHitTarget = null;
            }
        };
        DraggableItem.prototype.checkHitTargetArea = function (globalPoint) {
            var e_1, _a;
            var _b;
            if (!((_b = this.allTriggerTargets) === null || _b === void 0 ? void 0 : _b.length)) {
                return;
            }
            try {
                for (var _c = __values(this.allTriggerTargets), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var target = _d.value;
                    if (!target || !target.parent)
                        continue;
                    if (target.rectContains(globalPoint))
                        return target;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        DraggableItem.prototype._onDragEnd = function (target, e) {
            // console.log("_onDragEnd", target, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            this.dragEnd(e);
            this.itemEvent.dispatch(DraggableItemEvent.onDragEnd, e);
            if (this.lastHitTarget) {
                this.itemEvent.dispatch(DraggableItemEvent.AwayTarget, e, this.lastHitTarget);
                this.lastHitTarget = null;
            }
            ps.DraggableItemEventId = null;
            this.removeOtherEvent();
        };
        DraggableItem.prototype._onUp = function (target, e) {
            // console.log("_onUp", target, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            this.dragEnd(e);
            this.itemEvent.dispatch(DraggableItemEvent.onUp, e);
            if (this.lastHitTarget) {
                this.itemEvent.dispatch(DraggableItemEvent.AwayTarget, e, this.lastHitTarget);
                this.lastHitTarget = null;
            }
            ps.DraggableItemEventId = null;
            this.removeOtherEvent();
        };
        DraggableItem.prototype._onClick = function (target, e) {
            // console.log("_onClick", target, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            this.itemEvent.dispatch(DraggableItemEvent.onClick, e);
        };
        DraggableItem.prototype.dragEnd = function (e) {
            var _this = this;
            if (this._hasDradEnd) {
                return;
            }
            this._hasDradEnd = true;
            this.interactive = false;
            /** 命中目标后 */
            var triggered = function () {
                switch (_this.triggered) {
                    case Triggered.NORMAL:
                        _this.interactive = true;
                        break;
                    case Triggered.SET_TO_ORG:
                        _this.setToOrgPos();
                        break;
                    case Triggered.RETURN_TO_ORG:
                        _this.returnToOrgPos();
                        break;
                }
                if (_this.triggerHide)
                    _this.gameObject.visible = false;
                _this.itemEvent.dispatch(DraggableItemEvent.TriggerTarget, e, hitTarget);
            };
            /** 错过目标后 */
            var missed = function () {
                switch (_this.missed) {
                    case Missed.NORMAL:
                        break;
                    case Missed.SET_TO_ORG:
                        _this.setToOrgPos();
                        break;
                    case Missed.RETURN_TO_ORG:
                        _this.returnToOrgPos();
                        break;
                }
                if (_this.missHide)
                    _this.gameObject.visible = false;
                _this.itemEvent.dispatch(DraggableItemEvent.MissTarget, e);
            };
            if (!this.allTriggerTargets) {
                missed();
                return;
            }
            var hitTarget = this.checkHitTargetArea(this.gameObject.getWorldPosition());
            if (e instanceof qc.DragEndEvent && hitTarget) {
                triggered();
                // console.log('TriggerTarget');
            }
            else {
                missed();
                // console.log('MissTarget');
            }
        };
        /** 缓动到原处 */
        DraggableItem.prototype.returnToOrgPos = function () {
            var _this = this;
            var target = this.gameObject;
            var orgX = this.orgX;
            var orgY = this.orgY;
            var orgS = this.newS;
            var onComplete = function () {
                _this.interactive = true;
                // if (this.isDargSpaceWorld) {
                _this.setToOrgPos();
                // }
                _this.itemEvent.dispatch(DraggableItemEvent.toOrgComplete);
            };
            // if (this.isDargSpaceWorld) {
            var pos = this.orgParent.toGlobal(new qc.Point(orgX, orgY));
            pos = target.parent.toLocal(pos);
            orgX = pos.x;
            orgY = pos.y;
            // }
            if (target.x !== orgX || target.y !== orgY) {
                ps.Tween.to(target, { x: orgX, y: orgY, scale: orgS }, this.returnAnimDuration).onComplete.addOnce(onComplete);
            }
            else {
                target.x = orgX;
                target.y = orgY;
                onComplete();
            }
        };
        /** 设置到原处 */
        DraggableItem.prototype.setToOrgPos = function () {
            var target = this.gameObject;
            // if (this.isDargSpaceWorld) {
            this.orgParent.addChildAt(target, Math.min(this.orgIndex, this.orgParent.children.length));
            // }
            target.x = this.orgX;
            target.y = this.orgY;
            target.scaleX = target.scaleY = this.orgS;
        };
        /** 缓动到目标处 */
        DraggableItem.prototype.returnToTarget = function (offset, target) {
            var _this = this;
            if (target === void 0) { target = this.targetObj; }
            if (!target || !target.parent)
                return;
            var targetX = target.x;
            var targetY = target.y;
            var onComplete = function () {
                _this.gameObject.scaleX = scale;
                _this.gameObject.scaleY = scale;
                _this.setToTarget(offset, target);
                _this.itemEvent.dispatch(DraggableItemEvent.toTargetComplete, target);
            };
            // if (this.isDargSpaceWorld) {
            var pos = this.gameObject.parent.toGlobal(new qc.Point(this.gameObject.x, this.gameObject.y));
            pos = this.worldObj.toLocal(pos);
            var scale = this.worldObj.getWorldScale().x * this.diffS;
            this.worldObj.addChild(this.gameObject);
            this.gameObject.x = pos.x;
            this.gameObject.y = pos.y;
            // }
            // let pos = target.parent.toGlobal(new qc.Point(targetX, targetY));
            // pos = this.gameObject.parent.toLocal(pos);
            targetX = pos.x;
            targetY = pos.y;
            if (offset) {
                targetX += offset.x;
                targetY += offset.y;
            }
            if (this.gameObject.x !== targetX ||
                this.gameObject.y !== targetY) {
                ps.Tween.to(this.gameObject, { x: targetX, y: targetY, scale: scale }, this.returnAnimDuration).onComplete.addOnce(onComplete);
            }
            else {
                onComplete();
            }
        };
        /** 设置到目标处 */
        DraggableItem.prototype.setToTarget = function (offset, target) {
            if (target === void 0) { target = this.targetObj; }
            if (!target || !target.parent)
                return;
            target.parent.addChildAt(this.gameObject, target.parent.getChildIndex(target) + 1);
            var targetX = target.x;
            var targetY = target.y;
            if (offset) {
                targetX += offset.x;
                targetY += offset.y;
            }
            this.gameObject.x = targetX;
            this.gameObject.y = targetY;
        };
        return DraggableItem;
    }(ps.Behaviour));
    ps.DraggableItem = DraggableItem;
    qc.registerBehaviour("DraggableItem", DraggableItem);
    DraggableItem["__menu"] = "Custom/DraggableItem";
})(ps || (ps = {}));
//# sourceMappingURL=DraggableItem.js.map