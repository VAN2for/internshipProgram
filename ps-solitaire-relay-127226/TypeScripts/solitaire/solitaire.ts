namespace ps {
    /**
     *
     * @description
     * @author yongyuan.liao
     * @date 2023/10/09 10:20:47
     */
    export class solitaire extends Behaviour {
        public list1: qc.Node[];
        public list2: qc.Node[];
        public list3: qc.Node[];
        public list4: qc.Node[];
        public list5: qc.Node[];    //上面可拖拽的一张牌（左）
        public list6: qc.Node[];    //上面可拖拽的一张牌（左）
        public lists: qc.Node[][];
        public cardback1: qc.Node;
        public cardback2: qc.Node;
        public topBox: qc.Node;
        public game_btn: qc.Node;
        public end_btn: qc.Node;
        public gf_hand: qc.Node;
        public hand_parent: qc.Node;
        public money: qc.Node[];
        public endMoney: qc.Node[];
        public board: qc.Node;


        public successSet: boolean;



        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields = {
            list1: qc.Serializer.NODES,
            list2: qc.Serializer.NODES,
            list3: qc.Serializer.NODES,
            list4: qc.Serializer.NODES,
            list5: qc.Serializer.NODES,
            list6: qc.Serializer.NODES,
            cardback1: qc.Serializer.NODE,
            cardback2: qc.Serializer.NODE,
            topBox: qc.Serializer.NODE,
            game_btn: qc.Serializer.NODE,
            end_btn: qc.Serializer.NODE,
            gf_hand: qc.Serializer.NODE,
            hand_parent: qc.Serializer.NODE,
            money: qc.Serializer.NODES,
            endMoney: qc.Serializer.NODES,
            board: qc.Serializer.NODE
        };

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] solitaire.awake");
        }
        // public cardInfo = [[[true, 13, true], [false, 12, true], [true, 11, true], [false, 10, true], [true, 9, true], [false, 8, true], [true, 7, true]],
        // [[false, 13, true], [true, 12, true], [false, 11, true], [true, 10, true], [false, 9, true], [true, 8, true]],
        // [[true, 4, false], [false, 3, false], [true, 5, false], [false, 1, false], [true, 6, true], [false, 5, true], [true, 4, true]],
        // [[false, 3, true]], [[false, 7, true]], [[true, 2, true]]]
        public cardInfo = [[[true, 13, true], [false, 12, true], [true, 11, true], [false, 10, true], [true, 9, true], [false, 8, true]], [[false, 13, true], [true, 12, true], [false, 11, true], [true, 10, true], [false, 9, true], [true, 8, true]],
        [[true, 6, true], [false, 5, true], [true, 4, true], [false, 3, true]], [[true, 2, false], [true, 7, true]], [[false, 7, true]], [[false, 1, true]]]


        // public list_num: number     //第几列
        // public arr_index: number    //第几个
        // public color: boolean       //颜色,红为true
        // public rank: number         //点数
        // public pre_card: qc.Node    //上一张
        // public next_card: qc.Node   //下一张
        // public draggable: boolean   //是否可拖拽
        public initCard(currentCard, list_num, arr_index, color, rank, pre_card, next_card, draggable) {
            currentCard.getScript(ps.card).list_num = list_num
            currentCard.getScript(ps.card).arr_index = arr_index
            currentCard.getScript(ps.card).color = color
            currentCard.getScript(ps.card).rank = rank
            currentCard.getScript(ps.card).pre_card = pre_card
            currentCard.getScript(ps.card).next_card = next_card
            currentCard.getScript(ps.card).draggable = draggable
        }
        public checkTarget(node: qc.Node, dragNode: qc.Node) {//被拖拽的牌与目标牌是否可拼接
            if (!node) return
            let node_card = node.getScript(ps.card)
            let dragNode_card = dragNode.getScript(ps.card)
            if (node_card.color !== dragNode_card.color && dragNode_card.rank + 1 === node_card.rank) {
                return true
            }
            else {
                return false
            }
        }
        public checkDraggable(node: qc.Node) {
            let preNode = node.getScript(ps.card).pre_card
            if (!preNode) return
            if (this.checkTarget(preNode, node)) {
                preNode.getScript(ps.card).draggable = true
                this.checkDraggable(preNode)
            }
            return
        }
        public resetPosition(node: qc.Node) {
            if (!node) return
            let nextNode = node.getScript(ps.card).next_card
            if (!nextNode) return
            nextNode.x = node.x
            nextNode.y = node.y
            nextNode.anchoredX = 0
            nextNode.anchoredY = 50
            nextNode.getScript(ps.DraggableItem).orgX = 0
            nextNode.getScript(ps.DraggableItem).orgY = 50
            this.resetPosition(nextNode)
            return
        }
        public changeNode(dragNode: qc.Node, targetNode: qc.Node) {
            //改节点
            targetNode.addChild(dragNode)
            //改位置
            dragNode.x = targetNode.x
            dragNode.y = targetNode.y
            dragNode.anchoredX = 0
            dragNode.anchoredY = 50
            dragNode.getScript(ps.DraggableItem).orgX = 0
            dragNode.getScript(ps.DraggableItem).orgY = 50

            let dragListIndex = dragNode.getScript(ps.card).list_num
            let targetListIndex = targetNode.getScript(ps.card).list_num
            let dragNodeIndex = dragNode.getScript(ps.card).arr_index
            let targetNodeIndex = targetNode.getScript(ps.card).arr_index
            //改数组
            const elementsToMove = this.lists[dragListIndex].splice(dragNodeIndex);
            this.lists[targetListIndex].splice(targetNodeIndex + 1, 0, ...elementsToMove);
            //改属性
            let dragPreNode = dragNode.getScript(ps.card).pre_card
            if (dragPreNode) {
                dragPreNode.getScript(ps.card).draggable = true
                dragPreNode.getScript(ps.card).next_card = null
                this.checkDraggable(dragPreNode)
            }
            targetNode.getScript(ps.card).next_card = dragNode
            dragNode.getScript(ps.card).pre_card = targetNode

            for (let i = 0; i < this.lists[targetListIndex].length; i++) {
                this.lists[targetListIndex][i].getScript(ps.card).list_num = targetListIndex
                this.lists[targetListIndex][i].getScript(ps.card).arr_index = i
            }
            this.setDragItem()
        }
        public setDragItem() {
            for (let i = 0; i < this.lists.length; i++) {
                const currentList = this.lists[i];
                for (let j = 0; j < currentList.length; j++) {
                    const dragItem = currentList[j].getScript(ps.DraggableItem) as ps.DraggableItem;
                    dragItem.dragSpace = DragSpace.Local;
                    dragItem.worldObj = UIRoot;
                    dragItem.diffS = 1.1  /** 拖拽时缩放倍数 */
                    dragItem.draggable = currentList[j].getScript(ps.card).draggable
                    dragItem.allTriggerTargets = this.lists.slice(0, 4).map(item => item[item.length - 1])
                    dragItem.triggerHide = false
                    dragItem.triggered = 0//命中目标后的操作
                    dragItem.diffY = 40/** 拖拽时y偏移值 */


                    ///开始
                    dragItem.itemEvent.removeAll()
                    dragItem.itemEvent.add(ps.DraggableItemEvent.onDown, (event, target: qc.Node) => {
                        XTween.removeAllTweens()
                        ps.triggerCustomEvent({
                            eventName: `指引退场`,
                            scene: main.sceneNodes[2]
                        })
                        if (this.shake && this.shake !== currentList[j]) {//this.shake = failanimation的node
                            this.shake.anchoredX = this.shake.getScript(ps.DraggableItem).orgX
                        }//"filter" 是一个数组方法，用于筛选过滤数组中符合特定条件的元素并返回一个新的数组。"map" 是一个数组方法，用于对数组中的每个元素进行操作并返回一个新的数组。
                        dragItem.allTriggerTargets = this.lists.slice(0, 4).map(item => item[item.length - 1]).filter(item => this.checkTarget(item, currentList[j]))

                    })
                    //结束
                    dragItem.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, (event, target: qc.Node) => {//命中目标
                        this.isDragRight = true
                        this.changeNode(currentList[j], target)
                    })
                    dragItem.itemEvent.add(ps.DraggableItemEvent.toOrgComplete, () => {//返回原处完成时
                        this.resetPosition(currentList[j])
                        ps.triggerCustomEvent({
                            eventName: `放置错误反馈`,
                            scene: main.sceneNodes[2]
                        })
                        this.isDragFalse = true
                        this.failAnimation(currentList[j])//振动
                    })
                    dragItem.itemEvent.add(ps.DraggableItemEvent.onDragEnd, () => {//拖拽结束
                        this.resetPosition(currentList[j])
                        if (this.isDragRight) {
                            ps.triggerCustomEvent({
                                eventName: `放置成功反馈`,
                                scene: main.sceneNodes[2]
                            })
                            this.checkStore()
                        }
                        if ((!this.isDragFalse && this.isFirstDrag) || this.isDragRight) {
                            const [startNode, endNode] = this.getGuidePosition()
                            this.guideStart(startNode, endNode)
                        }
                        this.isFirstDrag = true
                        this.isDragFalse = false
                        this.isDragRight = false
                    })
                    dragItem.deploty();
                }
            }
        }
        public isDragRight = false
        public isDragFalse = false
        public play_time: number
        public isFirstDrag = false

        // public list_num: number     //第几列
        // public arr_index: number    //第几个
        // public color: boolean       //颜色,红为true
        // public rank: number         //点数
        // public pre_card: qc.Node    //上一张
        // public next_card: qc.Node   //下一张
        // public draggable: boolean   //是否可拖拽
        /** 试玩初始化的处理 */
        public onInit() {
            main.testSolitaire = this;
            this.lists = [this.list1, this.list2, this.list3, this.list4, this.list5, this.list6];
            this.board.addScript("ps.DraggableItem") as ps.DraggableItem;
            const dragItem1 = this.board.getScript(ps.DraggableItem) as ps.DraggableItem;
            dragItem1.dragSpace = DragSpace.Local;
            dragItem1.worldObj = UIRoot;
            dragItem1.diffS = 1.1
            dragItem1.draggable = true;
            dragItem1.allTriggerTargets = this.lists.slice(0, 4).map(item => item[item.length - 1])
            dragItem1.triggerHide = false
            dragItem1.triggered = 0
            dragItem1.diffY = 40
            this.play_time = 0
            dragItem1.itemEvent.add(ps.DraggableItemEvent.onDown, (event, target: qc.Node) => {
                // alert("down")
            })
            dragItem1.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, (event, target: qc.Node) => {//命中目标

                // alert("命中目标")
                console.log("命中目标")
            })
            dragItem1.itemEvent.add(ps.DraggableItemEvent.onDragEnd, () => {
                console.log("拖拽结束")
            })
            dragItem1.itemEvent.add(ps.DraggableItemEvent.toOrgComplete, () => {
                console.log("返回原处完成时")
            })
            dragItem1.deploty();
            /*
            // 随机选择 3 到 10 个元素，并触发类内方法
          public function randomSelect() {
            
          const minSelectedCount = 3;
          const maxSelectedCount = 10;
          
          // 随机选择元素的数量
          const selectedCount = Math.floor(Math.random() * (maxSelectedCount - minSelectedCount + 1)) + minSelectedCount;
          
          // 随机选择元素的索引
          const selectedIndices = new Set<number>();
          while (selectedIndices.size < selectedCount) {
            const randomIndex = Math.floor(Math.random() * this.array.length);
            selectedIndices.add(randomIndex);
          }
          
          // 遍历选中的索引并触发类内方法
              selectedIndices.forEach(index => {
                const selectedElement = this.list[index];
                selectedElement.strike();
              });
              }
          }
          function trigger(){
            this.timer=ps.timer.loop(800, this.randomSelect, this);
          }
     
           public onInit() {
                    block1_level4.visable=false;
                    block1_level4.signal=3;
                    block2_level4.visable=false;
                    block2_level4.signal=4;
                    let isFirstClick = 0;
                    settimeOut(trigger,2000);
                    block1_3.signal=1;
                    block2_3.signal=2;
                    block1_4.signal=5;
                    block2_4.signal=6;
                    block3_4.signal=7;
                    setDragItem(block1_3,block2_3);
                    setDragItem(block2_3,block1_3);
           }     

                        public function setDragItem(currentBlock, targetBlock) {
                            const dragItem = currentBlock.addScript("ps.DraggableItem") as ps.DraggableItem;
                            dragItem.dragSpace = DragSpace.Local;
                            dragItem.worldObj = UIRoot;
                            // dragItem.diffS = 1.1
                            dragItem.draggable = true
                            dragItem.allTriggerTargets = targetBlock
                            dragItem.triggerHide = true
                            dragItem.triggered = 0
                            dragItem.diffY = 40
                            if (targetBlock.signal == 2) {
                                ps.triggerCustomEvent({
                                    eventName: `第一次指引入场`,
                                    scene: main.sceneNodes[1]
                                })
                                this.sign = 2;
                            }
    
                            if (targetBlock.signal == 3) {
                                ps.triggerCustomEvent({
                                    eventName: `第二次指引入场`,
                                    scene: main.sceneNodes[1]
                                })
                                this.sign = 3;
                            }
    
    
                            if (targetBlock.signal == 4) {
                                ps.triggerCustomEvent({
                                    eventName: `第三次指引入场`,
                                    scene: main.sceneNodes[1]
                                })
                                this.sign = 4;
                            }
    
                            if (targetBlock.signal == 6) {
                                ps.triggerCustomEvent({
                                    eventName: `第四次指引入场`,
                                    scene: main.sceneNodes[1]
                                })
                                this.sign = 6;
                            }
                        }
                        dragItem.itemEvent.add(ps.DraggableItemEvent.onDown, () => {
                            isFirstClick++;
                           if (isFirstClick == 1) {
                            ps.sendAction(1)
                            }
                        case(this.sign){
                            case 2:
                            ps.triggerCustomEvent({
                                eventName: `第一次指引退场`,
                                scene: main.sceneNodes[1]
                            })
                            break;
                            case 3:
                            ps.triggerCustomEvent({
                                eventName: `第二次指引退场`,
                                scene: main.sceneNodes[1]
                            })
                            break;
                            case 4:
                            ps.triggerCustomEvent({
                                eventName: `第三次指引退场`,
                                scene: main.sceneNodes[1]
                            })
                            case 6:
                            ps.triggerCustomEvent({
                                eventName: `第四次指引退场`,
                                scene: main.sceneNodes[1]
                            })
                            break;
                        }

                    })
    
                    dragItem.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, (event, target: qc.Node) => {
                        case(this.sign){
                            case 2:
                            ps.triggerCustomEvent({
                                eventName: `三级合成奖励`,
                                scene: main.sceneNodes[1]
                            })
                            ps.sendAction(2)
                            if (target.signal == 2) {
                                block2_level4.visable=true;
                            setDragItem(block1_4,block2_level4);
                            setDragItem(block2_level4,block1_4);
                            this.list.splice(0,2, block2_level4);
                         }
                         if (target.signal == 1) {
                            ps.timer.once(CustomEventsTools.getEventDelayTime(
                            {
                                eventName: `三级合成奖励`,
                                scene: main.sceneNodes[1]
                            }) * 1000, () => {
                            block1_level4.visable=true;
                            setDragItem(block1_4,block1_level4);
                            setDragItem(block1_level4,block1_4);
                            this.list.splice(0,2, block1_level4);
                         })

                            break;
                            case 3:
                            ps.triggerCustomEvent({
                                eventName: `四级合成奖励`,
                                scene: main.sceneNodes[1]
                            })
                            ps.sendAction(3)

                            break;
                            case 4:
                            ps.triggerCustomEvent({
                                eventName: `四级合成奖励`,
                                scene: main.sceneNodes[1]
                            })
                            case 6:
                            ps.triggerCustomEvent({
                                eventName: `四级合成奖励`,
                                scene: main.sceneNodes[1]
                            })
                            
                            ps.timer.once(CustomEventsTools.getEventDelayTime(
                            {
                                eventName: `四级合成奖励`,
                                scene: main.sceneNodes[1]
                            }) * 1000 + 500, () => {
                       ps.triggerCustomEvent({
                                eventName: `进入结束页`,
                                scene: main.sceneNodes[1]
                            })
                    })
                            ps.sendAction(5)
                            break;
                        }

                    })
               
    
    
                */
            for (let i = 0; i < this.lists.length; i++) {
                const currentList = this.lists[i];
                for (let j = 0; j < currentList.length; j++) {
                    const [color, rank, draggable] = this.cardInfo[i][j];
                    this.initCard(currentList[j], i, j, color, rank, currentList[j - 1], currentList[j + 1], draggable)
                    const dragItem = currentList[j].getScript(ps.DraggableItem) as ps.DraggableItem;
                    dragItem.dragSpace = DragSpace.Local;
                    dragItem.worldObj = UIRoot;
                    dragItem.diffS = 1.1
                    dragItem.draggable = currentList[j].getScript(ps.card).draggable
                    dragItem.allTriggerTargets = this.lists.slice(0, 4).map(item => item[item.length - 1])
                    dragItem.triggerHide = false
                    dragItem.triggered = 0
                    dragItem.diffY = 40

                    //开始
                    dragItem.itemEvent.add(ps.DraggableItemEvent.onDown, (event, target: qc.Node) => {
                        if (this.isStart) {
                            XTween.removeAllTweens()
                            ps.triggerCustomEvent({
                                eventName: `指引退场`,
                                scene: main.sceneNodes[2]
                            })
                        }

                        ps.sendAction(1)
                        this.isStart = true
                        if (this.shake && this.shake !== currentList[j]) {
                            this.shake.anchoredX = this.shake.getScript(ps.DraggableItem).orgX
                        }
                        dragItem.allTriggerTargets = this.lists.slice(0, 4).map(item => item[item.length - 1]).filter(item => this.checkTarget(item, currentList[j]))
                    })
                    //结束
                    dragItem.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, (event, target: qc.Node) => {//命中目标
                        this.isDragRight = true
                        this.changeNode(currentList[j], target)
                    })
                    dragItem.itemEvent.add(ps.DraggableItemEvent.toOrgComplete, () => {
                        this.resetPosition(currentList[j])
                        ps.triggerCustomEvent({
                            eventName: `放置错误反馈`,
                            scene: main.sceneNodes[2]
                        })
                        this.isDragFalse = true
                        this.failAnimation(currentList[j])
                    })
                    dragItem.itemEvent.add(ps.DraggableItemEvent.onDragEnd, () => {
                        this.resetPosition(currentList[j])
                        if (this.isDragRight) {
                            ps.triggerCustomEvent({
                                eventName: `放置成功反馈`,
                                scene: main.sceneNodes[2]
                            })
                            this.checkStore()
                        }
                        if ((!this.isDragFalse && this.isFirstDrag) || this.isDragRight) {
                            const [startNode, endNode] = this.getGuidePosition()
                            this.guideStart(startNode, endNode)
                        }
                        this.isFirstDrag = true
                        this.isDragFalse = false
                        this.isDragRight = false
                    })
                    if (currentList[j + 1]) {
                        currentList[j].setPropertyIgnoreLayout({ prop: "x" })
                        currentList[j].setPropertyIgnoreLayout({ prop: "y" })
                        currentList[j + 1].setPropertyIgnoreLayout({ prop: "x" })
                        currentList[j + 1].setPropertyIgnoreLayout({ prop: "y" })
                        const tempPosition = currentList[j + 1].getWorldPosition()
                        currentList[j].addChild(currentList[j + 1])
                        const nowPosition = currentList[j].toLocal(tempPosition)// Convert world position to local position.
                        currentList[j + 1].x = nowPosition.x
                        currentList[j + 1].y = nowPosition.y
                    }
                    dragItem.deploty();
                }
            }
            this.game_btn.onDown.add(() => {
                ps.sendAction(5)
                // ps.install(ps.InstallType.None)
            })
            this.end_btn.onDown.add(() => {
                ps.sendAction(4)
                // ps.install(ps.InstallType.None)
            })
        }
        public getGuidePosition() {
            //获取指引
            const allTriggerTargets = this.lists.slice(0, 4).map(item => item[item.length - 1])
            // const order = [4,5,0, 1 ,2, 3]; // 指定顺序的数组
            const order = [5, 4, 3, 2, 1, 0]; // 指定顺序的数组
            for (let i = 0; i < this.lists.length; i++) {
                const currentList = this.lists[order[i]];//从第六列开始指引
                for (let j = 0; j < currentList.length; j++) {
                    for (let k = 0; k < allTriggerTargets.length; k++) {
                        if (order[i] !== k && this.checkTarget(allTriggerTargets[k], currentList[j]) && currentList[j].getScript(ps.card).draggable) {
                            return [currentList[j], allTriggerTargets[k]];
                        }
                    }
                }
            }
            return [null, null]
        }
        public guideStart(startNode, endNode) {
            if (!(startNode && endNode)) return
            let start = startNode.getWorldPosition()
            let end = endNode.getWorldPosition()
            let start_x
            let start_y
            if (startNode.getScript(ps.card).next_card) {
                start_y = main.sceneNodes[2].toLocal(start).y - 50
            }
            else {
                start_y = main.sceneNodes[2].toLocal(start).y
            }
            this.hand_parent.alpha = 1
            this.gf_hand.alpha = 1
            this.hand_parent.x = start_x
            this.hand_parent.y = start_y
            start_x = main.sceneNodes[2].toLocal(start).x
            ps.triggerCustomEvent({
                eventName: `指引入场`,
                scene: main.sceneNodes[2]
            })
            if (this.isDragRight) {
                xtween(this.hand_parent).delay(1000).repeat(Infinity, false, xtween(this.hand_parent).set({ x: start_x, y: start_y, alpha: 1 }).to(1000, { x: main.sceneNodes[2].toLocal(end).x, y: main.sceneNodes[2].toLocal(end).y }, { easing: ps.XTween.Easing.Cubic.InOut })
                    .to(200, { alpha: 0 })).start()
            }
            else {
                xtween(this.hand_parent).repeat(Infinity, false, xtween(this.hand_parent).set({ x: start_x, y: start_y, alpha: 1 }).to(1000, { x: main.sceneNodes[2].toLocal(end).x, y: main.sceneNodes[2].toLocal(end).y }, { easing: ps.XTween.Easing.Cubic.InOut })
                    .to(200, { alpha: 0 })).start()

            }
        }
        public checkStore() {
            this.play_time += 1
            if (GAME_CFG.jump_times && this.play_time === GAME_CFG.jump_times) {
                ps.install(ps.InstallType.None)
            }
            for (let i = 0; i < this.money.length; i++) {
                this.money[i].visible = false
            }
            this.money[this.play_time].visible = true

            this.checkEnd()
        }
        public shake: qc.Node
        public checkEnd() {
            if (GAME_CFG.success_times === 5 && this.play_time === GAME_CFG.success_times) {
                ps.sendAction(2)
                let cardback1Position = this.cardback1.getWorldPosition()
                let K1 = main.game.add.clone(this.list1[0], this.topBox)
                K1.removeChildren()
                let K1Position = this.topBox.toLocal(this.cardback1.getWorldPosition())
                K1.x = K1Position.x
                K1.y = K1Position.y
                let K2 = main.game.add.clone(this.list2[0], this.topBox)
                K2.removeChildren()
                let cardback2Position = this.cardback2.getWorldPosition()
                let K2Position = this.topBox.toLocal(cardback2Position)
                K2.x = K2Position.x
                K2.y = K2Position.y
                let targetPosition1 = this.list1[0].toLocal(cardback1Position)
                let targetPosition2 = this.list2[0].toLocal(cardback2Position)
                // let targetPosition3 = this.list3[0].toLocal(cardback2Position)
                xtween(this.list1[0]).to(300, { x: targetPosition1.x, y: targetPosition1.y, scaleY: 0 }).start()
                xtween(this.list2[0]).to(300, { x: targetPosition2.x, y: targetPosition2.y, scaleY: 0 }).start()
                // xtween(this.list3[0]).to(300, { x: targetPosition3.x, y: targetPosition3.y, scaleX: 0, scaleY: 0 }).start()

                this.game_btn.interactive = false
                this.endMoney.forEach(element => {
                    element.visible = false
                });
                this.endMoney[this.play_time].visible = true
                ps.triggerCustomEvent({
                    eventName: `游戏胜利反馈`,
                    scene: main.sceneNodes[2]

                })
                ps.triggerCustomEvent({
                    eventName: `进入结束页`,
                    scene: main.sceneNodes[2]
                })
                ps.timer.once(CustomEventsTools.getEventDelayTime(
                    {
                        eventName: `进入结束页`,
                        scene: main.sceneNodes[2]
                    }
                ) * 1000 + 500, () => {
                    ps.sendAction(3)
                })
            }
            else if (GAME_CFG.success_times >= 1 && GAME_CFG.success_times <= 4 && this.play_time === GAME_CFG.success_times) {
                ps.sendAction(2)
                for (let i = 0; i < this.lists.length; i++) {
                    const currentList = this.lists[i];
                    for (let j = 0; j < currentList.length; j++) {
                        currentList[j].interactive = false
                    }
                }
                this.endMoney.forEach(element => {
                    element.visible = false
                });
                this.endMoney[this.play_time].visible = true
                this.game_btn.interactive = false
                ps.triggerCustomEvent({
                    eventName: `游戏结束反馈`,
                    scene: main.sceneNodes[2]
                })
                ps.triggerCustomEvent({
                    eventName: `进入结束页`,
                    scene: main.sceneNodes[2]
                })
                ps.timer.once(CustomEventsTools.getEventDelayTime(
                    {
                        eventName: `进入结束页`,
                        scene: main.sceneNodes[2]
                    }
                ) * 1000 + 500, () => {
                    ps.sendAction(3)
                })
            }

        }

        public failAnimation(node: qc.Node) {
            let x = node.anchoredX
            this.shake = node
            xtween(node).
                repeat(5, false, xtween(node)
                    .to(5, { anchoredX: x + 2.5 })
                    .to(5, { anchoredX: x })
                    .to(5, { anchoredX: x - 2.5 })
                    .to(5, { anchoredX: x })
                ).start()
            XTween.removeTargetTweens(this.hand_parent)//删除目标身上所有的Tween
            const [startNode, endNode] = this.getGuidePosition()
            this.guideStart(startNode, endNode)
        }

        public isStart: boolean
        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] solitaire.onStart");
            ps.timer.once(1000, () => {
                if (!this.isStart) {
                    const [startNode, endNode] = this.getGuidePosition()
                    this.guideStart(startNode, endNode)
                }
                this.isStart = true
            })
        }
        public onResize() {
            if (this.isStart) {
                XTween.removeAllTweens()
                this.resetPosition(this.list1[0])
                this.resetPosition(this.list2[0])
                this.resetPosition(this.list3[0])
                this.resetPosition(this.list4[0])
                const [startNode, endNode] = this.getGuidePosition()
                this.guideStart(startNode, endNode)

            }
        }


        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] solitaire.onDestroy");
        }
    }
    qc.registerBehaviour("ps.solitaire", solitaire);
    solitaire["__menu"] = "玩法模板/玩法/（solitaire）";
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
