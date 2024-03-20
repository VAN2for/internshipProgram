namespace ps {
    /**
     * 待匹配纸牌
     * @description 待匹配纸牌
     * @author jingru.wu
     * @date 2023/02/21 13:48:58
     */
    export enum WaitMatchCardEvent {
        /**
         * 每次纸牌合成触发该事件
         * @var 一共合成多少次
         * @var 从哪个纸牌开始合成
         * @var 最终合成的纸牌
         */
        update,
        /**
         * 新卡牌生成触发该事件
         * @var 新卡牌
         */
        createNewCard,
        /**
         * 鼠标按下
         * @var 被点击的卡牌
         * @var 鼠标按下事件(event)
         */
        cardDown,
        /**
         * 纸牌放下事件
         * @var 被放下的卡牌
         * @var 拖拽结束事件(event)
         */
        cardDragEnd,
        /**
         * 纸牌匹配错误触发事件
         * @var 可拖拽卡牌
         * @var 在纸牌堆中的卡牌
         */
        cardMatchWrong,
        /**
         * 纸牌匹配成功匹配，开始合成触发该事件
         * @var 可拖拽卡牌
         * @var 在纸牌堆中的卡牌
         */
        cardMatchSuccess,
        /**
         * 纸牌堆中每一列的头纸牌都是最高级纸牌
         */
        cardAllMatch,
    }

    export class WaitMatchCard extends Behaviour {
        /** 卡牌堆节点 */
        private cardHeap: qc.Node;
        /** 卡牌种类节点 */
        private cardType: qc.Node;
        /** 卡牌组 */
        private cards: qc.Node[];
        /** 放下卡牌后，与拖拽卡牌重合的卡牌 */
        private curCard: qc.Node;
        /** 面积覆盖率 */
        private areaRate = 0.5;
        /** 随机生成卡牌张数 */
        private randCardNum = 0;
        /** 最高级纸牌节点名 */
        private maxCardName = 0;
        /** 可拖拽卡牌位置 */
        private guideCardLocationX = 0;
        private guideCardLocationY = 0;
        /** 等待拖拽卡牌的数组 */
        private waitCardX: number[] = [];
        private waitCardY: number[] = [];
        private waitCardScale: number[] = [];
        /** 卡牌放下的声音 */
        private sm_down = "";
        /** 卡牌合成的声音 */
        private sm_collect = "";
        /** 卡牌匹配错误的声音 */
        private sm_wrong = "";
        /** 合成的总次数 */
        private allTime = 0;
        /** 是否明牌 */
        private isLight = true;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            cardHeap: qc.Serializer.NODE,
            cardType: qc.Serializer.NODE,
            areaRate: qc.Serializer.NUMBER,
            randCardNum: qc.Serializer.NUMBER,
            waitMatchLocationX: qc.Serializer.NUMBER,
            waitMatchLocationY: qc.Serializer.NUMBER,
            guideCardLocationX: qc.Serializer.NUMBER,
            guideCardLocationY: qc.Serializer.NUMBER,
            sm_collect: qc.Serializer.STRING,
            sm_down: qc.Serializer.STRING,
            sm_wrong: qc.Serializer.STRING,
            waitCardX: qc.Serializer.NUMBERS,
            waitCardY: qc.Serializer.NUMBERS,
            waitCardScale: qc.Serializer.NUMBERS,
            isLight: qc.Serializer.BOOLEAN,
        };
        public createGui(): GuiType {
            return {
                cardHeap: {
                    title: "纸牌堆节点",
                    component: "node",
                },
                cardType: {
                    title: "所有预设纸牌父节点",
                    component: "node",
                },
                randCardNum: {
                    title: "随机生成纸牌数量",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                areaRate: {
                    title: "触发合成重叠面积最小比例",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                isLight: {
                    title: "待拖拽纸牌是否明牌",
                    component: "switch",
                },
                guideCardLocationX: {
                    title: "可拖拽纸牌位置X",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                guideCardLocationY: {
                    title: "可拖拽纸牌位置Y",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                waitCardX: {
                    title: "待拖拽纸牌参数配置X",
                    tail: "待拖拽纸牌参数配置X,Y,Scale位置需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                waitCardY: {
                    title: "待拖拽纸牌参数配置Y",
                    tail: "待拖拽纸牌参数配置X,Y,Scale位置需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                waitCardScale: {
                    title: "待拖拽纸牌参数配置Scale",
                    tail: "待拖拽纸牌参数配置X,Y,Scale位置需要一一对应",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                sm_down: {
                    title: "纸牌放下时播放的声音",
                    component: "node",
                },
                sm_collect: {
                    title: "纸牌合成时播放的声音",
                    component: "node",
                },
                sm_wrong: {
                    title: "纸牌匹配错误时播放的声音",
                    component: "node",
                },
            };
        }
        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] WaitMatchCard.awake");
        }

        /** 试玩 */
        public onInit() {
            // 获得最高节点
            this.cardType.children.forEach((el) => {
                el.getScript("ps.CardMap") ||
                    utils.debugAssert(false, `${el.name}没有挂载组件cardMap`);
                this.maxCardName = Math.max(
                    this.maxCardName,
                    el.getScript("ps.CardMap").cardNum
                );
            });
        }

        /** 试玩初始化的处理 */
        public onStart() {
            this.cards = this.cardHeap.children;
            // 有纸牌直接绑定事件
            if (this.gameObject.children.length > 0) {
                const tmpNode =
                    this.gameObject.children[
                        this.gameObject.children.length - 1
                    ];
                tmpNode.interactive = true;
                for (let i = 0; i < this.gameObject.children.length; i++) {
                    // 鼠标按下拖动
                    this.gameObject.children[i].onDown.add(
                        this.mouseDown,
                        this
                    );
                }
            }
            // 刚开始没有纸牌
            if (
                this.randCardNum > 0 &&
                this.gameObject.children.length < this.waitCardX.length + 1
            ) {
                for (let i = 0; i < this.waitCardX.length + 1; i++) {
                    this.randCreateCrad();
                }
            }
        }

        /** 鼠标按下事件 */
        public mouseDown(node: qc.Node, event: qc.PointerEvent): void {
            gameEvent.dispatch(WaitMatchCardEvent.cardDown, node, event);
            // 绑定拖拽事件
            node.onDrag.add(this.dragCard, this);
            node.onDragEnd.add(this.dragDown, this);
        }

        /** 拖动方法 */
        public dragCard(node: qc.Node, ev: qc.DragEvent): void {
            // 获得移动的坐标相对于卡牌父节点的位置
            const point = node.parent.toLocal(
                new qc.Point(ev.source.x, ev.source.y)
            );
            node.x = point.x;
            node.y = point.y;
            this.curCard = undefined;
            this.cards.forEach((card: qc.Node) => {
                card = card.children[card.children.length - 1];
                if (this.countMulArea(node, card)) {
                    this.curCard = card;
                    gsap.to(card, {
                        scaleY: 1.1,
                        scaleX: 1.1,
                        duration: 0.1,
                        ease: "none",
                    });
                } else {
                    gsap.to(card, {
                        scaleY: 1,
                        scaleX: 1,
                        duration: 0.1,
                        ease: "none",
                    });
                }
            });
        }

        /** 计算两张卡牌覆盖率 */
        public countMulArea(card1: qc.Node, card2: qc.Node): boolean {
            const cardArea =
                card1.getWorldBox().width * card1.getWorldBox().height;
            if (
                Math.abs(card1.getWorldBox().x - card2.getWorldBox().x) <
                    card1.getWorldBox().width &&
                Math.abs(card1.getWorldBox().y - card2.getWorldBox().y) <
                    card1.getWorldBox().height
            ) {
                // 上
                let x1 = card1.getWorldCorners()[0].x;
                if (x1 < card2.getWorldCorners()[0].x) {
                    x1 = card2.getWorldCorners()[0].x;
                }
                // 下
                let x2 = card1.getWorldCorners()[2].x;
                if (x2 > card2.getWorldCorners()[2].x) {
                    x2 = card2.getWorldCorners()[2].x;
                }
                // 左
                let y1 = card1.getWorldCorners()[0].y;
                if (y1 < card2.getWorldCorners()[0].y) {
                    y1 = card2.getWorldCorners()[0].y;
                }
                // 右
                let y2 = card1.getWorldCorners()[2].y;
                if (y2 > card2.getWorldCorners()[2].y) {
                    y2 = card2.getWorldCorners()[2].y;
                }
                if (((x1 - x2) * (y1 - y2)) / cardArea >= this.areaRate) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }

        /** 卡牌被放下 */
        public dragDown(node: qc.Node, event: qc.DragEndEvent): void {
            gameEvent.dispatch(WaitMatchCardEvent.cardDragEnd, node, event);
            // 播放放下声音
            ps.utils.playSound(this.sm_down);
            // 移除拖拽事件
            node.onDrag.remove(this.dragCard, this);
            node.onDragEnd.remove(this.dragDown, this);
            const cardName = node.name;
            // 匹配成功
            if (this.curCard) {
                this.curCard.getScript("ps.CardMap") ||
                    utils.debugAssert(
                        false,
                        `${this.curCard.name}没有挂载组件cardMap`
                    );
            }
            node.getScript("ps.CardMap") ||
                utils.debugAssert(false, `${node.name}没有挂载组件cardMap`);
            if (
                this.curCard &&
                this.curCard.getScript("ps.CardMap").cardNum ==
                    node.getScript("ps.CardMap").cardNum
            ) {
                gameEvent.dispatch(
                    WaitMatchCardEvent.cardMatchSuccess,
                    node,
                    this.curCard
                );
                node.interactive = false;
                // 将拖拽过来的卡牌放入卡牌组中
                const tmpNode = this.game.add.clone(node, this.curCard.parent);
                tmpNode.x = this.curCard.parent.toLocal(
                    node.getWorldPosition()
                ).x;
                tmpNode.y = this.curCard.parent.toLocal(
                    node.getWorldPosition()
                ).y;
                node.destroy();
                node = tmpNode;
                const groupCards = node.parent;
                const t = gsap.timeline({
                    defaults: { duration: 0.1, ease: "none" },
                });
                // 合成动画
                this.allTime = 0;
                this.matchAnimation(this.curCard, node, t);
                t.then(() => {
                    // 待匹配卡牌少于预定的 要随机生成新的
                    if (
                        this.randCardNum > 0 &&
                        this.gameObject.children.length <= this.waitCardX.length
                    ) {
                        this.randCreateCrad();
                    }
                    const flag = this.cards.every((c) => {
                        return (
                            c.children.length > 0 &&
                            c.children[c.children.length - 1].getScript(
                                "ps.CardMap"
                            ).cardNum == this.maxCardName
                        );
                    });
                    if (flag) {
                        gameEvent.dispatch(WaitMatchCardEvent.cardAllMatch);
                    }
                    // 将待匹配卡牌移动到相应的位置
                    this.moveCard();
                    // 触发update事件
                    gameEvent.dispatch(
                        WaitMatchCardEvent.update,
                        this.allTime,
                        cardName,
                        groupCards.children[groupCards.children.length - 1].name
                    );
                });
            } else {
                // 匹配错误
                this.curCard &&
                    gameEvent.dispatch(
                        WaitMatchCardEvent.cardMatchWrong,
                        node,
                        this.curCard
                    );
                // 播放错误声音
                ps.utils.playSound(this.sm_wrong);
                // 回弹
                node.x = this.guideCardLocationX;
                node.y = this.guideCardLocationY;
                // 恢复原来的大小
                this.curCard &&
                    gsap.to(this.curCard, {
                        scaleY: 1,
                        scaleX: 1,
                        duration: 0.1,
                        ease: "none",
                    });
            }
            this.curCard = undefined;
        }

        /** match动画 */
        /**
         * @description:
         * @param {qc} card 在卡牌堆的卡牌
         * @param {qc} node 拖拽的卡牌
         * @param {gsap} t 合成动画时间线
         * @return {*}
         */
        public matchAnimation(
            card: qc.Node,
            node: qc.Node,
            t: gsap.core.Timeline
        ) {
            const groupCard = card.parent;
            let newCard: qc.Node;
            this.preAni(t, card, node);
            this.allTime++;
            t.call(() => {
                // 播放合成声音
                ps.utils.playSound(this.sm_collect);
                // 生成新卡牌
                card.getScript("ps.CardMap") ||
                    utils.debugAssert(false, `${card.name}没有挂载CardMap节点`);
                const mergeNum = card.getScript("ps.CardMap").cardNum * 2;
                // 找到卡牌
                newCard = this.game.add.clone(
                    this.findCardInType(mergeNum),
                    groupCard
                );
                newCard.alpha = 1;
                newCard.visible = true;
                newCard.x = card.x;
                newCard.y = card.y;
                gameEvent.dispatch(WaitMatchCardEvent.createNewCard, newCard);
                this.aftAni(t, card, node, newCard);
            });
            t.call(() => {
                // 合成结束，移除两个节点
                groupCard.removeChild(card);
                groupCard.removeChild(node);
                // 如果没有卡牌了或者当前卡牌与上面的卡牌不匹配 不递归
                if (
                    groupCard.children.length >= 2 &&
                    newCard.name ==
                        groupCard.children[groupCard.children.length - 2].name
                ) {
                    this.matchAnimation(
                        groupCard.children[groupCard.children.length - 2],
                        newCard,
                        t
                    );
                }
            });
        }

        /** 移动卡牌 */
        public moveCard() {
            const len = this.gameObject.children.length;
            for (
                let i = len - 2, j = 0;
                j < this.waitCardX.length - 1 && i >= 0;
                i--, j++
            ) {
                gsap.to(this.gameObject.children[i], {
                    x: this.waitCardX[j],
                    y: this.waitCardY[j],
                    scaleX: this.waitCardScale[j + 1],
                    scaleY: this.waitCardScale[j + 1],
                    duration: 0.1,
                });
            }
            const newGuideCard =
                this.gameObject.children.length > 0 &&
                this.gameObject.children[this.gameObject.children.length - 1];
            newGuideCard.visible = true;
            if (newGuideCard) {
                gsap.to(newGuideCard, {
                    x: this.guideCardLocationX,
                    y: this.guideCardLocationY,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.1,
                }).then(() => {
                    newGuideCard.interactive = true;
                    if (!this.isLight) {
                        utils.changeCard(
                            newGuideCard.getScript("ps.CardMap").back,
                            newGuideCard.getScript("ps.CardMap").front
                        );
                    }
                });
            }
        }

        /** 随机生成卡牌 */
        public randCreateCrad() {
            const resCardArr = [];
            this.randCardNum--;
            this.cards.forEach((el) => {
                el.children[el.children.length - 1].getScript("ps.CardMap") ||
                    utils.debugAssert(
                        false,
                        `${
                            el.children[el.children.length - 1].name
                        }没有挂载组件cardMap`
                    );
                const cName =
                    el.children[el.children.length - 1].getScript(
                        "ps.CardMap"
                    ).cardNum;
                if (this.maxCardName != cName)
                    el.children.length > 0 &&
                        resCardArr.push(el.children[el.children.length - 1]);
            });
            if (resCardArr.length == 1) {
                const cGroup = resCardArr[0].parent.children;
                for (let i = cGroup.length - 1; i > 0; i--) {
                    if (
                        cGroup[i].getScript("ps.CardMap").cardNum * 2 !=
                        cGroup[i - 1].getScript("ps.CardMap").cardNum
                    ) {
                        const newCardNum =
                            cGroup[i].getScript("ps.CardMap").cardNum * 2;
                        const newCard = this.findCardInType(newCardNum);
                        if (newCardNum < this.maxCardName) {
                            resCardArr.push(newCard);
                        }
                        break;
                    }
                }
                if (
                    cGroup.length == 1 &&
                    cGroup[0].getScript("ps.CardMap").cardNum * 2 <
                        this.maxCardName
                ) {
                    const newCardNum =
                        cGroup[0].getScript("ps.CardMap").cardNum * 2;
                    resCardArr.push(this.findCardInType(newCardNum));
                }
            }
            // 删除已有的
            this.gameObject.children.forEach((card) => {
                card.getScript("ps.CardMap") ||
                    utils.debugAssert(false, `${card.name}没有挂载组件cardMap`);
                const cName = card.getScript("ps.CardMap").cardNum;
                const tmpIdx = resCardArr.findIndex((el) => {
                    el.getScript("ps.CardMap") ||
                        utils.debugAssert(
                            false,
                            `${el.name}没有挂载组件cardMap`
                        );
                    return el.getScript("ps.CardMap").cardNum == cName;
                });
                tmpIdx != -1 && resCardArr.splice(tmpIdx, 1);
            });
            if (resCardArr.length == 0) return;
            const ranIdx = Math.floor(Math.random() * resCardArr.length);
            // 得到随机纸牌，放入待匹配节点中 并设置x、y、scale值
            const randCard = resCardArr[ranIdx];
            resCardArr.splice(ranIdx, 1);
            this.createWaitCard(randCard);
        }

        /** 根据card纸牌，放入待匹配节点中 并设置x、y、scale值 */
        public createWaitCard(card: qc.Node) {
            card = this.game.add.clone(card, this.gameObject);
            this.gameObject.setChildIndex(card, 0);
            const idx = this.gameObject.children.length - 2;
            if (idx >= this.waitCardX.length) {
                card.scaleX = this.waitCardScale[this.waitCardX.length - 1];
                card.scaleY = this.waitCardScale[this.waitCardX.length - 1];
                card.x = this.waitCardX[this.waitCardX.length - 1];
                card.y = this.waitCardY[this.waitCardX.length - 1];
                if (idx > this.waitCardX.length) {
                    card.visible = false;
                }
            } else if (idx == -1) {
                card.scaleX = 1;
                card.scaleY = 1;
                card.x = this.guideCardLocationX;
                card.y = this.guideCardLocationY;
                card.interactive = true;
            } else {
                card.scaleX = this.waitCardScale[idx];
                card.scaleY = this.waitCardScale[idx];
                card.x = this.waitCardX[idx];
                card.y = this.waitCardY[idx];
            }
            if (!this.isLight && idx != -1) {
                card.getScript("ps.CardMap").back.visible = true;
                card.getScript("ps.CardMap").front.visible = false;
            }
            card.onDown.add(this.mouseDown, this);
        }

        /** 生成新卡牌前的动画 */
        public preAni(
            t: gsap.core.Timeline,
            card: qc.Node,
            node: qc.Node
        ): void {
            t.to(node, { x: card.x, y: card.y }) // 让拖拽的卡牌与卡牌堆的卡牌重合
                .to(card, { scaleX: 1, scaleY: 1 }, "<")
                .to(node, { scaleX: 0.8, scaleY: 0.8 })
                .to(card, { scaleX: 0.8, scaleY: 0.8 }, "<");
        }

        /** 生成新卡牌后的动画 */
        public aftAni(
            t: gsap.core.Timeline,
            card: qc.Node,
            node: qc.Node,
            newCard: qc.Node
        ): void {
            t.fromTo(
                card,
                { scaleX: 0.8, scaleY: 0.8 },
                { scaleY: 1, scaleX: 1, duration: 0.1, ease: "back.out(10)" }
            )
                .fromTo(
                    node,
                    { scaleX: 0.8, scaleY: 0.8 },
                    {
                        scaleY: 1,
                        scaleX: 1,
                        duration: 0.1,
                        ease: "back.out(10)",
                    },
                    "<"
                )
                .fromTo(
                    newCard,
                    { scaleX: 0.8, scaleY: 0.8 },
                    {
                        scaleY: 1,
                        scaleX: 1,
                        duration: 0.1,
                        ease: "back.out(10)",
                    },
                    "<"
                )
                .fromTo(
                    newCard,
                    { alpha: 0 },
                    { alpha: 1, duration: 0.1 },
                    "<"
                );
        }

        /** 改变合成动画 */
        public changeMatchAni(
            preAni: (
                t: gsap.core.Timeline,
                card: qc.Node,
                node: qc.Node
            ) => void,
            aftAni: (
                t: gsap.core.Timeline,
                card: qc.Node,
                node: qc.Node,
                newCard: qc.Node
            ) => void
        ) {
            this.preAni = preAni;
            this.aftAni = aftAni;
        }

        /** 在卡牌种类中找到cardNum卡牌 */
        public findCardInType(num: number) {
            const cNNode = this.cardType.children.find((card) => {
                card.getScript("ps.CardMap") ||
                    utils.debugAssert(false, `${card.name}没有挂载组件cardMap`);
                return card.getScript("ps.CardMap").cardNum == num;
            });
            cNNode ||
                ps.utils.debugAssert(
                    false,
                    "在所有预设纸牌父节点中没有找到对应数值为" + num + "的纸牌"
                );
            return cNNode;
        }
    }
    qc.registerBehaviour("ps.WaitMatchCard", WaitMatchCard);
    WaitMatchCard["__menu"] =
        "玩法模板/2048纸牌玩法/待匹配纸牌（WaitMatchCard）";
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
