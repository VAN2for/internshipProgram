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
     *
     * 华容道碎片块
     * @description 华容道碎片块
     * @author zhen.liang
     * @date 2022/12/31 15:16:24
     */
    var KlotskiPuzzl = /** @class */ (function (_super) {
        __extends(KlotskiPuzzl, _super);
        function KlotskiPuzzl(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 序列化 */
            _this.serializableFields = {
                controlNode: qc.Serializer.NODE,
                width: qc.Serializer.INT,
                height: qc.Serializer.INT,
                startX: qc.Serializer.INT,
                startY: qc.Serializer.INT,
                targetX: qc.Serializer.INT,
                targetY: qc.Serializer.INT,
                goodAudioName: qc.Serializer.STRING,
                waringAudioName: qc.Serializer.STRING,
                moveAudioName: qc.Serializer.STRING,
            };
            _this.moving = false;
            return _this;
        }
        KlotskiPuzzl.prototype.createGui = function () {
            return {
                controlNode: {
                    title: "控制器节点",
                    component: "node",
                },
                width: {
                    title: "宽度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                height: {
                    title: "高度",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                startX: {
                    title: "起始X坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                startY: {
                    title: "起始Y坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                targetX: {
                    title: "目标X坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                targetY: {
                    title: "目标Y坐标",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                goodAudioName: {
                    title: "正确时播放的音乐名称",
                    component: "input",
                },
                waringAudioName: {
                    title: "无法移动时播放的音乐名称",
                    component: "input",
                },
                moveAudioName: {
                    title: "移动时播放的音乐名称",
                    component: "input",
                },
            };
        };
        /** 试玩初始化的处理 */
        KlotskiPuzzl.prototype.onInit = function () {
            this.gameObject.interactive = true;
            this.KlotskControl = this.controlNode.getScript("ps.KlotskControl");
            this.KlotskControl.setPuzzleMap([this.startX, this.startY], this.gameObject, this.width, this.height);
            if (Number.isNaN(this.startY) || Number.isNaN(this.startX))
                console.warn("没有配置初始坐标");
            if (Number.isNaN(this.targetX))
                this.targetX = 0;
            if (Number.isNaN(this.targetY))
                this.targetY = 0;
            /** 添加震动组件 */
            this.shake = this.gameObject.addScript("ps.Shake");
        };
        KlotskiPuzzl.prototype.onUp = function (e) {
            if (this.moving)
                return;
            var moveXY = this.compulteToXY(e.source);
            if (this.searchCanMove(moveXY)) {
                this.move(moveXY);
            }
            else {
                this.shake.play(0.2);
                this.playSound(this.waringAudioName);
            }
        };
        /** 获取移动后的位置与目标位置差值 */
        KlotskiPuzzl.prototype.getTargetGap = function (endXY) {
            return (Math.abs(endXY[0] - this.targetX) +
                Math.abs(endXY[1] - this.targetY));
        };
        /** 查询目标位置是否可移动 */
        KlotskiPuzzl.prototype.searchCanMove = function (moveXY) {
            var offsetXY = [moveXY[0] - this.startX, moveXY[1] - this.startY];
            if (offsetXY[0] !== 0) {
                var offsetX = offsetXY[0] > 0 ? this.height - 1 : 0;
                for (var i = 0; i < this.width; i++)
                    if (!this.KlotskControl.searchPuzzleMap([
                        moveXY[0] + offsetX,
                        moveXY[1] + i,
                    ]))
                        return false;
            }
            else {
                var offsetY = offsetXY[1] > 0 ? this.width - 1 : 0;
                for (var i = 0; i < this.height; i++)
                    if (!this.KlotskControl.searchPuzzleMap([
                        moveXY[0] + i,
                        moveXY[1] + offsetY,
                    ]))
                        return false;
            }
            return true;
        };
        /** 移动 */
        KlotskiPuzzl.prototype.move = function (moveXY) {
            var _this = this;
            this.moving = true;
            this.KlotskControl.lock();
            var offsetXY = [moveXY[0] - this.startX, moveXY[1] - this.startY];
            this.playSound(this.moveAudioName);
            var nodeXt = ps.xtween(this.gameObject);
            nodeXt
                .to(0.1 * 1000, {
                x: this.gameObject.x +
                    offsetXY[1] * (this.gameObject.width / this.width),
                y: this.gameObject.y +
                    offsetXY[0] * (this.gameObject.height / this.height),
            })
                .call(function () {
                _this.KlotskControl.release();
                _this.moving = false;
                _this.KlotskControl.puzzleMove([_this.startX, _this.startY], moveXY, _this.gameObject, _this.width, _this.height);
                if (_this.startX === _this.targetX &&
                    _this.startY === _this.targetY)
                    _this.KlotskControl.decrease();
                if (moveXY[0] === _this.targetX &&
                    moveXY[1] === _this.targetY) {
                    _this.KlotskControl.addCorrectPuzzle();
                    _this.playSound(_this.goodAudioName);
                }
                _this.startX = moveXY[0];
                _this.startY = moveXY[1];
            });
            nodeXt.start();
        };
        /** 计算位移后XY */
        KlotskiPuzzl.prototype.compulteToXY = function (source) {
            var offsetX = source.x - source.startX, offsetY = source.y - source.startY;
            if (Math.abs(offsetX) < Math.abs(offsetY))
                return [
                    offsetY > 0 ? this.startX + 1 : this.startX - 1,
                    this.startY,
                ];
            return [
                this.startX,
                offsetX > 0 ? this.startY + 1 : this.startY - 1,
            ];
        };
        /** 播放音乐 */
        KlotskiPuzzl.prototype.playSound = function (soundName) {
            if (typeof soundName !== "string" || soundName.length < 1)
                return;
            ps.Audio.playSound(soundName);
        };
        return KlotskiPuzzl;
    }(ps.Behaviour));
    ps.KlotskiPuzzl = KlotskiPuzzl;
    qc.registerBehaviour("ps.KlotskiPuzzl", KlotskiPuzzl);
    KlotskiPuzzl["__menu"] = "玩法模板/华容道玩法/碎片组件(KlotskiPuzzl)";
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
//# sourceMappingURL=KlotskiPuzzle.js.map