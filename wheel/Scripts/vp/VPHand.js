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
var ActionType = {
    CLICK: 'CLICK',
    DOWN: 'DOWN',
    UP: 'UP',
    SWIPE_LEFT: 'SWIPE_LEFT',
    SWIPE_RIGHT: 'SWIPE_RIGHT',
    SWIPE_UP: 'SWIPE_UP',
    SWIPE_DOWN: 'SWIPE_DOWN',
    SWIPE_ANY: 'SWIPE_ANY',
    HOLD: 'HOLD',
    DOUBLE_CLICK: 'DOUBLE_CLICK'
};
var ps;
(function (ps) {
    /**
     * 场景跳转指令
     * @author VaMP
     */
    var VPHand = /** @class */ (function (_super) {
        __extends(VPHand, _super);
        function VPHand(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.awakeCode = "";
            _this.switchScene = "";
            _this.rootNode = "";
            _this.page = "";
            /** 序列化 */
            _this.serializableFields = {
                awakeCode: qc.Serializer.STRING,
                switchScene: qc.Serializer.STRING,
                rootNode: qc.Serializer.STRING,
                version: qc.Serializer.STRING
            };
            return _this;
        }
        VPHand.prototype.awake = function () {
            this.gameObject.interactive = true;
        };
        VPHand.prototype.onDown = function (e) {
            var t = new Date().getTime();
            this.clickTime = t
            this.downX = e.source._x;
            this.downY = e.source._y;
            this.onMouseDown(e);
        };
        VPHand.prototype.onUp = function (e) {
            var that = this;
            var t = new Date().getTime();
            if (t - that.clickTime > 3000) {
                that.clickTime = 0;
                that.clickEndTime = 0;
                that.onMouseUp(e);
                that.onHold(e);
            } else {
                var doubleClickInterval = 200
                if (t - that.clickTime != 0 && t - that.clickEndTime <= doubleClickInterval) {
                    that.clickTime = 0;
                    that.clickEndTime = 0;
                    that.onDouckClick(e);
                    return;
                }
                that.clickEndTime = t;
                that.onMouseUp(e);
            }

            var minDelta = 30
            var isAny = false;
            if (e.source._x - that.downX > minDelta) {
                that.onMoveRight(e);
                isAny = true;
            }
            else if (e.source._x - that.downX < -1 * minDelta) {
                that.onMoveLeft(e);
                isAny = true;
            }

            if (e.source._y - that.downY < -1 * minDelta) {
                that.onMoveUp(e);
                isAny = true;
            }
            else if (e.source._y - that.downY > minDelta) {
                that.onMoveDown(e);
                isAny = true;
            }

            if (isAny) {
                that.onMoveAny(e);
            }
        };
        VPHand.prototype.onMouseDown = function (e) {
            this.dispatchEvent(ActionType.DOWN);
        };
        VPHand.prototype.onMouseUp = function (e) {
            this.dispatchEvent(ActionType.UP);
        };
        VPHand.prototype.onHold = function (e) {
            this.dispatchEvent(ActionType.HOLD)
        };
        VPHand.prototype.onClick = function (e) {
            this.dispatchEvent(ActionType.CLICK)
        };
        VPHand.prototype.onMoveRight = function (e) {
            this.dispatchEvent(ActionType.SWIPE_RIGHT)
        };
        VPHand.prototype.onMoveLeft = function (e) {
            this.dispatchEvent(ActionType.SWIPE_LEFT)
        };
        VPHand.prototype.onMoveUp = function (e) {
            this.dispatchEvent(ActionType.SWIPE_UP)
        };
        VPHand.prototype.onMoveDown = function (e) {
            this.dispatchEvent(ActionType.SWIPE_DOWN)
        };
        VPHand.prototype.onMoveAny = function (e) {
            this.dispatchEvent(ActionType.SWIPE_ANY)
        };
        VPHand.prototype.onDouckClick = function (e) {
            this.dispatchEvent(ActionType.DOUBLE_CLICK)
        };
        VPHand.prototype.dispatchEvent = function (event) {
            ps.mainState.dispatch(event, this.gameObject.uuid)
            console.log('VPHand: ',event, ' uuid: ', this.gameObject.uuid);
        }
        return VPHand;
    }(ps.Behaviour));
    ps.VPHand = VPHand;
    qc.registerBehaviour('ps.VPHand', VPHand);
})(ps || (ps = {}));
