namespace ps {
    export enum WalkEvent {
        WalkStop = "walkStop",
        ChangeSpeedMutiple = "changeSpeedMutiple",
    }

    /**
     *
     * @description
     * @author bin
     * @date 2022/12/19 16:32:36
     */
    export class Walk extends Behaviour {
        Event = new ps.EventDispatcher();
        /** 面朝前的npc */
        private frontNpc: qc.Node;
        /** 面朝左的npc */
        private leftNpc: qc.Node;
        /** 每段移动的目标节点 */
        private paths: qc.Node[];
        /** 移动到目标节点后的npc朝向 */
        private transfrom: string[];
        /** 移动到目标节点后的npc放入新的父节点层级下 */
        private Tiers: qc.Node[];
        /** npc在新父节点下的插入顺序 */
        private tiersChildIndex: number[];
        /** 移动速度(像素/秒) */
        private speed: number;
        /** 移动速度倍数 */
        private speedMultiple: number = 1;
        /** 需要在路径中某个节点停止的tag(index) */
        private stopTags: number[];
        /** 每段路线移动时间 */
        private moveTimes: number[];
        /** 移动总序列 */
        private timeline: gsap.core.Timeline;
        constructor(gameObject: qc.Node) {
            super(gameObject);
            /** 序列化拓展 */
        }

