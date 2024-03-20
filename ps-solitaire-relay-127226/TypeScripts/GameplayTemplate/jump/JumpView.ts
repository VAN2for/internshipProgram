namespace ps {
    /**
     *
     * @description
     * @author jingru.wu
     * @date 2023/03/16 15:03:07
     */
    export enum GEvent {
        /** 游戏成功 */
        gameSuccess,
        /** 游戏失败 */
        gameDefeat,
        /** 有效点击
         * @var times 点击次数
         */
        vaildDown,
        /** 第一个盒子到达指定位置
         * @var box 第一个盒子的JumpBox脚本
         */
        firstBoxArrive,
        /** 完整合并反馈
         * @var preBox 完整合并的上一个盒子的JumpBox脚本
         * @var curBox 完整合并当前的盒子的JumpBox脚本
         */
        pefretIntergral,
        /**
         * 角色站在盒子上面时
         * @var boxFinishNum 当前角色已完成的盒子个数
         */
        boxFinishNum,
        /**
         * 阶段性反馈
         * @var leverNum 层数
         */
        periodicFeedback,
    }
    export enum JumpGameState {
        isReady,
        isPlaying,
        isEnd,
    }
    export class JumpView extends Behaviour {
        Event = new ps.EventDispatcher();
        private _boxNum = 0;
        private _boxMaxNum = 20;
        private _curBox: JumpBox;
        private _boxOffsetY: number;
        private _boxesScript: JumpBox[] = [];
        private _boxFinishNum = 0;
        private _boxFab: qc.Node;
        private _cloudFab: qc.Node;
        private cloudWrapper: qc.Node;
        private _meterFab: qc.Node;
        private _nStage: qc.Node;
        private _boxesTopY = 0;
        private _downNum = 0;
        private _isJumping = false;
        private _petNode: qc.Node;
        private _petScript: JumpSheep;
        public gameState = JumpGameState.isReady;
        private _countdown = 1000;
        public isStop = false;
        private _perMeter = 10;
        private _winIsToInit = false;
        private _defeatIsToInit = false;
        private _winIsToInitTime = 2000;
        private _defeatIsToInitTime = 2000;
        private _bgScrollTime = 300;
        private _boxAppearX = 500;
        private _nStageInit: number;
        private _bg: qc.Node;

        private constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            _boxFab: qc.Serializer.NODE,
            _petNode: qc.Serializer.NODE,
            _cloudFab: qc.Serializer.NODE,
            _meterFab: qc.Serializer.NODE,
            _nStage: qc.Serializer.NODE,
            _countdown: qc.Serializer.NUMBER,
            _perMeter: qc.Serializer.NUMBER,
            _boxMaxNum: qc.Serializer.NUMBER,
            _winIsToInit: qc.Serializer.BOOLEAN,
            _defeatIsToInit: qc.Serializer.BOOLEAN,
            _winIsToInitTime: qc.Serializer.NUMBER,
            _defeatIsToInitTime: qc.Serializer.NUMBER,
            _bgScrollTime: qc.Serializer.NUMBER,
            _boxAppearX: qc.Serializer.NUMBER,
        };
        public createGui(): GuiType {
            return {
                _boxFab: {
                    title: "盒子组件节点",
                    component: "node", // 数字控件
                },
                _petNode: {
                    title: "角色组件节点",
                    component: "node", // 数字控件
                },
                _bg: {
                    title: "静态背景节点",
                    component: "node", // 数字控件
                },
                _cloudFab: {
                    title: "动态背景节点",
                    component: "node", // 数字控件
                },
                _meterFab: {
                    title: "阶段性反馈组件节点",
                    component: "node", // 数字控件
                },
                _nStage: {
                    title: "移动节点",
                    component: "node", // 数字控件
                },
                _winIsToInit: {
                    title: "胜利后背景回到初始位置",
                    component: "switch", // 数字控件
                },
                _defeatIsToInit: {
                    title: "失败后背景回到初始位置",
                    component: "switch", // 数字控件
                },
                _countdown: {
                    title: "游戏开始倒计时",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _bgScrollTime: {
                    title: "游戏过程中背景每次滚动的时间",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _boxAppearX: {
                    title: "盒子生成距中心位置的x轴距离",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _perMeter: {
                    title: "阶段性胜利层数",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _boxMaxNum: {
                    title: "胜利层数",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _winIsToInitTime: {
                    title: "胜利后间隔多久开始滚动",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
                _defeatIsToInitTime: {
                    title: "失败后间隔多久开始滚动",
                    component: "input", // 数字控件
                    field: {
                        type: "number",
                    },
                },
            };
        }
        public get boxNum(): number {
            return this._boxNum;
        }

        public set boxNum($value: number) {
            this._boxNum = $value;
        }

        public get boxFinishNum(): number {
            return this._boxFinishNum;
        }

        public set boxFinishNum($value: number) {
            if (this._boxFinishNum == $value) return;
            this._boxFinishNum = $value;
            this.Event.dispatch(GEvent.boxFinishNum, $value);
        }

        public get boxMaxNum(): number {
            return this._boxMaxNum;
        }

        public set boxMaxNum($value: number) {
            this._boxMaxNum = $value;
        }

        public get curBox(): JumpBox {
            return this._curBox;
        }

        public set curBox($value: JumpBox) {
            this._curBox = $value;
        }

        public get boxOffsetY(): number {
            return this._boxOffsetY;
        }

        public set boxOffsetY($value: number) {
            this._boxOffsetY = $value;
        }

        public get boxesScript(): JumpBox[] {
            return this._boxesScript;
        }

        public set boxesScript($value: JumpBox[]) {
            this._boxesScript = $value;
        }

        public get isJumping(): boolean {
            return this._isJumping;
        }

        public set isJumping($value: boolean) {
            if (this._isJumping == $value) {
                return;
            }
            this.Event.dispatch("jump", $value);
            this._isJumping = $value;
        }

        onInit() {
            timer.once(this._countdown, () => {
                this.createBox();
            });
            this._boxOffsetY = this._boxFab.children[0].height;
            this._nStageInit = this._nStage.y;
            this._petScript = this._petNode.getScript("ps.JumpSheep");
            this.Event.add("checkBoxHipSheep", this.checkBoxHitSheep, this);
            this.initClouds();
            this.initMeters();
            this._nStage.width = 0;
            this._nStage.height = 0;
            this._petNode.parent.width = 0;
            this._petNode.parent.height = 0;
        }

        public fixAnchored() {
            if (!this._cloudFab) return;
            this._cloudFab.parent.width = 0;
            this._cloudFab.parent.height = 0;
            this._cloudFab.setAnchor(
                new qc.Point(0.5, 1),
                new qc.Point(0.5, 1),
                true
            );
            this._cloudFab.pivotX = 0.5;
            this._cloudFab.pivotY = 1;
        }

        public createBox() {
            if (this._boxNum >= this._boxMaxNum) {
                // 游戏胜利
                this.gameEnd(true);
            } else {
                this._boxNum++;
                this.onBoxNum();
            }
        }

        /** 创建盒子 */
        private onBoxNum() {
            if (this._boxNum > this._boxesScript.length) {
                const box = qc_game.add.clone(
                    this._boxFab,
                    this._boxFab.parent
                );
                this._boxFab.parent.setChildIndex(box, 0);
                box.visible = true;
                const boxScript: JumpBox = box.getScript(JumpBox);
                this._boxesScript.push(boxScript);
                boxScript.boxType =
                    ((this._boxNum - 1) % this._boxFab.children.length) + 1;
                const isLeft =
                    this._boxesScript.length <= 2 ? false : Math.random() > 0.5;
                boxScript.isLeft = isLeft;
                box.x = (isLeft ? -1 : 1) * this._boxAppearX;
                box.y = -(this._boxesScript.length - 1) * this._boxOffsetY;
                this._boxesTopY = box.y - this._boxOffsetY;
                this.onBoxesTopY();
                boxScript.move();
            } else {
                this._boxesScript.forEach(($b) => $b.destroy());
                this._boxesScript.splice(0);
            }
        }

        /** 改变可动元素的整体高度 */
        private onBoxesTopY() {
            if (!this._nStage) return; //兼容编辑器
            const halfY = this.gameObject.height >> 1;
            const temp = this._nStage.y + this._boxesTopY;
            qc.Node.prototype["setPropertyIgnoreLayout"] &&
                this._nStage["setPropertyIgnoreLayout"]({ prop: "y" });
            if (temp < halfY) {
                const y = halfY - this._boxesTopY;
                Tween.to(this._nStage, { y }, this._bgScrollTime);
            }
        }

        /** 初始化云 */
        private initClouds() {
            if (!this._cloudFab) return;
            (this._cloudFab as qc.UIImage).imageType =
                qc.UIImage.IMAGE_TYPE_TILED;
            (this._cloudFab as qc.UIImage).resetNativeSize();
            const cloudH = this._cloudFab.height;
            this._cloudFab.height =
                Math.ceil((this._boxOffsetY * this._boxMaxNum) / cloudH) *
                cloudH;
        }

        /** 初始化线 */
        private initMeters() {
            if (this._perMeter === 0 || !this._meterFab) return;
            if (qc.Node.prototype["setPropertyIgnoreLayout"]) {
                this._meterFab["setPropertyIgnoreLayout"]({ prop: "y" });
                this._meterFab["setPropertyIgnoreLayout"]({
                    prop: "visible",
                    value: false,
                });
            }
            const parent = this._boxFab.parent;
            this._meterFab.visible = false;
            const meterN = ((this._boxMaxNum ?? 20) / 10) | 0;
            for (let i = 1; i <= meterN; i++) {
                const meter: JumpMeter = this.game.add
                    .clone(this._meterFab, parent)
                    .getScript("ps.JumpMeter");
                this._meters.push(meter);
                meter.count = i * this._perMeter;
                meter.onInit();
            }
        }
        private _meters: JumpMeter[] = [];

        public gameEnd($isSuccess: boolean): void {
            this.gameState = JumpGameState.isEnd;
            if ($isSuccess) {
                ps.gameEnd(true);
                this._winIsToInit &&
                    timer.once(this._winIsToInitTime, () => {
                        this.nStageToInit();
                    });
                this.Event.dispatch(GEvent.gameSuccess);
            } else {
                ps.gameEnd(false);
                this._defeatIsToInit &&
                    timer.once(this._defeatIsToInitTime, () => {
                        this.nStageToInit();
                    });
                this.Event.dispatch(GEvent.gameDefeat);
            }
        }

        private nStageToInit() {
            const layout = this._nStage.getScript("ps.Layout");
            if (layout) {
                layout.ignoreProps = Object["values"](layout.ignoreProps);
                layout.ignoreProps = layout.ignoreProps.filter(
                    (o) => o !== "y"
                );
                layout.refresh();
            } else {
                this._nStage.y = this._nStageInit;
            }
        }

        // 碰撞检测
        public checkBoxHitSheep() {
            if (
                !(this._petScript.nodeJumpSize || this._petScript.nodeStandSize)
            )
                return;
            const { l, r, b, t } = this._isJumping
                ? this._petScript.nodeJumpSize
                : this._petScript.nodeStandSize;
            const { curBox } = this;
            const { x, y } = curBox.gameObject;
            const { width, height } = curBox.gameObject.children[0];
            const boxhw = width >> 1;
            const boxhh = height >> 1;
            const { x: myX, y: myY } = this._petNode;
            const { width: myW, height: myH } = this._petNode;
            const petB = myY + myH / 2 - b;
            const petT = myY - myH / 2 + t;
            const myhw = myW >> 1;
            if (
                myX + myhw - r > x - boxhw && //碰撞箱子左侧
                myX - myhw + l < x + boxhw && //碰撞箱子右侧
                petT <= y + boxhh &&
                petB >= y - boxhh
            ) {
                //在箱体范围
                const isFailed = petB > y - boxhh + 20;
                if (isFailed) {
                    // 游戏失败
                    this._petScript.gameFail();
                    return;
                } else if (curBox.isLeft ? myX < x + boxhw : myX > x - boxhw) {
                    this.isJumping = false;
                    this.boxFinishNum = this.boxNum;
                    this._petNode.y = y - boxhh - (myH / 2 - b);
                    this.createBox();
                }
            }
        }

        onDown() {
            // 点击屏幕
            if (
                (this.gameState === JumpGameState.isPlaying || this.isStop) &&
                !this._isJumping
            ) {
                this.isStop = false;
                this._downNum++;
                this.gameState = JumpGameState.isPlaying;
                this.Event.dispatch(GEvent.vaildDown, this._downNum);
                this.isJumping = true;
            }
        }
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
    //PlaySmart新增回调(继承ps.Behaviour)
    pl状态回调(onInit、onStart、onEnding、onRetry)
    如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
    */
    qc.registerBehaviour("ps.JumpView", JumpView);
    JumpView["__menu"] = "玩法模板/跳一跳玩法/全局组件（JumpView）";
}
