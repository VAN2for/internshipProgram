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
function ratioYtoAxisY(y) {
    return 300 - 300 * y;
}
var KLine = /** @class */ (function (_super) {
    __extends(KLine, _super);
    function KLine(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.randomMin = 0.2;
        _this.randomMax = 0.4;
        /** 序列化 */
        _this.serializableFields = {
            randomMin: qc.Serializer.NUMBER,
            randomMax: qc.Serializer.NUMBER,
            moveInterval: qc.Serializer.NUMBER,
            tweenTime: qc.Serializer.NUMBER,
            xStep: qc.Serializer.NUMBER
        };
        _this.currentX = 0;
        _this.moveInterval = 500;
        _this.tweenTime = 300;
        _this.xStep = 50;
        _this.focusOnAxisX = 400;
        _this.needMoveCamera = true;
        _this.initRandomRange = {
            minNum: _this.randomMin,
            maxNum: _this.randomMax
        };
        return _this;
    }
    KLine.prototype.onResize = function () {
    };
    KLine.prototype.onStart = function () {
        this.defineKLine();
        this.drawKLine();
    };
    KLine.prototype.defineKLine = function () {
        var initX = 0;
        var initY = 300;
        var lineColor = 0x269efa;
        var lineWidth = 3;
        var kLine = this.gameObject;
        // const lineUI: qc.Node = UIRoot.getChild("kLineBlue")
        // const pointUI: qc.Node = kLine.addChild()
        // const labelText: qc.UIText = pointUI.getChild("labelText") as qc.UIText
        // const gradientBg: qc.UIImage = UIRoot.getChild("gradientBg") as qc.UIImage
        // const gradientBgPhaser: Phaser.Graphics = gradientBg['phaser'] as Phaser.Graphics
        // const maskShapeCon: Phaser.Group = kLine.getChild("maskShapeCon")['phaser'] as Phaser.Group
        // const gamePhaser = (this.game as any).phaser as Phaser.Game
        // const maskShape: Phaser.Graphics = gamePhaser.add.graphics(0, 0, maskShapeCon)
        // gradientBgPhaser.mask = maskShape
        // lineUI.y = pointUI.y = initY
        kLine.lineStyle(lineWidth, lineColor);
        kLine.moveTo(initX, initY);
        // maskShape.moveTo(initX, initY)
        var _drawingPoint = this.drawingPoint;
        _drawingPoint = {
            startX: initX,
            _x: initX,
            _y: 0,
            ratioY: 0,
            vertexPoints: [],
            render: function () {
                // 绘制走线
                kLine.lineTo(_drawingPoint._x, _drawingPoint._y);
                // 绘制水平线
                // lineUI.y = _drawingPoint._y
                // 绘制描点
                // pointUI.x = _drawingPoint._x
                // pointUI.y = _drawingPoint._y
                // 绘制渐变图层的遮罩
                // maskShape.clear()
                // maskShape.moveTo(_drawingPoint.startX, initY)
                // _drawingPoint.vertexPoints.length > 1 && _drawingPoint.vertexPoints.forEach(v => {
                //     maskShape.lineTo(v.x, v.y)
                // })
                // maskShape.lineTo(_drawingPoint._x, _drawingPoint._y)
                // maskShape.lineTo(_drawingPoint._x, kLine.height)
                // maskShape.lineTo(0, kLine.height)
                // maskShape.lineTo(_drawingPoint.startX, initY)
            }
        };
        // 定义get set
        Object.defineProperties(_drawingPoint, {
            "x": {
                get: function () {
                    return _drawingPoint._x;
                },
                set: function (newValue) {
                    _drawingPoint._x = newValue;
                    // _drawingPoint.render()
                }
            },
            "y": {
                get: function () {
                    return _drawingPoint.ratioY;
                },
                set: function (newValue) {
                    _drawingPoint.ratioY = newValue;
                    _drawingPoint._y = ratioYtoAxisY(newValue);
                    _drawingPoint.render();
                }
            }
        });
        this.drawingPoint = _drawingPoint;
        this.drawKLine();
        this.onResize();
    };
    KLine.prototype.drawKLine = function (points, finishCallBack, stepCallBack) {
        var _this = this;
        this.stopLine();
        var pointsNumToStop = points && points.length;
        this.kLineTimer = this.game.timer.loop(this.moveInterval, function () {
            var y = (points && points.length) ? points.shift() : Random.range(_this.initRandomRange.minNum, _this.initRandomRange.maxNum);
            _this.currentX += _this.xStep;
            Tween.to(_this.drawingPoint, {
                x: _this.currentX,
                y: y
            }, _this.tweenTime, Phaser.Easing.Cubic.Out).onComplete.addOnce(function () {
                // 给定数值点的时候的完成回调
                if (pointsNumToStop) {
                    pointsNumToStop--;
                    if (pointsNumToStop === 0) {
                        finishCallBack && finishCallBack();
                    }
                }
                stepCallBack && stepCallBack();
            });
            if (_this.currentX > _this.focusOnAxisX && _this.needMoveCamera) {
                Tween.to(_this.gameObject, {
                    x: _this.gameObject.x - _this.xStep
                }, _this.tweenTime, Phaser.Easing.Cubic.Out).onComplete.addOnce(function () {
                    // 去掉不可见结点优化性能
                    if (_this.drawingPoint.vertexPoints.length > _this.focusOnAxisX / _this.xStep + 1) {
                        _this.drawingPoint.startX += _this.xStep;
                        _this.drawingPoint.vertexPoints.shift();
                    }
                });
            }
            _this.drawingPoint.vertexPoints.push({ x: _this.currentX, y: ratioYtoAxisY(y) });
        });
    };
    KLine.prototype.resumeKline = function () {
        if (this.kLineTimer)
            return;
        else
            this.drawKLine();
    };
    KLine.prototype.stopLine = function () {
        if (this.kLineTimer) {
            this.game.timer.remove(this.kLineTimer);
            this.kLineTimer = void 0;
        }
    };
    return KLine;
}(ps.Behaviour));
qc.registerBehaviour('KLine', KLine);
