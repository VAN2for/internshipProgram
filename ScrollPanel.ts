namespace ps {
    /**
     *
     * @description
     * @author bin
     * @date 2023/02/08 16:58:59
     */
    export enum ScrollPanelEvent {
        showCenterItem = "showCenterItem",
        completeScroll = "completeScroll"
    }

    export class ScrollPanel extends Behaviour {
        public itemEvent: EventDispatcher = new EventDispatcher();

        private itemPanelArr: qc.Node[] = []; // 列
        private itemElemetArr: qc.Node[] = []; // 每列元素
        private targetItemArr: qc.Node[] = []; // 滚动后需要停住的目标元素

        private elementSpacing: number = 150; // 每列中元素间的距离
        private initMoveSpeed = 25; // 初始移动速度
        private moveSpeed = 25; // 初始滚动的速度
        private accelerationNum = 0.5; // 每帧加速度
        private refreshNum = 25; // 总共滚动几个元素后触发滚动暂停
        private scrollColumDelayTime = 200;
        private scrollCorrectPosTime = 1500;

        private moveTimerArr: Function[] = [];
        private dollPanelArr: qc.Node[][] = []
        private oldRandomIndexArr: number[] = [];

        private scrollTotalNum = 3;
        private scrollNowNum = 0;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {
            itemPanelArr: qc.Serializer.NODES,
            itemElemetArr: qc.Serializer.NODES,
            targetItemArr: qc.Serializer.NODES,
        };

        /** 试玩初始化的处理 */
        public onInit() {
            this.initDollPanel();
        }

        private initDollPanel() {
            const node = this.game.add.node(main.gameObject);
            node.visible = false;
            for (let i = 0; i < this.itemElemetArr.length; i++) {
                const element = this.itemElemetArr[i];
                element.setPropertyIgnoreLayout({ prop: "visible" })
                element.setPropertyIgnoreLayout({ prop: "x" })
                element.setPropertyIgnoreLayout({ prop: "y" })
                node.addChild(element);
            }

            for (let i = 0; i < this.itemPanelArr.length; i++) {
                this.dollPanelArr[i] = [];
                for (let j = 0; j < 4; j++) {
                    const cloneRandomItem = this.cloneRandomItem(i, this.itemPanelArr[i]);
                    cloneRandomItem.visible = true;
                    cloneRandomItem.x = 0;
                    cloneRandomItem.y = this.elementSpacing * (-j + 1);
                    this.dollPanelArr[i].push(cloneRandomItem);
                }
            }
            this.startDefaultScrolling();
        }

        cloneRandomItem(itemPanelIndex: number, itemPanel: qc.Node) {
            const randomIndex = Math.floor(Math.random() * this.itemElemetArr.length);
            const randomItem = this.itemElemetArr[randomIndex];
            if (this.oldRandomIndexArr[itemPanelIndex] >= 0 && this.oldRandomIndexArr[itemPanelIndex] === randomIndex) {
                return this.cloneRandomItem(itemPanelIndex, itemPanel);
            }
            this.oldRandomIndexArr[itemPanelIndex] = randomIndex;
            const cloneRandomItem = this.game.add.clone(randomItem, itemPanel);
            return cloneRandomItem;
        }

        startDefaultScrolling() {
            for (let i = 0; i < this.itemPanelArr.length; i++) {
                const dollPanel = this.itemPanelArr[i];
                const speed = 1.2;
                this.moveTimerArr[i] = timer.frameLoop(() => {
                    this.dollPanelArr[i].forEach(item => {
                        item.y += speed;
                        if (item.y > 2 * this.elementSpacing) {
                            const cloneRandomItem = this.cloneRandomItem(i, dollPanel)
                            cloneRandomItem.visible = true;
                            cloneRandomItem.x = 0;
                            cloneRandomItem.y = this.elementSpacing * -2;

                            this.dollPanelArr[i].push(cloneRandomItem);
                            item.destroy();
                            this.dollPanelArr[i].splice(this.dollPanelArr[i].indexOf(item), 1);
                        }
                    })
                });
            }
        }

        stopDefaultScrolling() {
            for (let i = 0; i < this.itemPanelArr.length; i++) {
                ps.timer.removeFrameLoop(this.moveTimerArr[i]);
            }
        }

        scrollingElements() {
            this.scrollNowNum++;
            this.moveSpeed = this.initMoveSpeed;
            for (let i = 0; i < this.itemPanelArr.length; i++) {
                const dollPanel = this.itemPanelArr[i];
                this.startScrollColumn(dollPanel, i);
            }
        }

        startScrollColumn(dollPanel: qc.Node, i: number) {
            let nowRefreshNum = 0;
            let oldRefreshNum = 0;
            xtween(dollPanel)
                .delay(this.scrollColumDelayTime * i)
                .call(() => {
                    const a = Date.now();
                    ps.timer.removeFrameLoop(this.moveTimerArr[i]);
                    this.moveTimerArr[i] = timer.frameLoop(() => {
                        this.dollPanelArr[i].forEach(item => {
                            item.y += this.moveSpeed;
                            if (item.y > 2 * this.elementSpacing) {
                                const cloneRandomItem = this.cloneRandomItem(i, dollPanel)
                                cloneRandomItem.visible = true;
                                cloneRandomItem.x = 0;
                                cloneRandomItem.y = this.elementSpacing * -2;
                                this.dollPanelArr[i].push(cloneRandomItem);
                                item.destroy();
                                this.dollPanelArr[i].splice(this.dollPanelArr[i].indexOf(item), 1);
                                nowRefreshNum++;
                            }
                        })
                        if (nowRefreshNum > oldRefreshNum) {
                            this.moveSpeed += this.accelerationNum;
                        }
                        oldRefreshNum = nowRefreshNum;

                        if (nowRefreshNum > this.refreshNum) {
                            console.log("动画时长", Date.now() - a)
                            this.stopScrollColumn(dollPanel, i);
                        }
                    })
                })
                .start();
        }

        stopScrollColumn(dollPanel: qc.Node, i: number) {
            // console.log("停止滚动当列")
            timer.removeFrameLoop(this.moveTimerArr[i]);
            const nowDollPanelChidrenLength = this.dollPanelArr[i].length;
            for (let j = 0; j < this.dollPanelArr[i].length; j++) {
                const element = this.dollPanelArr[i][j];
                element.y = this.elementSpacing * (-j + 1);
                xtween(element)
                    .to(this.scrollCorrectPosTime, { y: element.y + this.elementSpacing * 4 }, { easing: XTween.Easing.Elastic.Out })
                    .call(() => {
                        this.dollPanelArr[i].splice(this.dollPanelArr[i].indexOf(element), 1);
                        element.destroy();
                    })
                    .start()
            }
            for (let j = 0; j < nowDollPanelChidrenLength; j++) {
                const targetItemIndex = this.scrollTotalNum - this.scrollNowNum;
                let randomItemIndex = Math.floor(Math.random() * this.itemElemetArr.length);
                let dollElement: qc.Node;

                const targetIdx = this.itemElemetArr.indexOf(this.targetItemArr[targetItemIndex]);
                while (randomItemIndex === this.oldRandomIndexArr[i] || randomItemIndex === targetIdx) {
                    randomItemIndex = Math.floor(Math.random() * this.itemElemetArr.length);
                }
                if (j === 1) {
                    dollElement = this.targetItemArr[targetItemIndex];
                    this.oldRandomIndexArr[i] = targetItemIndex;
                } else {
                    dollElement = this.itemElemetArr[randomItemIndex];
                    this.oldRandomIndexArr[i] = randomItemIndex;
                }
                const cloneRandomDollElement = this.game.add.clone(dollElement, dollPanel);
                dollPanel.setChildIndex(cloneRandomDollElement, (nowDollPanelChidrenLength + j))
                cloneRandomDollElement.visible = true;
                cloneRandomDollElement.x = 0;
                cloneRandomDollElement.y = this.elementSpacing * (-nowDollPanelChidrenLength + 1 - j);
                this.dollPanelArr[i].push(cloneRandomDollElement);

                xtween(cloneRandomDollElement)
                    .call(() => {
                        xtween(null)
                            .delay(this.scrollCorrectPosTime - this.scrollCorrectPosTime / 3)
                            .call(() => {
                                if (j === 1) {
                                    this.itemEvent.dispatch(ScrollPanelEvent.showCenterItem, cloneRandomDollElement);
                                }
                            })
                            .start();
                    })
                    .to(this.scrollCorrectPosTime, { y: cloneRandomDollElement.y + this.elementSpacing * 4 }, { easing: XTween.Easing.Elastic.Out })
                    .call(() => {
                        if (i === this.itemPanelArr.length - 1 && j === 0) {
                            this.itemEvent.dispatch(ScrollPanelEvent.completeScroll);
                        }
                    })
                    .start()
            }
        }
    }
    qc.registerBehaviour("ps.ScrollPanel", ScrollPanel);
    ScrollPanel["__menu"] = "Custom/ScrollPanel";
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