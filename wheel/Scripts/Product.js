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
     * @description
     * @author mande.Huang
     * @date 2023/11/03 10:55:25
     */
    var Product = /** @class */ (function (_super) {
        __extends(Product, _super);
        function Product(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.secondPerCycle = 500;
            _this.lastClickTime = 0;
            _this.arrTarget = [0, 1, 9];
            _this.currIndex = 0;
            _this.spinCount = 0;
            _this.turn = false;
            _this.config1 = 3; //可以点击多少次
            _this.isGuide = false;
            /** 序列化 */
            _this.serializableFields = {
                wheel: qc.Serializer.NODE,
                btn: qc.Serializer.NODE,
                btnNot: qc.Serializer.NODE,
                textList: qc.Serializer.NODES,
                clickNum: qc.Serializer.NODE,
                clickNumNot: qc.Serializer.NODE,
                reward: qc.Serializer.NODES,
                download: qc.Serializer.NODE,
                withdraw: qc.Serializer.NODE,
                endMoneyText: qc.Serializer.NODE,
                download2: qc.Serializer.NODE,
                withdraw2: qc.Serializer.NODE,
            };
            return _this;
        }
        Product.prototype.turnFuc = function (index) {
            var _this = this;
            if (!this.turn) {
                this.turn = true;
                this.btn.visible = false;
                ps.triggerCustomEvent({
                    scene: main.sceneNodes[1],
                    eventName: "点击转动反馈",
                });
                ps.xtween(this.wheel)
                    .to(CustomEventsTools.getEventDelayTime({
                    scene: main.sceneNodes[1],
                    eventName: "点击转动反馈"
                }) * 1000, { rotation: this.wheel.rotation + ps.Mathf.angleToRadian(360 * 3) + ps.Mathf.angleToRadian(Math.abs(this.arrTarget[index] - this.currIndex) * 360 / 10) }, { easing: ps.ease.SvgPathEase.create("M0,0,C0,0,0.438,0.566,0.578,0.968,0.724,1.354,1,1,1,1,") })
                    .call(function () {
                    _this.moneyChange();
                    _this.btn.visible = true;
                    if (_this.spinCount === GAME_CFG.config1) {
                        _this.btn.visible = false;
                    }
                    console.log(CustomEventsTools.getEventDelayTime({
                        scene: main.sceneNodes[1],
                        eventName: "点击转动反馈"
                    }));
                    if (_this.spinCount === GAME_CFG.config1) {
                        switch (_this.spinCount) {
                            case 1:
                                _this.endMoneyText.text = "$100";
                                break;
                            case 2:
                                _this.endMoneyText.text = "$300";
                                break;
                            case 3:
                                _this.endMoneyText.text = "$600";
                                break;
                        }
                        ps.triggerCustomEvent({
                            scene: main.sceneNodes[1],
                            eventName: "跳转结束页",
                        });
                    }
                })
                    .start();
                this.turn = false;
                this.currIndex = this.arrTarget[index];
            }
        };
        /** 组件被激活后执行 */
        Product.prototype.awake = function () {
            // console.info("[info] Product.awake");
        };
        /** 试玩初始化的处理 */
        Product.prototype.onInit = function () {
            var _this = this;
            console.log("验证是否更行");
            console.log(CustomEventsTools.getEventDelayTime({
                scene: main.sceneNodes[1],
                eventName: "点击转动反馈"
            }));
            this.textList.forEach(function (item) { item.setPropertyIgnoreLayout({ prop: "visible" }); });
            this.reward.forEach(function (item) { item.setPropertyIgnoreLayout({ prop: "visible" }); });
            (this.wheel).setPropertyIgnoreLayout({ prop: "visible" });
            (this.btn).setPropertyIgnoreLayout({ prop: "visible" });
            for (var i = 0; i < this.textList.length; i++) {
                this.textList[i].visible = false;
            }
            this.textList[0].alpha = 1;
            this.textList[0].visible = true;
            this.clickNum.text = GAME_CFG.config1.toString();
            this.clickNumNot.text = GAME_CFG.config1.toString();
            this.endMoneyText.text = "$0";
            // for (let i = 0; i < this.reward.length; i++) {
            //   this.reward[i].visible = false;
            // }
            ps.triggerCustomEvent({
                scene: main.sceneNodes[1],
                eventName: "指引入场",
            });
            this.withdraw.interactive = true;
            this.download.interactive = true;
            this.withdraw2.interactive = true;
            this.download2.interactive = true;
            this.withdraw.onClick.add(function () {
                ps.sendAction(6);
            });
            this.download.onClick.add(function () {
                ps.sendAction(7);
            });
            this.withdraw2.onClick.add(function () {
                ps.sendAction(4);
                ps.install(ps.InstallType.None);
            });
            this.download2.onClick.add(function () {
                ps.sendAction(5);
                ps.install(ps.InstallType.None);
            });
            this.btn.interactive = true;
            this.btn.onDown.add(function () {
                if (_this.turn)
                    return;
                if (_this.spinCount < GAME_CFG.config1) {
                    clearInterval(_this.timer);
                    _this.timer = null;
                    //指引退场
                    if (_this.isGuide) {
                        ps.triggerCustomEvent({
                            scene: main.sceneNodes[1],
                            eventName: "无操作指引退场",
                        });
                    }
                    if (_this.spinCount == 0) {
                        ps.triggerCustomEvent({
                            scene: main.sceneNodes[1],
                            eventName: "指引退场",
                        });
                    }
                    _this.turnFuc(_this.spinCount); //开启转动
                    _this.spinCount++;
                }
                if (GAME_CFG.config != 0 && _this.spinCount == GAME_CFG.config) { //额外跳转次数
                    ps.install(ps.InstallType.None);
                }
            });
        };
        Product.prototype.moneyChange = function () {
            var _this = this;
            this.textList[this.spinCount].alpha = 0;
            this.textList[this.spinCount].visible = true;
            ps.sendAction(this.spinCount);
            ps.xtween(this.textList[this.spinCount - 1])
                .to(200, { alpha: 0 })
                .call(function () {
                ps.xtween(_this.textList[_this.spinCount])
                    .to(200, { alpha: 1 }).start();
                ps.xtween(_this.textList[_this.spinCount])
                    .to(200, { scaleX: 1, scaleY: 1.1 }, { easing: ps.ease.SvgPathEase.create("M0, 0, C0.208, 0, 0.298, 1, 0.5, 1, 0.69, 1, 0.796, 0, 1, 0,") }).start();
            })
                .call(function () {
                ps.triggerCustomEvent({
                    scene: main.sceneNodes[1],
                    eventName: "\u7B2C".concat(_this.spinCount, "\u6B21\u5956\u52B1\u53CD\u9988"),
                });
            })
                .delay(CustomEventsTools.getEventDelayTime({
                scene: main.sceneNodes[1],
                eventName: "\u7B2C".concat(this.spinCount, "\u6B21\u5956\u52B1\u53CD\u9988"),
            }) * 1000)
                .call(function () {
                _this.lastClickTime = Date.now();
                if (GAME_CFG.config2 !== 0) {
                    _this.timer = setInterval(function () {
                        if (Date.now() - _this.lastClickTime > GAME_CFG.config2 * 1000) {
                            _this.isGuide = true;
                            ps.triggerCustomEvent({
                                scene: main.sceneNodes[1],
                                eventName: "无操作指引入场",
                            });
                            clearInterval(_this.timer);
                        }
                    }, 100); //每一百毫秒执行一次  如果有1秒钟没点击就让事件函数触发，和手指按钮触发
                }
            })
                .start();
            this.btn.visible = false;
            this.clickNum.text = (GAME_CFG.config1 - this.spinCount).toString();
            this.clickNumNot.text = (GAME_CFG.config1 - this.spinCount).toString();
        };
        /** 试玩开始时的处理 */
        Product.prototype.onStart = function () {
            // console.info("[info] Product.onStart");
        };
        /** 当脚本被移除时，会自动调用 */
        Product.prototype.onDestroy = function () {
            // console.info("[info] Product.onDestroy");
        };
        return Product;
    }(ps.Behaviour));
    ps.Product = Product;
    qc.registerBehaviour("ps.Product", Product);
    Product["__menu"] = "玩法模板/玩法/（Product）";
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
// .to(this.secondPerCycle * 3 + Math.abs(this.arrTarget[index] - this.currIndex) * this.secondPerCycle / 10, { rotation: this.wheel.rotation + Mathf.angleToRadian(360 * 3) + Mathf.angleToRadian(Math.abs(this.arrTarget[index] - this.currIndex) * 360 / 10) }
// , { easing: ease.SvgPathEase.create("M0,0,C0,0,0.438,0.566,0.578,0.968,0.724,1.354,1,1,1,1,") })
//# sourceMappingURL=Product.js.map