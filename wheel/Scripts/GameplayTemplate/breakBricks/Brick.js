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
     * @author zhen.liang
     * @date 2023/02/06 15:31:02
     */
    var Brick = /** @class */ (function (_super) {
        __extends(Brick, _super);
        function Brick(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 生命值 */
            _this.hitPoint = 1;
            /** box2d碰撞形状 */
            _this.type = "WidthHeight";
            /** 是否根据行列及宽高重设节点XY */
            _this.resetXYFlag = false;
            /** 序列化 */
            _this.serializableFields = {
                BrickControlNode: qc.Serializer.NODE,
                textNode: qc.Serializer.NODE,
                imageNode: qc.Serializer.NODE,
                type: qc.Serializer.STRING,
                specie: qc.Serializer.STRING,
                hitPoint: qc.Serializer.NUMBER,
                hitPointKey: qc.Serializer.STRING,
                resetXYFlag: qc.Serializer.BOOLEAN,
                line: qc.Serializer.NUMBER,
                column: qc.Serializer.NUMBER,
                contactAudio: qc.Serializer.NODE,
            };
            return _this;
        }
        Brick.prototype.createGui = function () {
            return {
                BrickControlNode: {
                    title: "控制器节点",
                    component: "node",
                },
                imageNode: {
                    title: "图片节点",
                    component: "node",
                },
                textNode: {
                    title: "文本节点",
                    component: "node",
                },
                type: {
                    title: "碰撞区域及形状",
                    component: "select",
                    field: {
                        options: [
                            {
                                value: "radio",
                                label: "圆形"
                            },
                            {
                                value: "rectangle",
                                label: "矩形"
                            },
                            {
                                value: "Edge",
                                label: "实际像素"
                            },
                            {
                                value: "WidthHeight",
                                label: "实际宽高矩形"
                            },
                        ]
                    }
                },
                specie: {
                    title: "种类",
                    component: "input", // 数字控件
                },
                hitPoint: {
                    title: "生命值",
                    component: "input",
                    field: {
                        type: "number"
                    }
                },
                contactAudio: {
                    title: "被撞击时播放音乐节点",
                    component: "node", // 数字控件
                },
                hitPointKey: {
                    title: "生命值key",
                    component: "input", // 数字控件
                },
                resetXYFlag: {
                    title: "是否根据宽高及行列设置节点位置",
                    component: "switch", // 数字控件
                },
                line: {
                    title: "行数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                column: {
                    title: "列数",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        };
        Brick.prototype.awake = function () {
            this.box2dBodyInit();
            if (this.resetXYFlag) {
                this.gameObject.pivotX = 0;
                this.gameObject.pivotY = 0;
                this.gameObject.anchoredX = (this.column - 1) * this.gameObject.width;
                this.gameObject.anchoredY = (this.line - 1) * this.gameObject.height;
            }
        };
        /** 试玩初始化的处理 */
        Brick.prototype.onInit = function () {
            this.BrickControl = this.BrickControlNode.getScript("ps.BrickControl");
            this.imageNode.name = this.specie;
            if (this.specie.length > 0)
                this.imageNode.name = this.specie;
            /** 添加震动组件 */
            this.shake = this.gameObject.addScript("ps.Shake");
        };
        /** 试玩开始时的处理 */
        Brick.prototype.onStart = function () {
            var _this = this;
            /** 砖块初始化 start */
            this.BrickControl.setBrickMap(this.line, this.column, {
                node: this.gameObject,
                specie: this.specie,
            });
            this.box2dBodyInit();
            if (this.hitPointKey && Number.isFinite(GAME_CFG === null || GAME_CFG === void 0 ? void 0 : GAME_CFG[this.hitPointKey]))
                this.hitPoint = GAME_CFG[this.hitPointKey];
            this.textNode.text = this.hitPoint + "";
            /** 砖块初始化 end */
            var prev = this.game.time.now;
            this.Box2d.onContact.add(function (e) {
                if (!e.isBeginning)
                    return;
                if (_this.game.time.now - prev < 1)
                    return;
                prev = _this.game.time.now;
                _this.reduceHitPoint();
            });
        };
        /** 碰撞后处理函数 */
        Brick.prototype.reduceHitPoint = function () {
            this.shake.play(0.2);
            if (this.contactAudio)
                ps.AudioTrigger.playSound(this.contactAudio, true, false, 1);
            this.hitPoint--;
            this.textNode.text = this.hitPoint + "";
            if (this.hitPoint === 0) {
                this.BrickControl.deleteBrick(this.line, this.column);
            }
        };
        /** 重新设置砖块的碰撞区域 */
        Brick.prototype.resetPolygonVertices = function (key, number) {
            var _this = this;
            var _a;
            if (number === void 0) { number = 3; }
            var resetFunction = {
                /** 圆形 */
                Circle: function () {
                    _this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.CIRCLE;
                    _this.Box2d.resetFixtureShape();
                },
                /** 实际像素 */
                Edge: function () {
                    _this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.POLYGON;
                    _this.Box2d.resetShapeFromEdge(number);
                },
                /** 矩形 */
                Bounds: function () {
                    _this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.POLYGON;
                    _this.Box2d.resetShapeFromBounds();
                },
                /** 实际宽高矩形 */
                WidthHeight: function () {
                    _this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.POLYGON;
                    var box = _this.gameObject.getChild(_this.specie);
                    var _a = _this.getWH(), width = _a.width, height = _a.height;
                    var path = [];
                    var offsetXY = [
                        [-1, -1],
                        [1, -1],
                        [1, 1],
                        [-1, 1],
                    ];
                    for (var i = 0; i < 4; i++) {
                        path.push(new qc.Point(0.5 + (width * offsetXY[i][0]) / box.width / 2, 0.5 + (height * offsetXY[i][1]) / box.height / 2));
                    }
                    var res = _this.Box2d.setPolygonVertices(path, true);
                    if (!res)
                        resetFunction.Bounds();
                },
                /** 节点宽高圆形 */
                WHCircle: function () {
                    var _a = _this.getWH(), width = _a.width, height = _a.height;
                    _this.gameObject.width = width;
                    _this.gameObject.height = height;
                    _this.Box2d.fixtureType = qc.Box2D.FIXTURE_TYPE.CIRCLE;
                    _this.Box2d.resetFixtureShape();
                },
                /** 默认矩形渲染 */
                default: function () {
                    resetFunction.Bounds();
                },
            };
            (_a = resetFunction[key]) === null || _a === void 0 ? void 0 : _a.call(resetFunction);
        };
        /** 根据图片节点获取实际宽高 */
        Brick.prototype.getWH = function () {
            var box = this.imageNode;
            var geomUtil = box2d.geomUtil;
            var nodes = geomUtil.marchingSquares(box);
            nodes = geomUtil.RDPsd(nodes, 3);
            var minx = 1000, maxx = 0, miny = 1000, maxy = 0;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].x < minx)
                    minx = nodes[i].x;
                if (nodes[i].x > maxx)
                    maxx = nodes[i].x;
                if (nodes[i].y < miny)
                    miny = nodes[i].y;
                if (nodes[i].y > maxy)
                    maxy = nodes[i].y;
            }
            var width = maxx - minx;
            var height = maxy - miny;
            return { width: width, height: height };
        };
        /** box2d初始化 */
        Brick.prototype.box2dBodyInit = function () {
            var _this = this;
            var _a, _b;
            (_a = this.gameObject.getScript("qc.Box2D.Body")) === null || _a === void 0 ? void 0 : _a.destroy();
            (_b = this.imageNode.getScript("qc.Box2D.Body")) === null || _b === void 0 ? void 0 : _b.destroy();
            this.Box2d =
                this.type === "Circle"
                    ? this.gameObject.addScript("qc.Box2D.Body")
                    : this.imageNode.addScript("qc.Box2D.Body");
            this.Box2d.onBodyCreated.addOnce(function () {
                _this.resetPolygonVertices(_this.type);
                _this.Box2d.friction = 0;
                _this.Box2d.restitution = 0;
            });
        };
        /**
         * 设置box2d.Body属性
         *
         * @param options :{box2d属性：box2d值}
         */
        Brick.prototype.setBodyAttribute = function (options) {
            var _this = this;
            this.Box2d.onBodyCreated.addOnce(function () {
                options.keys(function (key) {
                    var _a;
                    if ((_a = _this.Box2d) === null || _a === void 0 ? void 0 : _a[key])
                        _this.Box2d[key] = options[key];
                });
            });
        };
        return Brick;
    }(ps.Behaviour));
    ps.Brick = Brick;
    qc.registerBehaviour("ps.Brick", Brick);
    Brick["__menu"] = "玩法模板/打砖块玩法/砖块（Brick）";
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
//# sourceMappingURL=Brick.js.map