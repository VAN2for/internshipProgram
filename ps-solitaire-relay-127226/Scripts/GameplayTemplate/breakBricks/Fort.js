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
     * @date 2023/02/07 15:34:59
     */
    var Fort = /** @class */ (function (_super) {
        __extends(Fort, _super);
        function Fort(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 是否启用速度检查 */
            _this.speedCheckFlag = true;
            /** 序列化 */
            _this.serializableFields = {
                bulletNode: qc.Serializer.NODE,
                bulletNumNode: qc.Serializer.NODE,
                guidebulletNode: qc.Serializer.NODE,
                DragNode: qc.Serializer.NODE,
                recycleNode: qc.Serializer.NODE,
                bulletNumKey: qc.Serializer.STRING,
                bulletNumber: qc.Serializer.NUMBER,
                minRadian: qc.Serializer.NUMBER,
                maxRadian: qc.Serializer.NUMBER,
                speedBase: qc.Serializer.NUMBER,
                speedCheckFlag: qc.Serializer.BOOLEAN,
                reflectionNum: qc.Serializer.INT,
            };
            /** 小球节点池子 */
            _this.bulletArr = [];
            /** 是否可玩 */
            _this.canPlay = true;
            /** 小球发射起始位置 */
            _this.bulletStartXY = [_this.gameObject.x, _this.gameObject.y];
            /** 炮台位置 */
            _this.fortX = _this.gameObject.x;
            /** 引导小球池子 */
            _this.guideBulletArr = [];
            return _this;
        }
        Fort.prototype.createGui = function () {
            return {
                bulletNode: {
                    title: "小球节点",
                    component: "node", // 数字控件
                },
                bulletNumNode: {
                    title: "小球数量文本节点",
                    component: "node", // 数字控件
                },
                guidebulletNode: {
                    title: "引导小球节点",
                    component: "node", // 数字控件
                },
                DragNode: {
                    title: "触控节点",
                    component: "node", // 数字控件
                },
                recycleNode: {
                    title: "碰撞回收节点",
                    component: "node", // 数字控件
                },
                bulletNumber: {
                    title: "小球数量",
                    component: "input", // 数字控件
                },
                minRadian: {
                    title: "最小偏转角",
                    component: "input", // 数字控件
                },
                maxRadian: {
                    title: "最大偏转角",
                    component: "input", // 数字控件
                },
                speedBase: {
                    title: "小球发射速度(m/s)",
                    component: "input", // 数字控件
                },
                reflectionNum: {
                    title: "引导小球反弹次数",
                    component: "input", // 数字控件
                },
                bulletNumKey: {
                    title: "小球数量key",
                    component: "input", // 数字控件
                },
                speedCheckFlag: {
                    title: "是否启用速度检查",
                    component: "switch", // 数字控件
                },
            };
        };
        /** 试玩初始化的处理 */
        Fort.prototype.onInit = function () {
            /** 小球数量初始化 */
            if (this.bulletNumKey && Number.isFinite(GAME_CFG === null || GAME_CFG === void 0 ? void 0 : GAME_CFG[this.bulletNumKey]))
                this.bulletNumber = GAME_CFG[this.bulletNumKey];
            if (Number.isNaN(this.bulletNumber) || this.bulletNumber < 0)
                console.warn("小球数量小于0或小球数量为NaN");
            this.bulletStartNum = this.bulletNumber;
            this.bulletNumNode.text = String(this.bulletStartNum);
            /** 小球池子初始化 */
            var bullet = this.bulletNode;
            bullet.visible = false;
            this.bulletArr.push(bullet);
            for (var i = 1; i < this.bulletStartNum; i++) {
                var bulletClone = this.game.add.clone(bullet);
                this.bulletArr.push(bulletClone);
            }
            /** 引导小球初始化 */
            var index = this.guidebulletNode.parent.getChildIndex(this.guidebulletNode);
            this.guidebulletParent = this.game.add.node(this.guidebulletNode.parent);
            this.guidebulletParent.parent.setChildIndex(this.guidebulletParent, index);
            this.guidebulletNode.parent.removeChild(this.guidebulletNode);
            this.guidebulletParent.addChild(this.guidebulletNode);
            this.guideBulletArr.push(this.guidebulletNode);
        };
        /** 试玩开始时的处理 */
        Fort.prototype.onStart = function () {
            var _this = this;
            /** 手指按下 */
            this.DragNode.onDown.add(function () { });
            /** 手指滑动 */
            this.DragNode.onDrag.add(function (node, e) {
                if (!_this.canPlay)
                    return;
                var _a = _this.gameObject.getWorldPosition(), x = _a.x, y = _a.y;
                /** 当前偏转角 */
                var Radian = ps.Mathf.getRadian(x, y, e.source.x, e.source.y) +
                    ps.Mathf.angleToRadian(90);
                if (Radian <= ps.Mathf.angleToRadian(_this.maxRadian) &&
                    Radian >= ps.Mathf.angleToRadian(_this.minRadian)) {
                    _this.gameObject.rotation = Radian;
                    _this.generatingPaths(Radian);
                }
            });
            /** 手指抬起 */
            this.DragNode.onUp.add(function () {
                _this.guidebulletParent.visible = false;
                if (_this.canPlay) {
                    _this.bulletStartXY = [_this.gameObject.x, _this.gameObject.y];
                    _this.launchBullet();
                }
            });
        };
        /** 发射所有球 */
        Fort.prototype.launchBullet = function () {
            var _this = this;
            this.canPlay = false;
            this.bulletNumber = this.bulletStartNum;
            /** 发射速度 */
            var speed = this.speedBase;
            /** 发射角度 */
            var rotation = this.gameObject.rotation;
            /** 发射线速度 */
            var linearVelocity = new Phaser.Point(ps.Mathf.keepDecimal(speed * Math.sin(rotation), 5), -ps.Mathf.keepDecimal(speed * Math.cos(rotation), 5));
            /** 小球发射位置 */
            var x = this.bulletStartXY[0] + 100 * Math.sin(rotation);
            var y = this.bulletStartXY[1] - 100 * Math.cos(rotation);
            /** 小球发射器 */
            var i = 1;
            var bulletTimer = ps.timer.loop(20, function () {
                if (i > _this.bulletStartNum || _this.bulletArr.length < 1) {
                    ps.timer.remove(bulletTimer);
                    _this.fortBackRotationAni(_this.gameObject).start();
                    return;
                }
                i++;
                _this.launchABullet(x, y, linearVelocity);
            });
        };
        /** 发射单个球 */
        Fort.prototype.launchABullet = function (x, y, linearVelocity) {
            var _this = this;
            this.bulletNumNode.text = String(--this.bulletNumber);
            var bullet = this.bulletArr.shift();
            bullet.parent.setChildIndex(bullet, 0);
            bullet.x = x;
            bullet.y = y;
            bullet.visible = true;
            var box = bullet.getScript("qc.Box2D.Body");
            box.onBodyCreated.add(function () {
                box.groupIndex = -1;
            });
            box.linearVelocity = linearVelocity;
            var prev = this.game.time.now;
            var end = false;
            /** 碰撞后处理函数 */
            var handler = function (e) {
                if (!e.isBeginning)
                    return;
                if (_this.game.time.now - prev < 1)
                    return;
                prev = _this.game.time.now;
                // 速度和方向保底机制
                box.linearVelocity = _this.speedCheck(box.linearVelocity);
                var object = e.gameObjectA.name === _this.bulletNode.name
                    ? e.gameObjectB
                    : e.gameObjectA;
                /** 回收球结束 */
                if (_this.recycleNode && object.name === _this.recycleNode.name) {
                    box.onContact.remove(handler);
                    end = true;
                    var oldLinearVelocity = box.linearVelocity;
                    /** 速度相对倍率 */
                    var MoveSpeed = Math.sqrt(Math.pow(oldLinearVelocity.x, 2) + Math.pow(oldLinearVelocity.y, 2)) /
                        _this.speedBase;
                    box.linearVelocity = new Phaser.Point(0, 0);
                    /** 小球位移回炮台 */
                    _this.moveAni(bullet, _this.fortX, MoveSpeed)
                        .call(function () {
                        bullet.visible = false;
                        _this.bulletArr.push(bullet);
                        _this.bulletNumNode.text = String(++_this.bulletNumber);
                        if (_this.bulletNumber === _this.bulletStartNum) {
                            _this.canPlay = true;
                        }
                    })
                        .start();
                }
            };
            box.onContact.add(handler);
            box.onPreSolve.add(function () {
                if (end)
                    return;
                box.linearVelocity = _this.speedCheck(box.linearVelocity);
                _this.recycleBullet(bullet);
            });
        };
        /** 生成总引导线路 */
        Fort.prototype.generatingPaths = function (Radian) {
            var _a;
            this.guidebulletParent.visible = true;
            var launchPoint = this.gameObject.getWorldPosition(), //发射点坐标
            normal, //法向量
            radian = Radian, //发射角度
            lenSum = 0; //引导小球总数
            for (var i = 0; i < this.reflectionNum + 1; i++) {
                var len = void 0;
                (_a = this.generatingPath(launchPoint, radian, lenSum), len = _a.len, launchPoint = _a.CollisionPoint, normal = _a.normal);
                radian = this.calculateReflectionRadian(radian, normal);
                lenSum += len;
            }
            /** 对于引导小球池子中未使用到的小球进行隐藏 */
            for (var i = lenSum; i < this.guideBulletArr.length; i++)
                this.guideBulletArr[i].visible = false;
        };
        /** 生成引导一条线路 */
        Fort.prototype.generatingPath = function (Point, Radian, start) {
            var CollisionEvent = this.getFirstCollisionPoint(Point, Radian);
            var CollisionNode = CollisionEvent.gameObject;
            var CollisionPoint = CollisionEvent.point;
            var normal = CollisionEvent.normal;
            var fortPath = ps.Mathf.pointListByDensity(Point.x, Point.y, CollisionPoint.x, CollisionPoint.y, 10);
            /** 当引导小球池子中小球不够时进行补充 */
            if (this.guideBulletArr.length < fortPath.length + start) {
                var guidebulletBase = this.guideBulletArr[0];
                for (var i = this.guideBulletArr.length; i <= fortPath.length + start; i++) {
                    var guidebulletClone = this.game.add.clone(guidebulletBase);
                    this.guideBulletArr.push(guidebulletClone);
                }
            }
            for (var i = 0; i < fortPath.length; i++) {
                var guideBullet = this.guideBulletArr[i + start];
                var xy = guideBullet.parent.toLocal(new qc.Point(fortPath[i].x, fortPath[i].y));
                guideBullet.x = xy.x;
                guideBullet.y = xy.y;
                guideBullet.visible = true;
            }
            return { CollisionPoint: CollisionPoint, CollisionNode: CollisionNode, len: fortPath.length, normal: normal };
        };
        /** 速度检查 保底机制 */
        Fort.prototype.speedCheck = function (speedPoint) {
            if (!this.speedCheckFlag)
                return speedPoint;
            var newSpeed = new Phaser.Point(speedPoint.x, speedPoint.y);
            var speed = Math.sqrt(Math.pow(speedPoint.x, 2) + Math.pow(speedPoint.y, 2));
            if (speed < this.speedBase) {
                newSpeed.x = (this.speedBase * speedPoint.x) / speed;
                newSpeed.y = (this.speedBase * speedPoint.y) / speed;
            }
            if (Math.abs(speedPoint.y) < 0.5) {
                newSpeed.y = speedPoint.y > 0 ? 1 : -1;
            }
            return newSpeed;
        };
        /** 小球飞出世界回收 */
        Fort.prototype.recycleBullet = function (bullet) {
            var bulletWorldXY = bullet.getWorldPosition();
            if (bulletWorldXY.x < -20 ||
                bulletWorldXY.x > this.game.width + 20 ||
                bulletWorldXY.y < -20 ||
                bulletWorldXY.y > this.game.height + 20) {
                var point = bullet.parent.toLocal(this.gameObject.getWorldPosition());
                bullet.visible = false;
                bullet.x = point.x;
                bullet.y = point.y;
                this.bulletNumNode.text = String(++this.bulletNumber);
                this.bulletArr.push(bullet);
            }
        };
        /**
         * 获取第一个碰撞点
         * @param Point qc.Point 起始点坐标（世界坐标）
         * @param rotation number 入射角
         * @returns
         */
        Fort.prototype.getFirstCollisionPoint = function (Point, rotation) {
            var startPos = Point;
            // 设置射线的终点:
            var offsetY = -ps.Mathf.keepDecimal(Math.cos(rotation) * 3000, 3);
            var offsetX = ps.Mathf.keepDecimal(Math.sin(rotation) * 3000, 3);
            var endPos = new qc.Point(startPos.x + offsetX, startPos.y + offsetY);
            // 创建出射线，射线的返回值是射线与刚体碰撞的数组：
            var arr = box2d.raycast(startPos.x, startPos.y, endPos.x, endPos.y, true, undefined);
            return arr === null || arr === void 0 ? void 0 : arr[0];
        };
        /**
         * 计算反射角（弧度）
         * @param radian 入射角
         * @param normal 法向量
         * @returns number 反射角
         */
        Fort.prototype.calculateReflectionRadian = function (radian, normal) {
            var inVector = new Phaser.Point(Math.cos(radian + 1.5 * Math.PI), Math.sin(radian + 1.5 * Math.PI));
            var outVector = new Phaser.Point(inVector.x - 2 * inVector.x * normal.x * normal.x, inVector.y - 2 * inVector.y * normal.y * normal.y);
            /** 向量归一 */
            outVector.x =
                outVector.x / Math.sqrt(Math.pow(outVector.x, 2) + Math.pow(outVector.y, 2));
            outVector.y =
                outVector.y / Math.sqrt(Math.pow(outVector.x, 2) + Math.pow(outVector.y, 2));
            var outRadian = Math.acos(outVector.x);
            if (outVector.y < 0)
                outRadian = 2 * Math.PI - outRadian;
            return outRadian - 1.5 * Math.PI;
        };
        /** 位移动画 */
        Fort.prototype.moveAni = function (node, toX, speed) {
            if (speed === void 0) { speed = 1; }
            var xt = ps.xtween(node);
            var time = Math.abs(ps.Mathf.keepDecimal((toX - node.x) / 800, 3)) / speed;
            xt.to(time * 1000, { x: toX, rotation: 0 }, { easing: ps.XTween.Easing.Sinusoidal.Out });
            return xt;
        };
        /** 炮台回正动画 */
        Fort.prototype.fortBackRotationAni = function (node) {
            var nodeXt = ps.xtween(node);
            var time = 0.3;
            nodeXt.to(time * 1000, { rotation: 0 }, { easing: ps.XTween.Easing.Quintic.In });
            return nodeXt;
        };
        return Fort;
    }(ps.Behaviour));
    ps.Fort = Fort;
    qc.registerBehaviour("ps.Fort", Fort);
    Fort["__menu"] = "玩法模板/打砖块玩法/炮台（Fort）";
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
//# sourceMappingURL=Fort.js.map