        /** 序列化 */
        private serializableFields = {
            paths: qc.Serializer.NODES,
            transfrom: qc.Serializer.STRINGS,
            Tiers: qc.Serializer.NODES,
            tiersChildIndex: qc.Serializer.NUMBERS,
            stopTags: qc.Serializer.NUMBERS,
            frontNpc: qc.Serializer.NODE,
            leftNpc: qc.Serializer.NODE,
            speed: qc.Serializer.NUMBER,
        };
        public createGui(): GuiType {
            return {
                speed: {
                    title: "移动速度(像素/秒)",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                frontNpc: {
                    title: "面朝前的npc节点",
                    component: "node",
                },
                leftNpc: {
                    title: "面朝左的npc节点",
                    component: "node",
                },
                paths: {
                    title: "移动中每一段路的目标节点",
                    component: "nodes",
                },
                transfrom: {
                    title: "npc移动到目标节点后的朝向",
                    component: "nodes",
                },
                Tiers: {
                    title: "npc移动到目标节点后的父节点",
                    component: "nodes",
                },
                tiersChildIndex: {
                    title: "npc在新父节点下的插入顺序",
                    component: "nodes",
                },
                stopTags: {
                    title: "路径中的停止的标志",
                    component: "nodes",
                },
            };
        }
        /**
         *  添加组件的路径相关信息
         * @param frontNpc 面朝前的npc
         * @param leftNpc 面朝左的npc
         * @param paths 每段移动的目标节点
         * @param transfrom 移动到目标节点后的npc朝向
         * @param Tiers 移动到目标节点后的npc放入新的父节点层级下
         * @param tiersChildIndex npc在新父节点下的插入顺序
         * @param speed 移动速度
         * @param stopTags 需要在路径中某个节点停止的tag(index)
         */
        public setPathInfo(
            frontNpc: qc.Node,
            leftNpc: qc.Node,
            paths: qc.Node[],
            transfrom: string[],
            Tiers: qc.Node[],
            tiersChildIndex: number[],
            speed: number,
            stopTags: number[]
        ) {
            this.frontNpc = frontNpc;
            this.leftNpc = leftNpc;
            this.paths = paths;
            this.transfrom = transfrom;
            this.Tiers = Tiers;
            this.tiersChildIndex = tiersChildIndex;
            this.speed = speed;
            this.stopTags = stopTags;
        }

        /** 试玩初始化的处理 */
        public onInit() {
            this.timeline = gsap.timeline({
                paused: true,
            });
            this.gameObject.visible = false;
        }

        /** 修改速度倍数 */
        public setSpeedMultiple(speedMultiple: number) {
            if (Number.isNaN(speedMultiple)) {
                console.warn("speedMultiple is not a Number");
                return;
            }
            this.speedMultiple = speedMultiple;
            this.timeline.timeScale(speedMultiple);
        }

        /** 开始移动 */
        public startTL() {
            this.moveTimes = this.computeAllMoveTime();
            this.initWalkTl();
            this.gameObject.visible = true;
            this.timeline.restart();
        }

        /** 继续移动 */
        public playTL() {
            this.addWalkTl(this.nowIndex);
            this.timeline.play();
        }

        /** 停止移动tagIndex */
        private stopTagsIndex = 0;

        /** 目前移动序列的目标节点Index */
        private nowIndex = 0;

        /** 构造初始移动序列 */
        private initWalkTl() {
            if (this.paths.length < 1) {
                console.warn("没有传入路径的目标节点");
                return;
            }
            /** 移动序列 */
            const moveTl = gsap.timeline();
            const startXY = this.gameObject.parent.toLocal(
                this.paths[0].getWorldPosition()
            );
            moveTl.set(this.gameObject, { x: startXY.x, y: startXY.y });
            this.timeline.add(moveTl);
            this.addWalkTl(++this.nowIndex);
        }

        /** 添加移动序列 */
        private addWalkTl(index: number) {
            if (this.paths.length <= index) return;
            /** 移动序列 */
            const moveTl = gsap.timeline({
                defaults: { ease: Linear.easeNone },
            });
            let parentNode = this.gameObject.parent;
            for (let i = index; i < this.paths.length; i++) {
                const stopTags = i === this.stopTags[this.stopTagsIndex];
                this.movePath(
                    moveTl,
                    i,
                    this.moveTimes[i],
                    parentNode,
                    stopTags
                );
                this.nowIndex++;
                if (this.Tiers[i]) parentNode = this.Tiers[i];
                if (stopTags) {
                    this.stopTagsIndex++;
                    break;
                }
            }
            this.timeline.add(moveTl);
        }

        /** 移动其中一段路 */
        private movePath(
            moveTl: gsap.core.Timeline,
            index: number,
            moveTime: number,
            parentNode: qc.Node,
            stopTags: boolean = false
        ) {
            /** 目标点坐标 */
            const endNode = parentNode.toLocal(
                this.paths[index].getWorldPosition()
            );
            moveTl
                .to(this.gameObject, {
                    x: endNode.x,
                    y: endNode.y,
                    duration: moveTime / 1000,
                })
                .call(() => {
                    /** 是否需要改变npc的朝向 */
                    if (this.transfromFn[this.transfrom[index]])
                        this.transfromFn[this.transfrom[index]].call(this);
                    /** 是否需要修改节点层级 */
                    if (this.Tiers[index]) {
                        const npcXY = this.gameObject.getWorldPosition();
                        this.gameObject.parent.removeChild(this.gameObject);
                        const parentNode = this.Tiers[index];
                        parentNode.addChild(this.gameObject);
                        this.gameObject.x = parentNode.toLocal(npcXY).x;
                        this.gameObject.y = parentNode.toLocal(npcXY).y;
                        /** 修改层级后在新父节点下的位置 */
                        const childIndex = this.tiersChildIndex[index];
                        if (typeof childIndex === "number")
                            parentNode.setChildIndex(
                                this.gameObject,
                                childIndex
                            );
                    }
                    /** 到达该目标点后是否需要暂停移动 */
                    if (stopTags) {
                        this.timeline.pause();
                        this.Event.dispatch(WalkEvent.WalkStop, {
                            index,
                            targetName: this.paths[index].name,
                            npc: this.gameObject,
                        });
                    }
                });
        }

        /** 计算每段移动时长 */
        private computeAllMoveTime() {
            let startNode = this.gameObject;
            const mvTimes = new Array(this.paths.length);
            for (let i = 0; i < this.paths.length; i++) {
                const targetNode = this.paths[i];
                const mvTime = this.computeMoveTimeXY(
                    this.gameObject.parent.toLocal(
                        startNode.getWorldPosition()
                    ),
                    this.gameObject.parent.toLocal(
                        targetNode.getWorldPosition()
                    )
                );
                mvTimes[i] = mvTime;
                startNode = targetNode;
            }
            return mvTimes;
        }

        /** 计算移动时间 */
        private computeMoveTimeXY(startXY: qc.Point, endXY: qc.Point) {
            const speed = this.speed * this.speedMultiple;
            const moveLen = ps.Mathf.getDistance(
                startXY.x,
                startXY.y,
                endXY.x,
                endXY.y
            );
            return Math.max(Math.floor((moveLen / speed) * 1000), 100);
        }

        /** 对应转身函数 */
        private transfromFn = {
            left: function transformLeft() {
                /** npc转身向左 */
                this.leftNpc.scaleX = 1;
                this.leftNpc.visible = true;
                this.frontNpc.visible = false;
            },
            right: function transformRight() {
                /** npc转身向右  */
                this.frontNpc.scaleX = -1;
                this.frontNpc.visible = true;
                this.leftNpc.visible = false;
            },
            front: function transformFront() {
                /** npc转身向前 */
                this.frontNpc.scaleX = 1;
                this.frontNpc.visible = true;
                this.leftNpc.visible = false;
            },
            back: function transformBack() {
                /** npc转身向后 */
                this.leftNpc.scaleX = -1;
                this.leftNpc.visible = true;
                this.frontNpc.visible = false;
            },
        };
    }
    qc.registerBehaviour("ps.Walk", Walk);
    Walk["__menu"] = "玩法模板/经营玩法/人物移动（Walk）";
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
}
