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
    //发射空间
    var EmissionSpace;
    (function (EmissionSpace) {
        EmissionSpace[EmissionSpace["START"] = 0] = "START";
        EmissionSpace[EmissionSpace["END"] = 1] = "END";
        EmissionSpace[EmissionSpace["WORLD"] = 2] = "WORLD";
    })(EmissionSpace = ps.EmissionSpace || (ps.EmissionSpace = {}));
    /**
     * 移动的粒子事件参数
     * @param 移动的粒子事件参数类型 {@link MoveParticleEventParamType}
     */
    var MoveParticleEvent;
    (function (MoveParticleEvent) {
        /** 单个粒子创建完成 */
        MoveParticleEvent["onCreated"] = "onCreated";
        /** 单个粒子抵达目标 */
        MoveParticleEvent["onReachTarget"] = "onReachTarget";
        /** 所有粒子创建结束 */
        MoveParticleEvent["onCreatedEnd"] = "onCreatedEnd";
        /** 所有粒子抵达目标 */
        MoveParticleEvent["onReachTargetEnd"] = "onReachTargetEnd";
    })(MoveParticleEvent = ps.MoveParticleEvent || (ps.MoveParticleEvent = {}));
    /**
     * 移动的粒子组件
     * @description 创建粒子，移动到目标对象处
     * @author JingBin
     */
    var MoveParticle = /** @class */ (function (_super) {
        __extends(MoveParticle, _super);
        function MoveParticle(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.emissionSpace = EmissionSpace.START; //发射空间
            _this.life = 1000; //粒子生命值，<= 0 时，粒子一直创建不停止
            _this.lifeVar = 0; //粒子生命值，上下浮动值
            _this.endClear = false; //生命结束时，清除所有粒子
            _this.maxParticles = 0; //粒子最大数量
            _this.interval = 100; //粒子创建时间间隔
            _this.intervalVar = 0; //粒子创建时间间隔，上下浮动值
            _this.startDuration = 0; //粒子出生阶段持续时间
            _this.startDurationVar = 0; //粒子出生阶段持续时间，上下浮动值
            _this.wait = 0; //粒子出生后，等待启动粒子时间间隔
            _this.waitVar = 0; //粒子出生后，等待启动粒子时间间隔，上下浮动值
            _this.endDuration = 500; //粒子结束阶段持续时间
            _this.endDurationVar = 0; //粒子结束阶段持续时间，上下浮动值
            _this.startScale = 1; //粒子出生缩放值
            _this.startScaleVar = 0; //粒子出生缩放值，上下浮动值
            _this.endScale = 1; //粒子死亡缩放值
            _this.endScaleVar = 0; //粒子死亡缩放值，上下浮动值
            _this.startAlpha = 1; //粒子出生透明度
            _this.startAlphaVar = 0; //粒子出生透明度，上下浮动值
            _this.endAlpha = 1; //粒子死亡透明度
            _this.endAlphaVar = 0; //粒子死亡透明度，上下浮动值
            _this.startRotation = 0; //粒子出生角度值
            _this.startRotationVar = 0; //粒子出生角度值，上下浮动值
            _this.endRotation = 0; //粒子死亡角度值
            _this.endRotationVar = 0; //粒子死亡角度值，上下浮动值
            _this.endLife = true; //粒子生命结束
            _this.nodePool = []; //粒子节点池
            _this.currNodes = []; //当前场上的粒子
            /** 事件相关 */
            _this.event = new ps.EventDispatcher();
            _this.currLife = 0;
            /** 序列化 */
            _this.serializableFields = {
                textures: qc.Serializer.TEXTURES,
                target: qc.Serializer.NODE,
                emissionSpace: qc.Serializer.AUTO,
                life: qc.Serializer.NUMBER,
                lifeVar: qc.Serializer.NUMBER,
                endClear: qc.Serializer.BOOLEAN,
                maxParticles: qc.Serializer.NUMBER,
                interval: qc.Serializer.NUMBER,
                intervalVar: qc.Serializer.NUMBER,
                startDuration: qc.Serializer.NUMBER,
                startDurationVar: qc.Serializer.NUMBER,
                wait: qc.Serializer.NUMBER,
                waitVar: qc.Serializer.NUMBER,
                endDuration: qc.Serializer.NUMBER,
                endDurationVar: qc.Serializer.NUMBER,
                startPointVar: qc.Serializer.POINT,
                endPointVar: qc.Serializer.POINT,
                startScale: qc.Serializer.NUMBER,
                startScaleVar: qc.Serializer.NUMBER,
                endScale: qc.Serializer.NUMBER,
                endScaleVar: qc.Serializer.NUMBER,
                startAlpha: qc.Serializer.NUMBER,
                startAlphaVar: qc.Serializer.NUMBER,
                endAlpha: qc.Serializer.NUMBER,
                endAlphaVar: qc.Serializer.NUMBER,
                startRotation: qc.Serializer.NUMBER,
                startRotationVar: qc.Serializer.NUMBER,
                endRotation: qc.Serializer.NUMBER,
                endRotationVar: qc.Serializer.NUMBER,
            };
            _this.runInEditor = true;
            return _this;
        }
        MoveParticle.prototype.awake = function () {
            var _this = this;
            this.nodePool = this.nodePool.concat(this.gameObject.children);
            this.gameObject.removeChildren();
            //粒子生命值
            var life = this.life;
            if (life > 0 && this.lifeVar !== 0) {
                var lifeVar = ps.Random.round(-this.lifeVar, this.lifeVar);
                var sum = life + lifeVar;
                if (sum > 0) {
                    life = sum;
                }
            }
            this.currLife = life;
            if (this.endLifeTime) {
                ps.timer.remove(this.endLifeTime);
            }
            if (this.currLife > 0) {
                this.endLifeTime = ps.timer.once(this.currLife, function () { return _this.endLife = true; });
            }
            var _loop_1 = function (i, delay) {
                //粒子创建时间间隔
                ps.timer.once(delay, function () {
                    var isLastPart = i >= _this.maxParticles - 1;
                    _this.createNode(isLastPart);
                    if (isLastPart) {
                        _this.event.dispatch(MoveParticleEvent.onCreatedEnd, { script: _this });
                    }
                }, this_1);
                var interval = this_1.interval + ps.Random.round(-this_1.intervalVar, this_1.intervalVar);
                delay += interval;
                out_delay_1 = delay;
            };
            var this_1 = this, out_delay_1;
            for (var i = 0, delay = 0; i < this.maxParticles; i++) {
                _loop_1(i, delay);
                delay = out_delay_1;
            }
        };
        MoveParticle.prototype.refresh = function () {
            this.destroyAllNode();
            this.endLife = false;
            this.lastCreateTime = null;
            this.nodePool = [];
            this.currNodes = [];
            this.awake();
            this.enable = true;
        };
        MoveParticle.prototype.update = function () {
            if (this.endLife) {
                this.event.dispatch(MoveParticleEvent.onCreatedEnd, { script: this });
                this.event.dispatch(MoveParticleEvent.onReachTargetEnd, { script: this });
                if (this.endClear) {
                    this.destroyAllNode();
                }
                this.enable = false;
                return;
            }
            if (this.maxParticles <= 0) {
                var currTime = this.game.time.now;
                //粒子创建时间间隔
                var interval = this.interval +
                    ps.Random.round(-this.intervalVar, this.intervalVar);
                if (this.lastCreateTime != void 0) {
                    if (currTime - this.lastCreateTime < interval) {
                        return;
                    }
                }
                this.lastCreateTime = currTime;
                this.createNode();
            }
        };
        MoveParticle.prototype.createGui = function () {
            return {
                textures: {
                    title: "纹理，创建粒子使用的纹理",
                },
                target: {
                    title: "目标节点，控制粒子去向的默认位置",
                },
                emissionSpace: {
                    title: "发射空间",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: EmissionSpace.START,
                                label: "起始目标处"
                            },
                            {
                                value: EmissionSpace.END,
                                label: "结束目标处"
                            },
                            {
                                value: EmissionSpace.WORLD,
                                label: "世界"
                            }
                        ],
                        placeholder: "粒子的发射空间"
                    }
                },
                life: {
                    title: "粒子生命值，<= 0 时，粒子一直创建不停止",
                },
                lifeVar: {
                    title: "粒子生命值，上下浮动值",
                },
                endClear: {
                    title: "生命结束时，清除所有粒子",
                },
                maxParticles: {
                    title: "粒子最大数量",
                },
                interval: {
                    title: "粒子创建时间间隔",
                },
                intervalVar: {
                    title: "粒子创建时间间隔，上下浮动值",
                },
                startDuration: {
                    title: "粒子出生阶段持续时间",
                },
                startDurationVar: {
                    title: "粒子出生阶段持续时间，上下浮动值",
                },
                wait: {
                    title: "粒子出生后，等待启动粒子时间间隔",
                },
                waitVar: {
                    title: "粒子出生后，等待启动粒子时间间隔，上下浮动值",
                },
                endDuration: {
                    title: "粒子结束阶段持续时间",
                },
                endDurationVar: {
                    title: "粒子结束阶段持续时间，上下浮动值",
                },
                startPointVar: {
                    title: "粒子出生位置，上下浮动值",
                },
                endPointVar: {
                    title: "粒子死亡位置，上下浮动值",
                },
                startScale: {
                    title: "粒子出生缩放值",
                },
                startScaleVar: {
                    title: "粒子出生缩放值，上下浮动值",
                },
                endScale: {
                    title: "粒子死亡缩放值",
                },
                endScaleVar: {
                    title: "粒子死亡缩放值，上下浮动值",
                },
                startAlpha: {
                    title: "粒子出生透明度",
                },
                startAlphaVar: {
                    title: "粒子出生透明度，上下浮动值",
                },
                endAlpha: {
                    title: "粒子死亡透明度",
                },
                endAlphaVar: {
                    title: "粒子死亡透明度，上下浮动值",
                },
                startRotation: {
                    title: "粒子出生角度值",
                },
                startRotationVar: {
                    title: "粒子出生角度值，上下浮动值",
                },
                endRotation: {
                    title: "粒子死亡角度值",
                },
                endRotationVar: {
                    title: "粒子死亡角度值，上下浮动值",
                },
            };
        };
        /** 创建粒子 */
        MoveParticle.prototype.createNode = function (isLastPart) {
            if (isLastPart === void 0) { isLastPart = false; }
            if (this.endLife) {
                return;
            }
            //初始化粒子
            var node = this.nodePool.length > 0 ? this.nodePool.shift() : new qc.UIImage(this.game);
            node.pivotX = .5;
            node.pivotY = .5;
            node.texture = ps.Random.getElement(this.textures);
            node.resetNativeSize();
            this.currNodes.push(node);
            //粒子出生位置
            // let point = new qc.Point(this.gameObject.width / 2, this.gameObject.height / 2);
            var point = new qc.Point(0, 0);
            switch (this.emissionSpace) {
                //结束目标处
                case EmissionSpace.END:
                    this.target.addChild(node);
                    point = this.target.toLocal(this.gameObject.toGlobal(point));
                    break;
                //世界
                case EmissionSpace.WORLD:
                    qc_game.world.addChild(node);
                    point = this.gameObject.toGlobal(point);
                    break;
                //起始目标处
                default:
                    this.gameObject.addChild(node);
                    break;
            }
            node.x = point.x;
            node.y = point.y;
            if (this.startPointVar) {
                point.x += ps.Random.round(-this.startPointVar.x, this.startPointVar.x);
                point.y += ps.Random.round(-this.startPointVar.y, this.startPointVar.y);
            }
            //粒子出生缩放值
            var scale = this.startScale;
            node.scaleX = node.scaleY = scale;
            if (this.startScaleVar != void 0) {
                scale += ps.Random.range(-this.startScaleVar, this.startScaleVar);
            }
            //粒子出生透明度
            var alpha = this.startAlpha;
            node.alpha = alpha;
            if (this.startAlphaVar != void 0) {
                alpha += ps.Random.range(-this.startAlphaVar, this.startAlphaVar);
            }
            //粒子出生角度值
            var rotation = this.startRotation;
            node.rotation = rotation;
            if (this.startRotationVar != void 0) {
                rotation += ps.Random.range(-this.startRotationVar, this.startRotationVar);
            }
            //粒子出生阶段持续时间
            var duration = this.startDuration +
                ps.Random.round(-this.startDurationVar, this.startDurationVar);
            if (duration > 0) {
                node["moveTw0"] = ps.Tween.to(node, { x: point.x, y: point.y, scale: scale, alpha: alpha, rotation: rotation }, duration, void 0, void 0, false);
                node["moveTw0"].onComplete.addOnce(this.startNode, this, void 0, isLastPart);
                node["moveTw0"].start();
            }
            else {
                node.x = point.x;
                node.y = point.y;
                node.scaleX = node.scaleY = scale;
                node.alpha = alpha;
                node.rotation = rotation;
                this.startNode(node, null, isLastPart);
            }
            this.event.dispatch(MoveParticleEvent.onCreated, { script: this, node: node });
        };
        /** 启动粒子 */
        MoveParticle.prototype.startNode = function (target, tween, isLastPart) {
            if (isLastPart === void 0) { isLastPart = false; }
            if (this.endLife) {
                return;
            }
            if (!target || !target.parent) {
                return;
            }
            //粒子死亡位置
            var point = this.target.getWorldPosition();
            point = target.parent.toLocal(point);
            if (this.endPointVar) {
                point.x += ps.Random.round(-this.endPointVar.x, this.endPointVar.x);
                point.y += ps.Random.round(-this.endPointVar.y, this.endPointVar.y);
            }
            //粒子结束阶段持续时间
            var duration = this.endDuration +
                ps.Random.round(-this.endDurationVar, this.endDurationVar);
            //粒子死亡缩放值
            var scale = this.endScale;
            if (this.endScaleVar != void 0) {
                scale += ps.Random.range(-this.endScaleVar, this.endScaleVar);
            }
            //粒子死亡透明度
            var alpha = this.endAlpha;
            if (this.endAlphaVar != void 0) {
                alpha += ps.Random.range(-this.endAlphaVar, this.endAlphaVar);
            }
            //粒子死亡角度
            var rotation = this.endRotation;
            if (this.endRotationVar != void 0) {
                rotation += ps.Random.range(-this.endRotationVar, this.endRotationVar);
            }
            //粒子出生后，等待启动粒子时间间隔
            var wait = this.wait + ps.Random.round(-this.waitVar, this.waitVar);
            //开始移动
            target["moveTw1"] = ps.Tween.to(target, { x: point.x }, duration, void 0, wait, true);
            target["moveTw2"] = ps.Tween.to(target, { y: point.y, scale: scale, alpha: alpha, rotation: rotation }, duration, void 0, wait, false);
            target["moveTw2"].onComplete.addOnce(this.removeNode, this, void 0, isLastPart);
            target["moveTw2"].start();
        };
        /** 移除粒子 */
        MoveParticle.prototype.removeNode = function (target, tween, isLastPart) {
            if (isLastPart === void 0) { isLastPart = false; }
            this.event.dispatch(MoveParticleEvent.onReachTarget, { script: this, node: target });
            if (isLastPart) {
                this.event.dispatch(MoveParticleEvent.onReachTargetEnd, { script: this });
            }
            if (target["moveTw0"]) {
                ps.Tween.clear(target["moveTw0"]);
                target["moveTw0"].onComplete.remove(this.startNode, this);
                target["moveTw0"].stop();
            }
            if (target["moveTw1"]) {
                ps.Tween.clear(target["moveTw1"]);
            }
            if (target["moveTw2"]) {
                ps.Tween.clear(target["moveTw2"]);
                target["moveTw2"].onComplete.remove(this.removeNode, this);
                target["moveTw2"].stop();
            }
            target.removeSelf();
            this.nodePool.push(target);
        };
        /** 销毁所有粒子 */
        MoveParticle.prototype.destroyAllNode = function () {
            var _this = this;
            var _a, _b;
            this.gameObject.removeChildren();
            (_a = this.currNodes) === null || _a === void 0 ? void 0 : _a.forEach(function (node) {
                if (node["moveTw0"]) {
                    ps.Tween.clear(node["moveTw0"]);
                    node["moveTw0"].onComplete.remove(_this.startNode, _this);
                    node["moveTw0"].stop();
                }
                if (node["moveTw1"]) {
                    ps.Tween.clear(node["moveTw1"]);
                }
                if (node["moveTw2"]) {
                    ps.Tween.clear(node["moveTw2"]);
                    node["moveTw2"].onComplete.remove(_this.removeNode, _this);
                    node["moveTw2"].stop();
                }
                node.destroy();
            });
            this.currNodes = null;
            (_b = this.nodePool) === null || _b === void 0 ? void 0 : _b.forEach(function (node) { return node.destroy(); });
            this.nodePool = null;
        };
        return MoveParticle;
    }(ps.Behaviour));
    ps.MoveParticle = MoveParticle;
    qc.registerBehaviour('ps.MoveParticle', MoveParticle);
    MoveParticle["__menu"] = '玩法模板/玩法组件/移动的粒子（MoveParticle）';
})(ps || (ps = {}));
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
*/
//# sourceMappingURL=MoveParticle.js.map