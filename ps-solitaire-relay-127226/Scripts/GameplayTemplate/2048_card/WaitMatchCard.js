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
     * 待匹配纸牌
     * @description 待匹配纸牌
     * @author jingru.wu
     * @date 2023/02/21 13:48:58
     */
    var WaitMatchCardEvent;
    (function (WaitMatchCardEvent) {
        /**
         * 每次纸牌合成触发该事件
         * @var 一共合成多少次
         * @var 从哪个纸牌开始合成
         * @var 最终合成的纸牌
         */
        WaitMatchCardEvent[WaitMatchCardEvent["update"] = 0] = "update";
        /**
         * 新卡牌生成触发该事件
         * @var 新卡牌
         */
        WaitMatchCardEvent[WaitMatchCardEvent["createNewCard"] = 1] = "createNewCard";
        /**
         * 鼠标按下
         * @var 被点击的卡牌
         * @var 鼠标按下事件(event)
         */
        WaitMatchCardEvent[WaitMatchCardEvent["cardDown"] = 2] = "cardDown";
        /**
         * 纸牌放下事件
         * @var 被放下的卡牌
         * @var 拖拽结束事件(event)
         */
        WaitMatchCardEvent[WaitMatchCardEvent["cardDragEnd"] = 3] = "cardDragEnd";
        /**
         * 纸牌匹配错误触发事件
         * @var 可拖拽卡牌
         * @var 在纸牌堆中的卡牌
         */
        WaitMatchCardEvent[WaitMatchCardEvent["cardMatchWrong"] = 4] = "cardMatchWrong";
        /**
         * 纸牌匹配成功匹配，开始合成触发该事件
         * @var 可拖拽卡牌
         * @var 在纸牌堆中的卡牌
         */
        WaitMatchCardEvent[WaitMatchCardEvent["cardMatchSuccess"] = 5] = "cardMatchSuccess";
        /**
         * 纸牌堆中每一列的头纸牌都是最高级纸牌
         */
        WaitMatchCardEvent[WaitMatchCardEvent["cardAllMatch"] = 6] = "cardAllMatch";
    })(WaitMatchCardEvent = ps.WaitMatchCardEvent || (ps.WaitMatchCardEvent = {}));
    var WaitMatchCard = /** @class */ (function (_super) {
        __extends(WaitMatchCard, _super);
        function WaitMatchCard(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 面积覆盖率 */
            _this.areaRate = 0.5;
            /** 随机生成卡牌张数 */
            _this.randCardNum = 0;
            /** 最高级纸牌节点名 */
            _this.maxCardName = 0;
            /** 可拖拽卡牌位置 */
            _this.guideCardLocationX = 0;
            _this.guideCardLocationY = 0;
            /** 等待拖拽卡牌的数组 */
            _this.waitCardX = [];
            _this.waitCardY = [];
            _this.waitCardScale = [];
            /** 卡牌放下的声音 */
            _this.sm_down = "";
            /** 卡牌合成的声音 */
            _this.sm_collect = "";
            /** 卡牌匹配错误的声音 */
            _this.sm_wrong = "";
            /** 合成的总次数 */
            _this.allTime = 0;
            /** 是否明牌 */
            _this.isLight = true;
            /** 序列化 */
            _this.serializableFields = {
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
            return _this;
        }
        WaitMatchCard.prototype.createGui = function () {
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
        };
        /** 组件被激活后执行 */
        WaitMatchCard.prototype.awake = function () {
            // console.info("[info] WaitMatchCard.awake");
        };
        /** 试玩 */
        WaitMatchCard.prototype.onInit = function () {
            var _this = this;
            // 获得最高节点
            this.cardType.children.forEach(function (el) {
                el.getScript("ps.CardMap") ||
                    ps.utils.debugAssert(false, "".concat(el.name, "\u6CA1\u6709\u6302\u8F7D\u7EC4\u4EF6cardMap"));
                _this.maxCardName = Math.max(_this.maxCardName, el.getScript("ps.CardMap").cardNum);
            });
        };
        /** 试玩初始化的处理 */
        WaitMatchCard.prototype.onStart = function () {
            this.cards = this.cardHeap.children;
            // 有纸牌直接绑定事件
            if (this.gameObject.children.length > 0) {
                var tmpNode = this.gameObject.children[this.gameObject.children.length - 1];
                tmpNode.interactive = true;
                for (var i = 0; i < this.gameObject.children.length; i++) {
                    // 鼠标按下拖动
                    this.gameObject.children[i].onDown.add(this.mouseDown, this);
                }
            }
            // 刚开始没有纸牌
            if (this.randCardNum > 0 &&
                this.gameObject.children.length < this.waitCardX.length + 1) {
                for (var i = 0; i < this.waitCardX.length + 1; i++) {
                    this.randCreateCrad();
                }
            }
        };
        /** 鼠标按下事件 */
        WaitMatchCard.prototype.mouseDown = function (node, event) {
            gameEvent.dispatch(WaitMatchCardEvent.cardDown, node, event);
            // 绑定拖拽事件
            node.onDrag.add(this.dragCard, this);
            node.onDragEnd.add(this.dragDown, this);
        };
        /** 拖动方法 */
        WaitMatchCard.prototype.dragCard = function (node, ev) {
            var _this = this;
            // 获得移动的坐标相对于卡牌父节点的位置
            var point = node.parent.toLocal(new qc.Point(ev.source.x, ev.source.y));
            node.x = point.x;
            node.y = point.y;
            this.curCard = undefined;
            this.cards.forEach(function (card) {
                card = card.children[card.children.length - 1];
                if (_this.countMulArea(node, card)) {
                    _this.curCard = card;
                    gsap.to(card, {
                        scaleY: 1.1,
                        scaleX: 1.1,
                        duration: 0.1,
                        ease: "none",
                    });
                }
                else {
                    gsap.to(card, {
                        scaleY: 1,
                        scaleX: 1,
                        duration: 0.1,
                        ease: "none",
                    });
                }
            });
        };
        /** 计算两张卡牌覆盖率 */
        WaitMatchCard.prototype.countMulArea = function (card1, card2) {
            var cardArea = card1.getWorldBox().width * card1.getWorldBox().height;
            if (Math.abs(card1.getWorldBox().x - card2.getWorldBox().x) <
                card1.getWorldBox().width &&
                Math.abs(card1.getWorldBox().y - card2.getWorldBox().y) <
                    card1.getWorldBox().height) {
                // 上
                var x1 = card1.getWorldCorners()[0].x;
                if (x1 < card2.getWorldCorners()[0].x) {
                    x1 = card2.getWorldCorners()[0].x;
                }
                // 下
                var x2 = card1.getWorldCorners()[2].x;
                if (x2 > card2.getWorldCorners()[2].x) {
                    x2 = card2.getWorldCorners()[2].x;
                }
                // 左
                var y1 = card1.getWorldCorners()[0].y;
                if (y1 < card2.getWorldCorners()[0].y) {
                    y1 = card2.getWorldCorners()[0].y;
                }
                // 右
                var y2 = card1.getWorldCorners()[2].y;
                if (y2 > card2.getWorldCorners()[2].y) {
                    y2 = card2.getWorldCorners()[2].y;
                }
                if (((x1 - x2) * (y1 - y2)) / cardArea >= this.areaRate) {
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        };
        /** 卡牌被放下 */
        WaitMatchCard.prototype.dragDown = function (node, event) {
            var _this = this;
            gameEvent.dispatch(WaitMatchCardEvent.cardDragEnd, node, event);
            // 播放放下声音
            ps.utils.playSound(this.sm_down);
            // 移除拖拽事件
            node.onDrag.remove(this.dragCard, this);
            node.onDragEnd.remove(this.dragDown, this);
            var cardName = node.name;
            // 匹配成功
            if (this.curCard) {
                this.curCard.getScript("ps.CardMap") ||
                    ps.utils.debugAssert(false, "".concat(this.curCard.name, "\u6CA1\u6709\u6302\u8F7D\u7EC4\u4EF6cardMap"));
            }
            node.getScript("ps.CardMap") ||
                ps.utils.debugAssert(false, "".concat(node.name, "\u6CA1\u6709\u6302\u8F7D\u7EC4\u4EF6cardMap"));
            if (this.curCard &&
                this.curCard.getScript("ps.CardMap").cardNum ==
                    node.getScript("ps.CardMap").cardNum) {
                gameEvent.dispatch(WaitMatchCardEvent.cardMatchSuccess, node, this.curCard);
                node.interactive = false;
                // 将拖拽过来的卡牌放入卡牌组中
                var tmpNode = this.game.add.clone(node, this.curCard.parent);
                tmpNode.x = this.curCard.parent.toLocal(node.getWorldPosition()).x;
                tmpNode.y = this.curCard.parent.toLocal(node.getWorldPosition()).y;
                node.destroy();
                node = tmpNode;
                var groupCards_1 = node.parent;
                var t = gsap.timeline({
                    defaults: { duration: 0.1, ease: "none" },
                });
                // 合成动画
                this.allTime = 0;
                this.matchAnimation(this.curCard, node, t);
                t.then(function () {
                    // 待匹配卡牌少于预定的 要随机生成新的
                    if (_this.randCardNum > 0 &&
                        _this.gameObject.children.length <= _this.waitCardX.length) {
                        _this.randCreateCrad();
                    }
                    var flag = _this.cards.every(function (c) {
                        return (c.children.length > 0 &&
                            c.children[c.children.length - 1].getScript("ps.CardMap").cardNum == _this.maxCardName);
                    });
                    if (flag) {
                        gameEvent.dispatch(WaitMatchCardEvent.cardAllMatch);
                    }
                    // 将待匹配卡牌移动到相应的位置
                    _this.moveCard();
                    // 触发update事件
                    gameEvent.dispatch(WaitMatchCardEvent.update, _this.allTime, cardName, groupCards_1.children[groupCards_1.children.length - 1].name);
                });
            }
            else {
                // 匹配错误
                this.curCard &&
                    gameEvent.dispatch(WaitMatchCardEvent.cardMatchWrong, node, this.curCard);
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
        };
        /** match动画 */
        /**
         * @description:
         * @param {qc} card 在卡牌堆的卡牌
         * @param {qc} node 拖拽的卡牌
         * @param {gsap} t 合成动画时间线
         * @return {*}
         */
        WaitMatchCard.prototype.matchAnimation = function (card, node, t) {
            var _this = this;
            var groupCard = card.parent;
            var newCard;
            this.preAni(t, card, node);
            this.allTime++;
            t.call(function () {
                // 播放合成声音
                ps.utils.playSound(_this.sm_collect);
                // 生成新卡牌
                card.getScript("ps.CardMap") ||
                    ps.utils.debugAssert(false, "".concat(card.name, "\u6CA1\u6709\u6302\u8F7DCardMap\u8282\u70B9"));
                var mergeNum = card.getScript("ps.CardMap").cardNum * 2;
                // 找到卡牌
                newCard = _this.game.add.clone(_this.findCardInType(mergeNum), groupCard);
                newCard.alpha = 1;
                newCard.visible = true;
                newCard.x = card.x;
                newCard.y = card.y;
                gameEvent.dispatch(WaitMatchCardEvent.createNewCard, newCard);
                _this.aftAni(t, card, node, newCard);
            });
            t.call(function () {
                // 合成结束，移除两个节点
                groupCard.removeChild(card);
                groupCard.removeChild(node);
                // 如果没有卡牌了或者当前卡牌与上面的卡牌不匹配 不递归
                if (groupCard.children.length >= 2 &&
                    newCard.name ==
                        groupCard.children[groupCard.children.length - 2].name) {
                    _this.matchAnimation(groupCard.children[groupCard.children.length - 2], newCard, t);
                }
            });
        };
        /** 移动卡牌 */
        WaitMatchCard.prototype.moveCard = function () {
            var _this = this;
            var len = this.gameObject.children.length;
            for (var i = len - 2, j = 0; j < this.waitCardX.length - 1 && i >= 0; i--, j++) {
                gsap.to(this.gameObject.children[i], {
                    x: this.waitCardX[j],
                    y: this.waitCardY[j],
                    scaleX: this.waitCardScale[j + 1],
                    scaleY: this.waitCardScale[j + 1],
                    duration: 0.1,
                });
            }
            var newGuideCard = this.gameObject.children.length > 0 &&
                this.gameObject.children[this.gameObject.children.length - 1];
            newGuideCard.visible = true;
            if (newGuideCard) {
                gsap.to(newGuideCard, {
                    x: this.guideCardLocationX,
                    y: this.guideCardLocationY,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.1,
                }).then(function () {
                    newGuideCard.interactive = true;
                    if (!_this.isLight) {
                        ps.utils.changeCard(newGuideCard.getScript("ps.CardMap").back, newGuideCard.getScript("ps.CardMap").front);
                    }
                });
            }
        };
        /** 随机生成卡牌 */
        WaitMatchCard.prototype.randCreateCrad = function () {
            var _this = this;
            var resCardArr = [];
            this.randCardNum--;
            this.cards.forEach(function (el) {
                el.children[el.children.length - 1].getScript("ps.CardMap") ||
                    ps.utils.debugAssert(false, "".concat(el.children[el.children.length - 1].name, "\u6CA1\u6709\u6302\u8F7D\u7EC4\u4EF6cardMap"));
                var cName = el.children[el.children.length - 1].getScript("ps.CardMap").cardNum;
                if (_this.maxCardName != cName)
                    el.children.length > 0 &&
                        resCardArr.push(el.children[el.children.length - 1]);
            });
            if (resCardArr.length == 1) {
                var cGroup = resCardArr[0].parent.children;
                for (var i = cGroup.length - 1; i > 0; i--) {
                    if (cGroup[i].getScript("ps.CardMap").cardNum * 2 !=
                        cGroup[i - 1].getScript("ps.CardMap").cardNum) {
                        var newCardNum = cGroup[i].getScript("ps.CardMap").cardNum * 2;
                        var newCard = this.findCardInType(newCardNum);
                        if (newCardNum < this.maxCardName) {
                            resCardArr.push(newCard);
                        }
                        break;
                    }
                }
                if (cGroup.length == 1 &&
                    cGroup[0].getScript("ps.CardMap").cardNum * 2 <
                        this.maxCardName) {
                    var newCardNum = cGroup[0].getScript("ps.CardMap").cardNum * 2;
                    resCardArr.push(this.findCardInType(newCardNum));
                }
            }
            // 删除已有的
            this.gameObject.children.forEach(function (card) {
                card.getScript("ps.CardMap") ||
                    ps.utils.debugAssert(false, "".concat(card.name, "\u6CA1\u6709\u6302\u8F7D\u7EC4\u4EF6cardMap"));
                var cName = card.getScript("ps.CardMap").cardNum;
                var tmpIdx = resCardArr.findIndex(function (el) {
                    el.getScript("ps.CardMap") ||
                        ps.utils.debugAssert(false, "".concat(el.name, "\u6CA1\u6709\u6302\u8F7D\u7EC4\u4EF6cardMap"));
                    return el.getScript("ps.CardMap").cardNum == cName;
                });
                tmpIdx != -1 && resCardArr.splice(tmpIdx, 1);
            });
            if (resCardArr.length == 0)
                return;
            var ranIdx = Math.floor(Math.random() * resCardArr.length);
            // 得到随机纸牌，放入待匹配节点中 并设置x、y、scale值
            var randCard = resCardArr[ranIdx];
            resCardArr.splice(ranIdx, 1);
            this.createWaitCard(randCard);
        };
        /** 根据card纸牌，放入待匹配节点中 并设置x、y、scale值 */
        WaitMatchCard.prototype.createWaitCard = function (card) {
            card = this.game.add.clone(card, this.gameObject);
            this.gameObject.setChildIndex(card, 0);
            var idx = this.gameObject.children.length - 2;
            if (idx >= this.waitCardX.length) {
                card.scaleX = this.waitCardScale[this.waitCardX.length - 1];
                card.scaleY = this.waitCardScale[this.waitCardX.length - 1];
                card.x = this.waitCardX[this.waitCardX.length - 1];
                card.y = this.waitCardY[this.waitCardX.length - 1];
                if (idx > this.waitCardX.length) {
                    card.visible = false;
                }
            }
            else if (idx == -1) {
                card.scaleX = 1;
                card.scaleY = 1;
                card.x = this.guideCardLocationX;
                card.y = this.guideCardLocationY;
                card.interactive = true;
            }
            else {
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
        };
        /** 生成新卡牌前的动画 */
        WaitMatchCard.prototype.preAni = function (t, card, node) {
            t.to(node, { x: card.x, y: card.y }) // 让拖拽的卡牌与卡牌堆的卡牌重合
                .to(card, { scaleX: 1, scaleY: 1 }, "<")
                .to(node, { scaleX: 0.8, scaleY: 0.8 })
                .to(card, { scaleX: 0.8, scaleY: 0.8 }, "<");
        };
        /** 生成新卡牌后的动画 */
        WaitMatchCard.prototype.aftAni = function (t, card, node, newCard) {
            t.fromTo(card, { scaleX: 0.8, scaleY: 0.8 }, { scaleY: 1, scaleX: 1, duration: 0.1, ease: "back.out(10)" })
                .fromTo(node, { scaleX: 0.8, scaleY: 0.8 }, {
                scaleY: 1,
                scaleX: 1,
                duration: 0.1,
                ease: "back.out(10)",
            }, "<")
                .fromTo(newCard, { scaleX: 0.8, scaleY: 0.8 }, {
                scaleY: 1,
                scaleX: 1,
                duration: 0.1,
                ease: "back.out(10)",
            }, "<")
                .fromTo(newCard, { alpha: 0 }, { alpha: 1, duration: 0.1 }, "<");
        };
        /** 改变合成动画 */
        WaitMatchCard.prototype.changeMatchAni = function (preAni, aftAni) {
            this.preAni = preAni;
            this.aftAni = aftAni;
        };
        /** 在卡牌种类中找到cardNum卡牌 */
        WaitMatchCard.prototype.findCardInType = function (num) {
            var cNNode = this.cardType.children.find(function (card) {
                card.getScript("ps.CardMap") ||
                    ps.utils.debugAssert(false, "".concat(card.name, "\u6CA1\u6709\u6302\u8F7D\u7EC4\u4EF6cardMap"));
                return card.getScript("ps.CardMap").cardNum == num;
            });
            cNNode ||
                ps.utils.debugAssert(false, "在所有预设纸牌父节点中没有找到对应数值为" + num + "的纸牌");
            return cNNode;
        };
        return WaitMatchCard;
    }(ps.Behaviour));
    ps.WaitMatchCard = WaitMatchCard;
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
})(ps || (ps = {}));
//# sourceMappingURL=WaitMatchCard.js.map