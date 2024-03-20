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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ps;
(function (ps) {
    /**
     *
     * @description
     * @author yongyuan.liao
     * @date 2023/10/09 10:20:47
     */
    var solitaire = /** @class */ (function (_super) {
        __extends(solitaire, _super);
        function solitaire(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 序列化 */
            _this.serializableFields = {
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
            // public cardInfo = [[[true, 13, true], [false, 12, true], [true, 11, true], [false, 10, true], [true, 9, true], [false, 8, true], [true, 7, true]],
            // [[false, 13, true], [true, 12, true], [false, 11, true], [true, 10, true], [false, 9, true], [true, 8, true]],
            // [[true, 4, false], [false, 3, false], [true, 5, false], [false, 1, false], [true, 6, true], [false, 5, true], [true, 4, true]],
            // [[false, 3, true]], [[false, 7, true]], [[true, 2, true]]]
            _this.cardInfo = [[[true, 13, true], [false, 12, true], [true, 11, true], [false, 10, true], [true, 9, true], [false, 8, true]], [[false, 13, true], [true, 12, true], [false, 11, true], [true, 10, true], [false, 9, true], [true, 8, true]],
                [[true, 6, true], [false, 5, true], [true, 4, true], [false, 3, true]], [[true, 2, false], [true, 7, true]], [[false, 7, true]], [[false, 1, true]]];
            _this.isDragRight = false;
            _this.isDragFalse = false;
            _this.isFirstDrag = false;
            return _this;
        }
        /** 组件被激活后执行 */
        solitaire.prototype.awake = function () {
            // console.info("[info] solitaire.awake");
        };
        // public list_num: number     //第几列
        // public arr_index: number    //第几个
        // public color: boolean       //颜色,红为true
        // public rank: number         //点数
        // public pre_card: qc.Node    //上一张
        // public next_card: qc.Node   //下一张
        // public draggable: boolean   //是否可拖拽
        solitaire.prototype.initCard = function (currentCard, list_num, arr_index, color, rank, pre_card, next_card, draggable) {
            currentCard.getScript(ps.card).list_num = list_num;
            currentCard.getScript(ps.card).arr_index = arr_index;
            currentCard.getScript(ps.card).color = color;
            currentCard.getScript(ps.card).rank = rank;
            currentCard.getScript(ps.card).pre_card = pre_card;
            currentCard.getScript(ps.card).next_card = next_card;
            currentCard.getScript(ps.card).draggable = draggable;
        };
        solitaire.prototype.checkTarget = function (node, dragNode) {
            if (!node)
                return;
            var node_card = node.getScript(ps.card);
            var dragNode_card = dragNode.getScript(ps.card);
            if (node_card.color !== dragNode_card.color && dragNode_card.rank + 1 === node_card.rank) {
                return true;
            }
            else {
                return false;
            }
        };
        solitaire.prototype.checkDraggable = function (node) {
            var preNode = node.getScript(ps.card).pre_card;
            if (!preNode)
                return;
            if (this.checkTarget(preNode, node)) {
                preNode.getScript(ps.card).draggable = true;
                this.checkDraggable(preNode);
            }
            return;
        };
        solitaire.prototype.resetPosition = function (node) {
            if (!node)
                return;
            var nextNode = node.getScript(ps.card).next_card;
            if (!nextNode)
                return;
            nextNode.x = node.x;
            nextNode.y = node.y;
            nextNode.anchoredX = 0;
            nextNode.anchoredY = 50;
            nextNode.getScript(ps.DraggableItem).orgX = 0;
            nextNode.getScript(ps.DraggableItem).orgY = 50;
            this.resetPosition(nextNode);
            return;
        };
        solitaire.prototype.changeNode = function (dragNode, targetNode) {
            var _a;
            //改节点
            targetNode.addChild(dragNode);
            //改位置
            dragNode.x = targetNode.x;
            dragNode.y = targetNode.y;
            dragNode.anchoredX = 0;
            dragNode.anchoredY = 50;
            dragNode.getScript(ps.DraggableItem).orgX = 0;
            dragNode.getScript(ps.DraggableItem).orgY = 50;
            var dragListIndex = dragNode.getScript(ps.card).list_num;
            var targetListIndex = targetNode.getScript(ps.card).list_num;
            var dragNodeIndex = dragNode.getScript(ps.card).arr_index;
            var targetNodeIndex = targetNode.getScript(ps.card).arr_index;
            //改数组
            var elementsToMove = this.lists[dragListIndex].splice(dragNodeIndex);
            (_a = this.lists[targetListIndex]).splice.apply(_a, __spreadArray([targetNodeIndex + 1, 0], __read(elementsToMove), false));
            //改属性
            var dragPreNode = dragNode.getScript(ps.card).pre_card;
            if (dragPreNode) {
                dragPreNode.getScript(ps.card).draggable = true;
                dragPreNode.getScript(ps.card).next_card = null;
                this.checkDraggable(dragPreNode);
            }
            targetNode.getScript(ps.card).next_card = dragNode;
            dragNode.getScript(ps.card).pre_card = targetNode;
            for (var i = 0; i < this.lists[targetListIndex].length; i++) {
                this.lists[targetListIndex][i].getScript(ps.card).list_num = targetListIndex;
                this.lists[targetListIndex][i].getScript(ps.card).arr_index = i;
            }
            this.setDragItem();
        };
        solitaire.prototype.setDragItem = function () {
            var _this = this;
            var _loop_1 = function (i) {
                var currentList = this_1.lists[i];
                var _loop_2 = function (j) {
                    var dragItem = currentList[j].getScript(ps.DraggableItem);
                    dragItem.dragSpace = ps.DragSpace.Local;
                    dragItem.worldObj = UIRoot;
                    dragItem.diffS = 1.1; /** 拖拽时缩放倍数 */
                    dragItem.draggable = currentList[j].getScript(ps.card).draggable;
                    dragItem.allTriggerTargets = this_1.lists.slice(0, 4).map(function (item) { return item[item.length - 1]; });
                    dragItem.triggerHide = false;
                    dragItem.triggered = 0; //命中目标后的操作
                    dragItem.diffY = 40; /** 拖拽时y偏移值 */
                    ///开始
                    dragItem.itemEvent.removeAll();
                    dragItem.itemEvent.add(ps.DraggableItemEvent.onDown, function (event, target) {
                        ps.XTween.removeAllTweens();
                        ps.triggerCustomEvent({
                            eventName: "\u6307\u5F15\u9000\u573A",
                            scene: main.sceneNodes[2]
                        });
                        if (_this.shake && _this.shake !== currentList[j]) { //this.shake = failanimation的node
                            _this.shake.anchoredX = _this.shake.getScript(ps.DraggableItem).orgX;
                        } //"filter" 是一个数组方法，用于筛选过滤数组中符合特定条件的元素并返回一个新的数组。"map" 是一个数组方法，用于对数组中的每个元素进行操作并返回一个新的数组。
                        dragItem.allTriggerTargets = _this.lists.slice(0, 4).map(function (item) { return item[item.length - 1]; }).filter(function (item) { return _this.checkTarget(item, currentList[j]); });
                    });
                    //结束
                    dragItem.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, function (event, target) {
                        _this.isDragRight = true;
                        _this.changeNode(currentList[j], target);
                    });
                    dragItem.itemEvent.add(ps.DraggableItemEvent.toOrgComplete, function () {
                        _this.resetPosition(currentList[j]);
                        ps.triggerCustomEvent({
                            eventName: "\u653E\u7F6E\u9519\u8BEF\u53CD\u9988",
                            scene: main.sceneNodes[2]
                        });
                        _this.isDragFalse = true;
                        _this.failAnimation(currentList[j]); //振动
                    });
                    dragItem.itemEvent.add(ps.DraggableItemEvent.onDragEnd, function () {
                        _this.resetPosition(currentList[j]);
                        if (_this.isDragRight) {
                            ps.triggerCustomEvent({
                                eventName: "\u653E\u7F6E\u6210\u529F\u53CD\u9988",
                                scene: main.sceneNodes[2]
                            });
                            _this.checkStore();
                        }
                        if ((!_this.isDragFalse && _this.isFirstDrag) || _this.isDragRight) {
                            var _a = __read(_this.getGuidePosition(), 2), startNode = _a[0], endNode = _a[1];
                            _this.guideStart(startNode, endNode);
                        }
                        _this.isFirstDrag = true;
                        _this.isDragFalse = false;
                        _this.isDragRight = false;
                    });
                    dragItem.deploty();
                };
                for (var j = 0; j < currentList.length; j++) {
                    _loop_2(j);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.lists.length; i++) {
                _loop_1(i);
            }
        };
        // public list_num: number     //第几列
        // public arr_index: number    //第几个
        // public color: boolean       //颜色,红为true
        // public rank: number         //点数
        // public pre_card: qc.Node    //上一张
        // public next_card: qc.Node   //下一张
        // public draggable: boolean   //是否可拖拽
        /** 试玩初始化的处理 */
        solitaire.prototype.onInit = function () {
            var _this = this;
            main.testSolitaire = this;
            this.lists = [this.list1, this.list2, this.list3, this.list4, this.list5, this.list6];
            this.board.addScript("ps.DraggableItem");
            var dragItem1 = this.board.getScript(ps.DraggableItem);
            dragItem1.dragSpace = ps.DragSpace.Local;
            dragItem1.worldObj = UIRoot;
            dragItem1.diffS = 1.1;
            dragItem1.draggable = true;
            dragItem1.allTriggerTargets = this.lists.slice(0, 4).map(function (item) { return item[item.length - 1]; });
            dragItem1.triggerHide = false;
            dragItem1.triggered = 0;
            dragItem1.diffY = 40;
            this.play_time = 0;
            dragItem1.itemEvent.add(ps.DraggableItemEvent.onDown, function (event, target) {
                // alert("down")
            });
            dragItem1.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, function (event, target) {
                // alert("命中目标")
                console.log("命中目标");
            });
            dragItem1.itemEvent.add(ps.DraggableItemEvent.onDragEnd, function () {
                console.log("拖拽结束");
            });
            dragItem1.itemEvent.add(ps.DraggableItemEvent.toOrgComplete, function () {
                console.log("返回原处完成时");
            });
            dragItem1.deploty();
            var _loop_3 = function (i) {
                var currentList = this_2.lists[i];
                var _loop_4 = function (j) {
                    var _a = __read(this_2.cardInfo[i][j], 3), color = _a[0], rank = _a[1], draggable = _a[2];
                    this_2.initCard(currentList[j], i, j, color, rank, currentList[j - 1], currentList[j + 1], draggable);
                    var dragItem = currentList[j].getScript(ps.DraggableItem);
                    dragItem.dragSpace = ps.DragSpace.Local;
                    dragItem.worldObj = UIRoot;
                    dragItem.diffS = 1.1;
                    dragItem.draggable = currentList[j].getScript(ps.card).draggable;
                    dragItem.allTriggerTargets = this_2.lists.slice(0, 4).map(function (item) { return item[item.length - 1]; });
                    dragItem.triggerHide = false;
                    dragItem.triggered = 0;
                    dragItem.diffY = 40;
                    //开始
                    dragItem.itemEvent.add(ps.DraggableItemEvent.onDown, function (event, target) {
                        if (_this.isStart) {
                            ps.XTween.removeAllTweens();
                            ps.triggerCustomEvent({
                                eventName: "\u6307\u5F15\u9000\u573A",
                                scene: main.sceneNodes[2]
                            });
                        }
                        ps.sendAction(1);
                        _this.isStart = true;
                        if (_this.shake && _this.shake !== currentList[j]) {
                            _this.shake.anchoredX = _this.shake.getScript(ps.DraggableItem).orgX;
                        }
                        dragItem.allTriggerTargets = _this.lists.slice(0, 4).map(function (item) { return item[item.length - 1]; }).filter(function (item) { return _this.checkTarget(item, currentList[j]); });
                    });
                    //结束
                    dragItem.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, function (event, target) {
                        _this.isDragRight = true;
                        _this.changeNode(currentList[j], target);
                    });
                    dragItem.itemEvent.add(ps.DraggableItemEvent.toOrgComplete, function () {
                        _this.resetPosition(currentList[j]);
                        ps.triggerCustomEvent({
                            eventName: "\u653E\u7F6E\u9519\u8BEF\u53CD\u9988",
                            scene: main.sceneNodes[2]
                        });
                        _this.isDragFalse = true;
                        _this.failAnimation(currentList[j]);
                    });
                    dragItem.itemEvent.add(ps.DraggableItemEvent.onDragEnd, function () {
                        _this.resetPosition(currentList[j]);
                        if (_this.isDragRight) {
                            ps.triggerCustomEvent({
                                eventName: "\u653E\u7F6E\u6210\u529F\u53CD\u9988",
                                scene: main.sceneNodes[2]
                            });
                            _this.checkStore();
                        }
                        if ((!_this.isDragFalse && _this.isFirstDrag) || _this.isDragRight) {
                            var _a = __read(_this.getGuidePosition(), 2), startNode = _a[0], endNode = _a[1];
                            _this.guideStart(startNode, endNode);
                        }
                        _this.isFirstDrag = true;
                        _this.isDragFalse = false;
                        _this.isDragRight = false;
                    });
                    if (currentList[j + 1]) {
                        currentList[j].setPropertyIgnoreLayout({ prop: "x" });
                        currentList[j].setPropertyIgnoreLayout({ prop: "y" });
                        currentList[j + 1].setPropertyIgnoreLayout({ prop: "x" });
                        currentList[j + 1].setPropertyIgnoreLayout({ prop: "y" });
                        var tempPosition = currentList[j + 1].getWorldPosition();
                        currentList[j].addChild(currentList[j + 1]);
                        var nowPosition = currentList[j].toLocal(tempPosition); // Convert world position to local position.
                        currentList[j + 1].x = nowPosition.x;
                        currentList[j + 1].y = nowPosition.y;
                    }
                    dragItem.deploty();
                };
                for (var j = 0; j < currentList.length; j++) {
                    _loop_4(j);
                }
            };
            var this_2 = this;
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
            for (var i = 0; i < this.lists.length; i++) {
                _loop_3(i);
            }
            this.game_btn.onDown.add(function () {
                ps.sendAction(5);
                // ps.install(ps.InstallType.None)
            });
            this.end_btn.onDown.add(function () {
                ps.sendAction(4);
                // ps.install(ps.InstallType.None)
            });
        };
        solitaire.prototype.getGuidePosition = function () {
            //获取指引
            var allTriggerTargets = this.lists.slice(0, 4).map(function (item) { return item[item.length - 1]; });
            // const order = [4,5,0, 1 ,2, 3]; // 指定顺序的数组
            var order = [5, 4, 3, 2, 1, 0]; // 指定顺序的数组
            for (var i = 0; i < this.lists.length; i++) {
                var currentList = this.lists[order[i]]; //从第六列开始指引
                for (var j = 0; j < currentList.length; j++) {
                    for (var k = 0; k < allTriggerTargets.length; k++) {
                        if (order[i] !== k && this.checkTarget(allTriggerTargets[k], currentList[j]) && currentList[j].getScript(ps.card).draggable) {
                            return [currentList[j], allTriggerTargets[k]];
                        }
                    }
                }
            }
            return [null, null];
        };
        solitaire.prototype.guideStart = function (startNode, endNode) {
            if (!(startNode && endNode))
                return;
            var start = startNode.getWorldPosition();
            var end = endNode.getWorldPosition();
            var start_x;
            var start_y;
            if (startNode.getScript(ps.card).next_card) {
                start_y = main.sceneNodes[2].toLocal(start).y - 50;
            }
            else {
                start_y = main.sceneNodes[2].toLocal(start).y;
            }
            this.hand_parent.alpha = 1;
            this.gf_hand.alpha = 1;
            this.hand_parent.x = start_x;
            this.hand_parent.y = start_y;
            start_x = main.sceneNodes[2].toLocal(start).x;
            ps.triggerCustomEvent({
                eventName: "\u6307\u5F15\u5165\u573A",
                scene: main.sceneNodes[2]
            });
            if (this.isDragRight) {
                ps.xtween(this.hand_parent).delay(1000).repeat(Infinity, false, ps.xtween(this.hand_parent).set({ x: start_x, y: start_y, alpha: 1 }).to(1000, { x: main.sceneNodes[2].toLocal(end).x, y: main.sceneNodes[2].toLocal(end).y }, { easing: ps.XTween.Easing.Cubic.InOut })
                    .to(200, { alpha: 0 })).start();
            }
            else {
                ps.xtween(this.hand_parent).repeat(Infinity, false, ps.xtween(this.hand_parent).set({ x: start_x, y: start_y, alpha: 1 }).to(1000, { x: main.sceneNodes[2].toLocal(end).x, y: main.sceneNodes[2].toLocal(end).y }, { easing: ps.XTween.Easing.Cubic.InOut })
                    .to(200, { alpha: 0 })).start();
            }
        };
        solitaire.prototype.checkStore = function () {
            this.play_time += 1;
            if (GAME_CFG.jump_times && this.play_time === GAME_CFG.jump_times) {
                ps.install(ps.InstallType.None);
            }
            for (var i = 0; i < this.money.length; i++) {
                this.money[i].visible = false;
            }
            this.money[this.play_time].visible = true;
            this.checkEnd();
        };
        solitaire.prototype.checkEnd = function () {
            if (GAME_CFG.success_times === 5 && this.play_time === GAME_CFG.success_times) {
                ps.sendAction(2);
                var cardback1Position = this.cardback1.getWorldPosition();
                var K1 = main.game.add.clone(this.list1[0], this.topBox);
                K1.removeChildren();
                var K1Position = this.topBox.toLocal(this.cardback1.getWorldPosition());
                K1.x = K1Position.x;
                K1.y = K1Position.y;
                var K2 = main.game.add.clone(this.list2[0], this.topBox);
                K2.removeChildren();
                var cardback2Position = this.cardback2.getWorldPosition();
                var K2Position = this.topBox.toLocal(cardback2Position);
                K2.x = K2Position.x;
                K2.y = K2Position.y;
                var targetPosition1 = this.list1[0].toLocal(cardback1Position);
                var targetPosition2 = this.list2[0].toLocal(cardback2Position);
                // let targetPosition3 = this.list3[0].toLocal(cardback2Position)
                ps.xtween(this.list1[0]).to(300, { x: targetPosition1.x, y: targetPosition1.y, scaleY: 0 }).start();
                ps.xtween(this.list2[0]).to(300, { x: targetPosition2.x, y: targetPosition2.y, scaleY: 0 }).start();
                // xtween(this.list3[0]).to(300, { x: targetPosition3.x, y: targetPosition3.y, scaleX: 0, scaleY: 0 }).start()
                this.game_btn.interactive = false;
                this.endMoney.forEach(function (element) {
                    element.visible = false;
                });
                this.endMoney[this.play_time].visible = true;
                ps.triggerCustomEvent({
                    eventName: "\u6E38\u620F\u80DC\u5229\u53CD\u9988",
                    scene: main.sceneNodes[2]
                });
                ps.triggerCustomEvent({
                    eventName: "\u8FDB\u5165\u7ED3\u675F\u9875",
                    scene: main.sceneNodes[2]
                });
                ps.timer.once(CustomEventsTools.getEventDelayTime({
                    eventName: "\u8FDB\u5165\u7ED3\u675F\u9875",
                    scene: main.sceneNodes[2]
                }) * 1000 + 500, function () {
                    ps.sendAction(3);
                });
            }
            else if (GAME_CFG.success_times >= 1 && GAME_CFG.success_times <= 4 && this.play_time === GAME_CFG.success_times) {
                ps.sendAction(2);
                for (var i = 0; i < this.lists.length; i++) {
                    var currentList = this.lists[i];
                    for (var j = 0; j < currentList.length; j++) {
                        currentList[j].interactive = false;
                    }
                }
                this.endMoney.forEach(function (element) {
                    element.visible = false;
                });
                this.endMoney[this.play_time].visible = true;
                this.game_btn.interactive = false;
                ps.triggerCustomEvent({
                    eventName: "\u6E38\u620F\u7ED3\u675F\u53CD\u9988",
                    scene: main.sceneNodes[2]
                });
                ps.triggerCustomEvent({
                    eventName: "\u8FDB\u5165\u7ED3\u675F\u9875",
                    scene: main.sceneNodes[2]
                });
                ps.timer.once(CustomEventsTools.getEventDelayTime({
                    eventName: "\u8FDB\u5165\u7ED3\u675F\u9875",
                    scene: main.sceneNodes[2]
                }) * 1000 + 500, function () {
                    ps.sendAction(3);
                });
            }
        };
        solitaire.prototype.failAnimation = function (node) {
            var x = node.anchoredX;
            this.shake = node;
            ps.xtween(node).
                repeat(5, false, ps.xtween(node)
                .to(5, { anchoredX: x + 2.5 })
                .to(5, { anchoredX: x })
                .to(5, { anchoredX: x - 2.5 })
                .to(5, { anchoredX: x })).start();
            ps.XTween.removeTargetTweens(this.hand_parent); //删除目标身上所有的Tween
            var _a = __read(this.getGuidePosition(), 2), startNode = _a[0], endNode = _a[1];
            this.guideStart(startNode, endNode);
        };
        /** 试玩开始时的处理 */
        solitaire.prototype.onStart = function () {
            var _this = this;
            // console.info("[info] solitaire.onStart");
            ps.timer.once(1000, function () {
                if (!_this.isStart) {
                    var _a = __read(_this.getGuidePosition(), 2), startNode = _a[0], endNode = _a[1];
                    _this.guideStart(startNode, endNode);
                }
                _this.isStart = true;
            });
        };
        solitaire.prototype.onResize = function () {
            if (this.isStart) {
                ps.XTween.removeAllTweens();
                this.resetPosition(this.list1[0]);
                this.resetPosition(this.list2[0]);
                this.resetPosition(this.list3[0]);
                this.resetPosition(this.list4[0]);
                var _a = __read(this.getGuidePosition(), 2), startNode = _a[0], endNode = _a[1];
                this.guideStart(startNode, endNode);
            }
        };
        /** 当脚本被移除时，会自动调用 */
        solitaire.prototype.onDestroy = function () {
            // console.info("[info] solitaire.onDestroy");
        };
        return solitaire;
    }(ps.Behaviour));
    ps.solitaire = solitaire;
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
})(ps || (ps = {}));
//# sourceMappingURL=solitaire.js.map