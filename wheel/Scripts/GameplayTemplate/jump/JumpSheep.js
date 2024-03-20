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
     * @description
     * @author jingru.wu
     * @date 2023/03/16 14:42:05
     */
    var JumpSheep = /** @class */ (function (_super) {
        __extends(JumpSheep, _super);
        function JumpSheep() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Event = new ps.EventDispatcher();
            _this._v = 0;
            _this._g = 3800;
            _this._vyInit = -1100; //像素每秒
            _this._vx = 500; //像素每秒
            _this._tJump = 0;
            _this._overJump = false;
            /** 序列化 */
            _this.serializableFields = {
                _g: qc.Serializer.NUMBER,
                _vyInit: qc.Serializer.NUMBER,
                _vx: qc.Serializer.NUMBER,
                _nodeStand: qc.Serializer.NODE,
                _nodeJump: qc.Serializer.NODE,
                _nodeDie: qc.Serializer.NODE,
                _jumpView: qc.Serializer.NODE,
            };
            return _this;
        }
        JumpSheep.prototype.createGui = function () {
            return {
                _g: {
                    title: "重力",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _vyInit: {
                    title: "角色竖直方向的初始速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _vx: {
                    title: "角色被撞飞时水平方向的速度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                _nodeStand: {
                    title: "角色站着的节点",
                    component: "node",
                },
                _nodeJump: {
                    title: "角色跳着的节点",
                    component: "node",
                },
                _nodeDie: {
                    title: "角色躺着的节点",
                    component: "node",
                },
                _jumpView: {
                    title: "挂载全局组件节点",
                    component: "node",
                },
            };
        };
        JumpSheep.prototype.onInit = function () {
            var _this = this;
            this._jumpViewScript = this._jumpView.getScript("ps.JumpView");
            this._nodeDie.visible = true;
            this._nodeJump.visible = true;
            this._nodeJump.visible = true;
            this._nodeDie.alpha = 0;
            this._nodeJump.alpha = 0;
            this._petInitY = this.gameObject.y;
            // 注册事件
            var jumpScript = this._nodeJump.addScript("qc.Box2D.Body");
            jumpScript.onBodyCreated.add(function () {
                jumpScript.resetShapeFromEdge(3);
                jumpScript.type = 2;
                jumpScript.fixedRotation = false;
                jumpScript.sensor = true;
                jumpScript.gravityScale = 0;
                _this._nodeJumpSize = ps.jumpUtils.getTrueBoxSize(_this._nodeJump);
            });
            var standScript = this._nodeStand.addScript("qc.Box2D.Body");
            standScript.onBodyCreated.add(function () {
                standScript.resetShapeFromEdge(3);
                standScript.type = 2;
                standScript.fixedRotation = false;
                standScript.sensor = true;
                standScript.gravityScale = 0;
                _this._nodeStandSize = ps.jumpUtils.getTrueBoxSize(_this._nodeStand);
            });
            this._jumpViewScript.Event.add("jump", this.onIsJumping, this);
        };
        Object.defineProperty(JumpSheep.prototype, "nodeJumpSize", {
            get: function () {
                return this._nodeJumpSize;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JumpSheep.prototype, "nodeStandSize", {
            get: function () {
                return this._nodeStandSize;
            },
            enumerable: false,
            configurable: true
        });
        JumpSheep.prototype.gameFail = function () {
            var _this = this;
            this._jumpViewScript.gameEnd(false);
            this._nodeDie.alpha = 1;
            this._nodeStand.alpha = 0;
            this._nodeJump.alpha = 0;
            this.removeJumpTick();
            if (this._overJump) {
                var fall_1 = function () {
                    var y = _this.gameObject.y;
                    var delta = (Date.now() - _this._tJump) / 1000;
                    _this._v += _this._g * delta;
                    y += _this._v * delta;
                    _this.gameObject.y = y;
                    _this._tJump = Date.now();
                    if (y >= _this._petInitY) {
                        ps.timer.removeFrameLoop(fall_1);
                    }
                };
                ps.timer.frameLoop(fall_1);
                return;
            }
            this._tJump = Date.now();
            this._v = this._vyInit;
            this._fallFrameLoop = ps.timer.frameLoop(this.onFallTick.bind(this));
        };
        JumpSheep.prototype.onFallTick = function () {
            var isLeft = this._jumpViewScript.curBox.isLeft;
            var _a = this.gameObject, y = _a.y, x = _a.x;
            var delta = (Date.now() - this._tJump) / 1000;
            this._v += this._g * delta; // 速度变化
            y += this._v * delta; // 垂直方向位移变化
            x += (isLeft ? 1 : -1) * delta * this._vx; // 水平方向
            if (y >= this._petInitY) {
                this.removeFallTick();
            }
            this.gameObject.x = x;
            this.gameObject.y = y;
            this._tJump = Date.now();
        };
        JumpSheep.prototype.onJumpTick = function () {
            if (!this._jumpViewScript)
                return;
            var y = this.gameObject.y;
            var delta = (Date.now() - this._tJump) / 1000;
            this._v += this._g * delta;
            y += this._v * delta;
            this.gameObject.y = y;
            if (this._v > 0)
                this.onInitBox(y);
            this._tJump = Date.now();
        };
        // 检测是否落到原盒子
        JumpSheep.prototype.onInitBox = function (y) {
            var curBox = this._jumpViewScript.curBox;
            var isLeft = curBox.isLeft;
            // 落回原处
            if (this._initY - y < 10) {
                var boxW = curBox.gameObject.children[0].width >> 1;
                var boxX = curBox.gameObject.x;
                var boxLX = boxX - boxW;
                var boxRX = boxX + boxW;
                var petLX = this.gameObject.x -
                    this.gameObject.width / 2 +
                    this._nodeJumpSize.l;
                var petRX = this.gameObject.x +
                    this.gameObject.width / 2 -
                    this._nodeJumpSize.r;
                // 还没碰撞 落回原地
                if ((isLeft && boxRX < petLX) || (!isLeft && boxLX > petRX)) {
                    this._jumpViewScript.isJumping = false;
                    this.gameObject.y = this._initY;
                }
                else {
                    this._overJump = true;
                    this.gameFail();
                }
            }
        };
        JumpSheep.prototype.onIsJumping = function ($value) {
            this.removeJumpTick();
            this._nodeStand.alpha = !$value ? 1 : 0;
            this._nodeJump.alpha = $value ? 1 : 0;
            this._initY = this.gameObject.y;
            if ($value) {
                if (qc.Node.prototype["setPropertyIgnoreLayout"]) {
                    this.gameObject["setPropertyIgnoreLayout"]({ prop: "y" });
                    this.gameObject["setPropertyIgnoreLayout"]({ prop: "x" });
                }
                this._tJump = Date.now();
                this._v = this._vyInit;
                this._jumpFrameLoop = ps.timer.frameLoop(this.onJumpTick.bind(this));
            }
        };
        JumpSheep.prototype.removeFallTick = function () {
            if (this._fallFrameLoop) {
                ps.timer.removeFrameLoop(this._fallFrameLoop);
                this._fallFrameLoop = undefined;
            }
        };
        JumpSheep.prototype.removeJumpTick = function () {
            if (this._jumpFrameLoop) {
                ps.timer.removeFrameLoop(this._jumpFrameLoop);
                this._jumpFrameLoop = undefined;
            }
        };
        return JumpSheep;
    }(ps.Behaviour));
    ps.JumpSheep = JumpSheep;
    qc.registerBehaviour("ps.JumpSheep", JumpSheep);
    JumpSheep["__menu"] = "玩法模板/跳一跳玩法/角色组件（JumpSheep）";
})(ps || (ps = {}));
//# sourceMappingURL=JumpSheep.js.map