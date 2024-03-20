namespace ps {
    /**
     * @description
     * @author jingru.wu
     * @date 2023/03/16 14:42:05
     */
    export class JumpSheep extends Behaviour {
        Event = new ps.EventDispatcher();
        private _nodeStand: qc.Node;
        private _nodeJump: qc.Node;
        private _nodeDie: qc.Node;
        private _v = 0;
        private _g = 3800;
        private _vyInit = -1100; //像素每秒
        private _vx = 500; //像素每秒
        private _tJump = 0;
        private _jumpFrameLoop: Function;
        private _fallFrameLoop: Function;
        private _nodeJumpSize;
        private _nodeStandSize;
        private _initY: number;
        private _overJump = false;
        private _jumpView: qc.Node;
        private _jumpViewScript: JumpView;
        private _petInitY: number;

        /** 序列化 */
        private serializableFields = {
            _g: qc.Serializer.NUMBER,
            _vyInit: qc.Serializer.NUMBER,
            _vx: qc.Serializer.NUMBER,
            _nodeStand: qc.Serializer.NODE,
            _nodeJump: qc.Serializer.NODE,
            _nodeDie: qc.Serializer.NODE,
            _jumpView: qc.Serializer.NODE,
        };
        public createGui(): GuiType {
            return {
                _g: {
                    title: "重力",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _vyInit: {
                    title: "角色竖直方向的初始速度",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _vx: {
                    title: "角色被撞飞时水平方向的速度",
                    component: "input", // 数字控件
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
        }
        onInit() {
            this._jumpViewScript = this._jumpView.getScript("ps.JumpView");
            this._nodeDie.visible = true;
            this._nodeJump.visible = true;
            this._nodeJump.visible = true;
            this._nodeDie.alpha = 0;
            this._nodeJump.alpha = 0;
            this._petInitY = this.gameObject.y;
            // 注册事件
            const jumpScript = this._nodeJump.addScript("qc.Box2D.Body");
            jumpScript.onBodyCreated.add(() => {
                jumpScript.resetShapeFromEdge(3);
                jumpScript.type = 2;
                jumpScript.fixedRotation = false;
                jumpScript.sensor = true;
                jumpScript.gravityScale = 0;
                this._nodeJumpSize = ps.jumpUtils.getTrueBoxSize(
                    this._nodeJump
                );
            });
            const standScript = this._nodeStand.addScript("qc.Box2D.Body");
            standScript.onBodyCreated.add(() => {
                standScript.resetShapeFromEdge(3);
                standScript.type = 2;
                standScript.fixedRotation = false;
                standScript.sensor = true;
                standScript.gravityScale = 0;
                this._nodeStandSize = ps.jumpUtils.getTrueBoxSize(
                    this._nodeStand
                );
            });
            this._jumpViewScript.Event.add("jump", this.onIsJumping, this);
        }

        public get nodeJumpSize() {
            return this._nodeJumpSize;
        }

        public get nodeStandSize() {
            return this._nodeStandSize;
        }

        public gameFail() {
            this._jumpViewScript.gameEnd(false);
            this._nodeDie.alpha = 1;
            this._nodeStand.alpha = 0;
            this._nodeJump.alpha = 0;
            this.removeJumpTick();
            if (this._overJump) {
                const fall = () => {
                    let { y } = this.gameObject;
                    const delta = (Date.now() - this._tJump) / 1000;
                    this._v += this._g * delta;
                    y += this._v * delta;
                    this.gameObject.y = y;
                    this._tJump = Date.now();
                    if (y >= this._petInitY) {
                        timer.removeFrameLoop(fall);
                    }
                };
                timer.frameLoop(fall);
                return;
            }
            this._tJump = Date.now();
            this._v = this._vyInit;
            this._fallFrameLoop = timer.frameLoop(this.onFallTick.bind(this));
        }

        private onFallTick() {
            const { isLeft } = this._jumpViewScript.curBox;
            let { y, x } = this.gameObject;
            const delta = (Date.now() - this._tJump) / 1000;
            this._v += this._g * delta; // 速度变化
            y += this._v * delta; // 垂直方向位移变化
            x += (isLeft ? 1 : -1) * delta * this._vx; // 水平方向
            if (y >= this._petInitY) {
                this.removeFallTick();
            }
            this.gameObject.x = x;
            this.gameObject.y = y;

            this._tJump = Date.now();
        }

        private onJumpTick() {
            if (!this._jumpViewScript) return;
            let { y } = this.gameObject;
            const delta = (Date.now() - this._tJump) / 1000;
            this._v += this._g * delta;
            y += this._v * delta;
            this.gameObject.y = y;
            if (this._v > 0) this.onInitBox(y);
            this._tJump = Date.now();
        }

        // 检测是否落到原盒子
        private onInitBox(y: number) {
            const { curBox } = this._jumpViewScript;
            const { isLeft } = curBox;
            // 落回原处
            if (this._initY - y < 10) {
                const boxW = curBox.gameObject.children[0].width >> 1;
                const boxX = curBox.gameObject.x;
                const boxLX = boxX - boxW;
                const boxRX = boxX + boxW;
                const petLX =
                    this.gameObject.x -
                    this.gameObject.width / 2 +
                    this._nodeJumpSize.l;
                const petRX =
                    this.gameObject.x +
                    this.gameObject.width / 2 -
                    this._nodeJumpSize.r;
                // 还没碰撞 落回原地
                if ((isLeft && boxRX < petLX) || (!isLeft && boxLX > petRX)) {
                    this._jumpViewScript.isJumping = false;
                    this.gameObject.y = this._initY;
                } else {
                    this._overJump = true;
                    this.gameFail();
                }
            }
        }

        private onIsJumping($value: boolean) {
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
                this._jumpFrameLoop = timer.frameLoop(
                    this.onJumpTick.bind(this)
                );
            }
        }

        private removeFallTick() {
            if (this._fallFrameLoop) {
                timer.removeFrameLoop(this._fallFrameLoop);
                this._fallFrameLoop = undefined;
            }
        }

        private removeJumpTick() {
            if (this._jumpFrameLoop) {
                timer.removeFrameLoop(this._jumpFrameLoop);
                this._jumpFrameLoop = undefined;
            }
        }
    }

    qc.registerBehaviour("ps.JumpSheep", JumpSheep);
    JumpSheep["__menu"] = "玩法模板/跳一跳玩法/角色组件（JumpSheep）";
}
