var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ps;
(function (ps) {
    var Drager = /** @class */ (function (_super) {
        __extends(Drager, _super);
        function Drager(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.itemEvent = new ps.EventDispatcher();
            _this.returnAnimTime = 100;
            _this.dragSpace = "LOCAL";
            _this.targetAreaList = {};
            _this.dragDirection = 'any';
            _this.serializableFields = {
                targetAreaList: qc.Serializer.MAPPING,
                returnAnimTime: qc.Serializer.NUMBER,
                dragSpace: qc.Serializer.STRING,
                version: qc.Serializer.STRING,
                dragDirection: qc.Serializer.STRING
            };
            return _this;
        }
        Drager.prototype.awake = function () {
            if (!this.orgParent)
                this.orgParent = this.gameObject.parent;
            if (this.orgIndex == void 0)
                this.orgIndex = this.gameObject.parent.getChildIndex(this.gameObject);

            this.orgX = this.gameObject.x;
            this.orgY = this.gameObject.y;

        };
        Drager.prototype.onStart = function () {
            this.gameObject.interactive = true;

        };
        Drager.prototype.onResize = function () {
            var _this = this;
            ps.timer.once(1, function () {
                _this.orgX = _this.gameObject.x;
                _this.orgY = _this.gameObject.y;
            });
        };
        Drager.prototype.onDown = function () {
            // console.log('onDown');
            this.itemEvent.dispatch(ps.DraggableItemEvent.onDown);
        };

        Drager.prototype.getScaleX = function (item) {
            // console.log('onDown');
            var s = item.scaleX;
            while(item.parent != UIRoot)
            {
                s = s * item.parent.scaleX;
                item = item.parent;
            }

            return s;
        };

        Drager.prototype.onDragStart = function () {
            // console.log('onDragStart');
            if (this.dragSpace === "World") {
                var target = this.gameObject;

                var s = this.getScaleX(target)

                target.scaleX  = target.scaleY = s;

                var sc = target.getScript("ps.Layout");
                if (sc) {
                    target.removeScript(sc);
                    sc.enable = false;
                }

                var pos = target.parent.toGlobal(new qc.Point(target.x, target.y));
                pos = UIRoot.toLocal(pos);
                UIRoot.addChild(target);
                target.x = pos.x;
                target.y = pos.y;
            }
            this.itemEvent.dispatch(ps.DraggableItemEvent.onDragStart);
            gameEvent.dispatch('VPDRAG_START', this.gameObject.uuid);
            console.log("onDragStart");
        };
        Drager.prototype.onDrag = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var dragEvent;
            var target = this.gameObject;
            args.forEach(function (arg) { if (arg instanceof qc.DragEvent) {
                dragEvent = arg;
            } });
            if (!dragEvent)
                return;
            var p = target.parent.toLocal(new qc.Point(dragEvent.source['x'], dragEvent.source['y']));
            if (this.dragDirection === 'x' || this.dragDirection === 'any') {
              target.x = p.x;
            }
            if (this.dragDirection === 'y' || this.dragDirection === 'any') {
              target.y = p.y;
            }
            console.log("onDrag");
        };
        Drager.prototype.onDragEnd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // console.log('onDragEnd', ...args);
            var dragEndEvent = args.filter(function (arg) { return arg instanceof qc.DragEndEvent; })[0];
            this.dragEnd(dragEndEvent);
            console.log("onDragEnd");
        };
        Drager.prototype.onUp = function ( /* ...args */) {
            // console.log('onUp', ...args);
            // const pointerEvent: qc.PointerEvent = args.filter(arg => arg instanceof qc.PointerEvent)[0]
            // this.dragEnd(pointerEvent)
            this.itemEvent.dispatch(ps.DraggableItemEvent.onUp);
        };
        Drager.prototype.onDragSuccess = function () {
            console.log("onDragSuccess");
        };
        Drager.prototype.dragEnd = function (event) {
            // this.gameObject.interactive = false;
            var endPoint = new qc.Point(event.source['x'], event.source['y']);
            var isOver = false;
            if (event instanceof qc.DragEndEvent) {

                var targetGet = null

                for (var i in this.targetAreaList) {
                    var targetAreas = this.targetAreaList[i];
                    for(var j in targetAreas) {
                        var targetArea = qc_game.nodePool.find(targetAreas[j]);
                        if (targetArea.rectContains(endPoint)) {
                            if (this.dragSpace === "World")
                                this.setToOrgPos();
                            // this.gameObject.visible = false
                            this.itemEvent.dispatch(ps.DraggableItemEvent.TriggerTarget);
                            gameEvent.dispatch('VPDRAG_END', i);
                            isOver = true;
                            this.onDragSuccess();
                            targetGet = targetArea;
                        }
                    }
                }
            }
            else {
                this.returnToOrgPos();
                this.itemEvent.dispatch(ps.DraggableItemEvent.MissTarget, endPoint);
                // console.log('MissTarget');
            }
            if (!isOver) {
                this.returnToOrgPos();
                this.itemEvent.dispatch(ps.DraggableItemEvent.MissTarget, endPoint);
            }
        };
        Drager.prototype.returnToOrgPos = function () {
            var _this = this;
            var target = this.gameObject;
            var orgX1 = this.orgX;
            var orgY1= this.orgY;
            var pos;
            var onComplete = function () {
                target.interactive = true;
                if (_this.dragSpace === "World")
                    _this.setToOrgPos();
            };
            if (this.dragSpace === "World") {
                pos = this.orgParent.toGlobal(new qc.Point(orgX1, orgY1));
                pos = target.parent.toLocal(pos);
                orgX1 = pos.x;
                orgY1 = pos.y;
            }
            if (target.x !== orgX1 || target.y !== orgY1) {
                ps.Tween.to(target, { x: orgX1, y: orgY1 }, this.returnAnimTime).onComplete.addOnce(onComplete);
            }
            else {
                target.x = orgX1;
                target.y = orgY1;
            }
        };
        Drager.prototype.setToOrgPos = function () {
            var target = this.gameObject;
            // this.orgParent.addChildAt(target, this.orgIndex);
                        var orgX1 = this.orgX;
            var orgY1= this.orgY;
            if (this.dragSpace === "World") {
                pos = this.orgParent.toGlobal(new qc.Point(orgX1, orgY1));
                pos = target.parent.toLocal(pos);
                orgX1 = pos.x;
                orgY1 = pos.y;
            }
            target.x = orgX1;
            target.y = orgY1;
        };
        return Drager;
    }(ps.Behaviour));
    ps.Drager = Drager;
    qc.registerBehaviour('ps.Drager', Drager);
    Drager["__ability"] = 'dragDirection';
})(ps || (ps = {}));
//# sourceMappingURL=Drager.js.map
