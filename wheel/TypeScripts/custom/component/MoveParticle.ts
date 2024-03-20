namespace ps {
    //发射空间
    export enum EmissionSpace {
        START = 0, //起始目标处
        END = 1, //结束目标处
        WORLD = 2, //世界
    }

    /**
     * 移动的粒子事件参数
     * @param 移动的粒子事件参数类型 {@link MoveParticleEventParamType}
     */
    export enum MoveParticleEvent {
        /** 单个粒子创建完成 */
        onCreated = "onCreated",
        /** 单个粒子抵达目标 */
        onReachTarget = "onReachTarget",
        /** 所有粒子创建结束 */
        onCreatedEnd = "onCreatedEnd",
        /** 所有粒子抵达目标 */
        onReachTargetEnd = "onReachTargetEnd",
    }

    /** 移动的粒子事件参数类型 */
    export type MoveParticleEventParamType = {
        /** 当前脚本 */
        script: MoveParticle,
        /** 单个粒子节点 */
        node?: qc.UIImage,
    };

    /**
     * 移动的粒子组件
     * @description 创建粒子，移动到目标对象处
     * @author JingBin
     */
    export class MoveParticle extends Behaviour {
        textures: qc.Texture[]; //纹理，创建粒子使用的纹理
        target: qc.Node; //目标节点，控制粒子去向的默认位置
        emissionSpace: EmissionSpace = EmissionSpace.START; //发射空间

        life = 1000; //粒子生命值，<= 0 时，粒子一直创建不停止
        lifeVar = 0; //粒子生命值，上下浮动值
        endClear = false; //生命结束时，清除所有粒子
        maxParticles = 0; //粒子最大数量

        interval = 100; //粒子创建时间间隔
        intervalVar = 0; //粒子创建时间间隔，上下浮动值

        startDuration = 0; //粒子出生阶段持续时间
        startDurationVar = 0; //粒子出生阶段持续时间，上下浮动值

        wait = 0; //粒子出生后，等待启动粒子时间间隔
        waitVar = 0; //粒子出生后，等待启动粒子时间间隔，上下浮动值

        endDuration = 500; //粒子结束阶段持续时间
        endDurationVar = 0; //粒子结束阶段持续时间，上下浮动值

        startPointVar: qc.Point; //粒子出生位置，上下浮动值
        endPointVar: qc.Point; //粒子死亡位置，上下浮动值

        startScale = 1; //粒子出生缩放值
        startScaleVar = 0; //粒子出生缩放值，上下浮动值
        endScale = 1; //粒子死亡缩放值
        endScaleVar = 0; //粒子死亡缩放值，上下浮动值

        startAlpha = 1; //粒子出生透明度
        startAlphaVar = 0; //粒子出生透明度，上下浮动值
        endAlpha = 1; //粒子死亡透明度
        endAlphaVar = 0; //粒子死亡透明度，上下浮动值

        startRotation = 0; //粒子出生角度值
        startRotationVar = 0; //粒子出生角度值，上下浮动值
        endRotation = 0; //粒子死亡角度值
        endRotationVar = 0; //粒子死亡角度值，上下浮动值

        private endLife = true; //粒子生命结束
        private endLifeTime: qc.TimerEvent; //粒子生命结束延迟对象
        private lastCreateTime: number; //上一次创建粒子时间戳
        private nodePool: qc.UIImage[] = []; //粒子节点池
        private currNodes: qc.UIImage[] = []; //当前场上的粒子

        /** 事件相关 */
        public event: EventDispatcher = new EventDispatcher();

        currLife = 0;

        /** 序列化 */
        private serializableFields = {
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

        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.runInEditor = true;
        }

        awake() {
            this.nodePool = this.nodePool.concat(
                this.gameObject.children as qc.UIImage[]
            );
            this.gameObject.removeChildren();

            //粒子生命值
            let life = this.life;
            if (life > 0 && this.lifeVar !== 0) {
                const lifeVar = Random.round(-this.lifeVar, this.lifeVar);
                const sum = life + lifeVar;
                if (sum > 0) {
                    life = sum;
                }
            }
            this.currLife = life;
            if (this.endLifeTime) {
                timer.remove(this.endLifeTime);
            }
            if (this.currLife > 0) {
                this.endLifeTime = timer.once(this.currLife, () => this.endLife = true);
            }
            for (let i = 0, delay = 0; i < this.maxParticles; i++) {
                //粒子创建时间间隔
                timer.once(delay, () => {
                    const isLastPart = i >= this.maxParticles - 1;
                    this.createNode(isLastPart);
                    if (isLastPart) {
                        this.event.dispatch(MoveParticleEvent.onCreatedEnd, { script: this });
                    }
                }, this);
                const interval = this.interval + Random.round(-this.intervalVar, this.intervalVar);
                delay += interval;
            }
        }

        refresh() {
            this.destroyAllNode();
            this.endLife = false;
            this.lastCreateTime = null;
            this.nodePool = [];
            this.currNodes = [];
            this.awake();
            this.enable = true;
        }

        update() {
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
                const currTime = this.game.time.now;
                //粒子创建时间间隔
                const interval =
                    this.interval +
                    Random.round(-this.intervalVar, this.intervalVar);
                if (this.lastCreateTime != void 0) {
                    if (currTime - this.lastCreateTime < interval) {
                        return;
                    }
                }
                this.lastCreateTime = currTime;
                this.createNode();
            }
        }

        public createGui(): GuiType {
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
        }

        /** 创建粒子 */
        private createNode(isLastPart = false) {
            if (this.endLife) {
                return;
            }

            //初始化粒子
            const node = this.nodePool.length > 0 ? this.nodePool.shift() : new qc.UIImage(this.game);
            node.pivotX = .5;
            node.pivotY = .5;
            node.texture = Random.getElement(this.textures);
            node.resetNativeSize();

            this.currNodes.push(node);

            //粒子出生位置
            // let point = new qc.Point(this.gameObject.width / 2, this.gameObject.height / 2);
            let point = new qc.Point(0, 0);
            switch (this.emissionSpace) {
                //结束目标处
                case EmissionSpace.END:
                    this.target.addChild(node)
                    point = this.target.toLocal(this.gameObject.toGlobal(point));
                    break;
                //世界
                case EmissionSpace.WORLD:
                    qc_game.world.addChild(node)
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
                point.x += Random.round(
                    -this.startPointVar.x,
                    this.startPointVar.x
                );
                point.y += Random.round(
                    -this.startPointVar.y,
                    this.startPointVar.y
                );
            }

            //粒子出生缩放值
            let scale = this.startScale;
            node.scaleX = node.scaleY = scale;
            if (this.startScaleVar != void 0) {
                scale += Random.range(-this.startScaleVar, this.startScaleVar);
            }

            //粒子出生透明度
            let alpha = this.startAlpha;
            node.alpha = alpha;
            if (this.startAlphaVar != void 0) {
                alpha += Random.range(-this.startAlphaVar, this.startAlphaVar);
            }

            //粒子出生角度值
            let rotation = this.startRotation;
            node.rotation = rotation;
            if (this.startRotationVar != void 0) {
                rotation += Random.range(
                    -this.startRotationVar,
                    this.startRotationVar
                );
            }

            //粒子出生阶段持续时间
            const duration =
                this.startDuration +
                Random.round(-this.startDurationVar, this.startDurationVar);

            if (duration > 0) {
                node["moveTw0"] = Tween.to(node, { x: point.x, y: point.y, scale, alpha, rotation }, duration, void 0, void 0, false);
                node["moveTw0"].onComplete.addOnce(this.startNode, this, void 0, isLastPart);
                node["moveTw0"].start();
            } else {
                node.x = point.x;
                node.y = point.y;
                node.scaleX = node.scaleY = scale;
                node.alpha = alpha;
                node.rotation = rotation;
                this.startNode(node, null, isLastPart);
            }
            this.event.dispatch(MoveParticleEvent.onCreated, { script: this, node });
        }

        /** 启动粒子 */
        private startNode(target: qc.UIImage, tween: Phaser.Tween, isLastPart = false) {
            if (this.endLife) {
                return;
            }

            if (!target || !target.parent) {
                return;
            }

            //粒子死亡位置
            let point = this.target.getWorldPosition();
            point = target.parent.toLocal(point);
            if (this.endPointVar) {
                point.x += Random.round(
                    -this.endPointVar.x,
                    this.endPointVar.x
                );
                point.y += Random.round(
                    -this.endPointVar.y,
                    this.endPointVar.y
                );
            }

            //粒子结束阶段持续时间
            const duration =
                this.endDuration +
                Random.round(-this.endDurationVar, this.endDurationVar);

            //粒子死亡缩放值
            let scale = this.endScale;
            if (this.endScaleVar != void 0) {
                scale += Random.range(-this.endScaleVar, this.endScaleVar);
            }

            //粒子死亡透明度
            let alpha = this.endAlpha;
            if (this.endAlphaVar != void 0) {
                alpha += Random.range(-this.endAlphaVar, this.endAlphaVar);
            }

            //粒子死亡角度
            let rotation = this.endRotation;
            if (this.endRotationVar != void 0) {
                rotation += Random.range(
                    -this.endRotationVar,
                    this.endRotationVar
                );
            }

            //粒子出生后，等待启动粒子时间间隔
            const wait = this.wait + Random.round(-this.waitVar, this.waitVar);

            //开始移动
            target["moveTw1"] = Tween.to(target, { x: point.x }, duration, void 0, wait, true);
            target["moveTw2"] = Tween.to(target, { y: point.y, scale, alpha, rotation }, duration, void 0, wait, false);
            target["moveTw2"].onComplete.addOnce(this.removeNode, this, void 0, isLastPart);
            target["moveTw2"].start();
        }

        /** 移除粒子 */
        private removeNode(target: qc.UIImage, tween: Phaser.Tween, isLastPart = false) {
            this.event.dispatch(MoveParticleEvent.onReachTarget, { script: this, node: target });
            if (isLastPart) {
                this.event.dispatch(MoveParticleEvent.onReachTargetEnd, { script: this });
            }
            if (target["moveTw0"]) {
                Tween.clear(target["moveTw0"]);
                target["moveTw0"].onComplete.remove(this.startNode, this);
                target["moveTw0"].stop();
            }
            if (target["moveTw1"]) {
                Tween.clear(target["moveTw1"]);
            }
            if (target["moveTw2"]) {
                Tween.clear(target["moveTw2"]);
                target["moveTw2"].onComplete.remove(this.removeNode, this);
                target["moveTw2"].stop();
            }
            target.removeSelf();
            this.nodePool.push(target);
        }

        /** 销毁所有粒子 */
        private destroyAllNode() {
            this.gameObject.removeChildren();
            this.currNodes?.forEach((node) => {
                if (node["moveTw0"]) {
                    Tween.clear(node["moveTw0"]);
                    node["moveTw0"].onComplete.remove(this.startNode, this);
                    node["moveTw0"].stop();
                }
                if (node["moveTw1"]) {
                    Tween.clear(node["moveTw1"]);
                }
                if (node["moveTw2"]) {
                    Tween.clear(node["moveTw2"]);
                    node["moveTw2"].onComplete.remove(this.removeNode, this);
                    node["moveTw2"].stop();
                }
                node.destroy();
            });
            this.currNodes = null;
            this.nodePool?.forEach(node => node.destroy());
            this.nodePool = null;
        }
    }
    qc.registerBehaviour('ps.MoveParticle', MoveParticle);
    MoveParticle["__menu"] = '玩法模板/玩法组件/移动的粒子（MoveParticle）';
}
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
