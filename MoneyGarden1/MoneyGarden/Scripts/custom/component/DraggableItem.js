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
    /**
     * 拖拽组件
     */
    var DraggableItem = /** @class */ (function (_super) {
        __extends(DraggableItem, _super);
        function DraggableItem(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.itemEvent = new ps.EventDispatcher();
            _this.returnAnimTime = 100;
            _this.diffX = 0; //拖拽时X偏移值
            _this.diffY = 0; //拖拽时Y偏移值
            _this.diffS = 1; //拖拽时缩放偏移值
            _this.triggered = Triggered.SET_TO_ORG; //命中目标后的操作
            _this.triggerHide = true; //命中目标后，是否自动隐藏
            _this.dragSpace = DragSpace.World;
            /** 序列化 */
            _this.serializableFields = {
                targetAreas: qc.Serializer.NODES,
                targetObj: qc.Serializer.NODE,
                worldObj: qc.Serializer.NODE,
                returnAnimTime: qc.Serializer.NUMBER,
                diffX: qc.Serializer.NUMBER,
                diffY: qc.Serializer.NUMBER,
                diffS: qc.Serializer.NUMBER,
                triggered: qc.Serializer.AUTO,
                triggerHide: qc.Serializer.AUTO,
                dragSpace: qc.Serializer.AUTO,
            };
            return _this;
        }
        DraggableItem.prototype.awake = function () {
            if (!this.orgParent)
                this.orgParent = this.gameObject.parent;
            if (this.orgIndex == void 0)
                this.orgIndex = this.gameObject.parent.getChildIndex(this.gameObject);
            if (this.worldObj == null)
                this.worldObj = UIRoot;
        };
        DraggableItem.prototype.onInit = function () {
            this.gameObject.interactive = true;
            this.orgX = this.gameObject.x;
            this.orgY = this.gameObject.y;
            this.orgS = this.gameObject.scaleX;
        };
        DraggableItem.prototype.onDown = function (e) {
            // console.log('onDown');
            this.itemEvent.dispatch(ps.DraggableItemEvent.onDown, e);
        };
        DraggableItem.prototype.onDragStart = function (e) {
            // console.log('onDragStart');
            if (this.dragSpace === DragSpace.World) {
                var target = this.gameObject;
                var pos = target.parent.toGlobal(new qc.Point(target.x, target.y));
                pos = this.worldObj.toLocal(pos);
                this.worldObj.addChild(target);
                target.x = pos.x + this.diffX;
                target.y = pos.y + this.diffY;
                target.scaleX = target.scaleY = this.orgS * this.diffS;
            }
            this.itemEvent.dispatch(ps.DraggableItemEvent.onDragStart, e);
        };
        DraggableItem.prototype.onDrag = function (e) {
            var target = this.gameObject;
            var pointer = e.source;
            var gP = new qc.Point(pointer.x, pointer.y);
            var p = target.parent.toLocal(gP);
            target.x = p.x + this.diffX;
            target.y = p.y + this.diffY;
            target.scaleX = target.scaleY = this.orgS * this.diffS;
            var hitTarget = this.checkHitTargetArea(gP);
            if (hitTarget) {
                if (this.lastHitTarget && this.lastHitTarget != hitTarget) {
                    this.itemEvent.dispatch(ps.DraggableItemEvent.AwayTarget, e, this.lastHitTarget);
                    this.lastHitTarget = null;
                }
                this.lastHitTarget = hitTarget;
                this.itemEvent.dispatch(ps.DraggableItemEvent.HitTarget, e, hitTarget);
            }
            else if (this.lastHitTarget) {
                this.itemEvent.dispatch(ps.DraggableItemEvent.AwayTarget, e, this.lastHitTarget);
                this.lastHitTarget = null;
            }
        };
        DraggableItem.prototype.checkHitTargetArea = function (globalPoint) {
            if (!this.targetAreas || !this.targetAreas.length)
                return;
            for (var _i = 0, _a = this.targetAreas; _i < _a.length; _i++) {
                var target = _a[_i];
                if (!target || !target.parent)
                    continue;
                if (target.rectContains(globalPoint))
                    return target;
            }
        };
        DraggableItem.prototype.onDragEnd = function (e) {
            // console.log('onDragEnd', e);
            this.dragEnd(e);
            this.itemEvent.dispatch(ps.DraggableItemEvent.onDragEnd, e);
            if (this.lastHitTarget) {
                this.itemEvent.dispatch(ps.DraggableItemEvent.AwayTarget, e, this.lastHitTarget);
                this.lastHitTarget = null;
            }
        };
        DraggableItem.prototype.onUp = function (e) {
            // console.log('onUp', e);
            this.itemEvent.dispatch(ps.DraggableItemEvent.onUp, e);
            if (this.lastHitTarget) {
                this.itemEvent.dispatch(ps.DraggableItemEvent.AwayTarget, e, this.lastHitTarget);
                this.lastHitTarget = null;
            }
        };
        DraggableItem.prototype.onClick = function (e) {
            // console.log('onClick', e);
            this.itemEvent.dispatch(ps.DraggableItemEvent.onClick, e);
        };
        DraggableItem.prototype.dragEnd = function (e) {
            this.gameObject.interactive = false;
            if (!this.targetAreas) {
                this.returnToOrgPos();
                return;
            }
            var hitTarget = this.checkHitTargetArea(this.gameObject.getWorldPosition());
            if (e instanceof qc.DragEndEvent && hitTarget) {
                switch (this.triggered) {
                    case Triggered.NORMAL:
                        this.gameObject.interactive = true;
                        break;
                    case Triggered.SET_TO_ORG:
                        this.setToOrgPos();
                        break;
                    case Triggered.RETURN_TO_ORG:
                        this.returnToOrgPos();
                        break;
                }
                if (this.triggerHide)
                    this.gameObject.visible = false;
                this.itemEvent.dispatch(ps.DraggableItemEvent.TriggerTarget, e, hitTarget);
                // console.log('TriggerTarget');
            }
            else {
                this.returnToOrgPos();
                this.itemEvent.dispatch(ps.DraggableItemEvent.MissTarget, e);
                // console.log('MissTarget');
            }
        };
        /** 回到原处 */
        DraggableItem.prototype.returnToOrgPos = function () {
            var _this = this;
            var target = this.gameObject;
            var orgX = this.orgX;
            var orgY = this.orgY;
            var orgS = this.orgS;
            var onComplete = function () {
                target.interactive = true;
                if (_this.dragSpace === DragSpace.World)
                    _this.setToOrgPos();
                _this.itemEvent.dispatch(ps.DraggableItemEvent.toOrgComplete);
            };
            if (this.dragSpace === DragSpace.World) {
                var pos = this.orgParent.toGlobal(new qc.Point(orgX, orgY));
                pos = target.parent.toLocal(pos);
                orgX = pos.x;
                orgY = pos.y;
            }
            if (target.x !== orgX || target.y !== orgY) {
                ps.Tween.to(target, { x: orgX, y: orgY, scale: orgS }, this.returnAnimTime).onComplete.addOnce(onComplete);
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
            if (this.dragSpace === DragSpace.World)
                this.orgParent.addChildAt(target, Math.min(this.orgIndex, this.orgParent.children.length));
            target.x = this.orgX;
            target.y = this.orgY;
            target.scaleX = target.scaleY = this.orgS;
        };
        /** 回到目标位 */
        DraggableItem.prototype.returnToTarget = function (offset, target) {
            var _this = this;
            if (target === void 0) { target = this.targetObj; }
            if (!target || !target.parent)
                return;
            var targetX = target.x;
            var targetY = target.y;
            var onComplete = function () {
                _this.setToTarget();
                _this.itemEvent.dispatch(ps.DraggableItemEvent.toTargetComplete, target);
            };
            if (this.dragSpace === DragSpace.World) {
                var pos_1 = this.gameObject.parent.toGlobal(new qc.Point(this.gameObject.x, this.gameObject.y));
                pos_1 = this.worldObj.toLocal(pos_1);
                this.worldObj.addChild(this.gameObject);
                this.gameObject.x = pos_1.x;
                this.gameObject.y = pos_1.y;
            }
            var pos = target.parent.toGlobal(new qc.Point(targetX, targetY));
            pos = this.gameObject.parent.toLocal(pos);
            targetX = pos.x;
            targetY = pos.y;
            if (offset) {
                targetX += offset.x;
                targetY += offset.y;
            }
            if (this.gameObject.x !== targetX || this.gameObject.y !== targetY) {
                ps.Tween.to(this.gameObject, { x: targetX, y: targetY, scale: this.orgS * this.diffS }, this.returnAnimTime).onComplete.addOnce(onComplete);
            }
            else
                onComplete();
        };
        /** 设置到目标位 */
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
    qc.registerBehaviour('DraggableItem', DraggableItem);
    DraggableItem["__menu"] = 'Custom/DraggableItem';
})(ps || (ps = {}));
