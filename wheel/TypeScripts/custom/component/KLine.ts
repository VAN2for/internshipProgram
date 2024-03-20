
function ratioYtoAxisY(y: number): number {
    return 300 - 300 * y
}

class KLine extends ps.Behaviour {

    randomMin: number = 0.2
    randomMax: number = 0.4


    /** 序列化 */
    private serializableFields: Object = {

        randomMin: qc.Serializer.NUMBER,
        randomMax: qc.Serializer.NUMBER,
        moveInterval: qc.Serializer.NUMBER,
        tweenTime: qc.Serializer.NUMBER,
        xStep: qc.Serializer.NUMBER
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);

    }

    onResize() {

    }

    onStart() {
        this.defineKLine()
        this.drawKLine()
    }

    drawingPoint: {
        startX: number,
        _x: number,
        _y: number,
        ratioY: number,
        vertexPoints: { x: number, y: number }[],
        render: Function
    }
    defineKLine() {
        const initX = 0
        const initY = 300
        const lineColor: number = 0x269efa
        const lineWidth: number = 3
        const kLine = this.gameObject as qc.Graphics
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
        kLine.lineStyle(lineWidth, lineColor)
        kLine.moveTo(initX, initY)
        // maskShape.moveTo(initX, initY)

        let _drawingPoint = this.drawingPoint
        _drawingPoint = {
            startX: initX,
            _x: initX,
            _y: 0,
            ratioY: 0,
            vertexPoints: [],
            render() {
                // 绘制走线
                kLine.lineTo(_drawingPoint._x, _drawingPoint._y)
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
        }
        // 定义get set
        Object.defineProperties(_drawingPoint, {
            "x": {
                get() {
                    return _drawingPoint._x
                },
                set(newValue) {
                    _drawingPoint._x = newValue
                    // _drawingPoint.render()
                }
            },
            "y": {
                get() {
                    return _drawingPoint.ratioY
                },
                set(newValue) {
                    _drawingPoint.ratioY = newValue
                    _drawingPoint._y = ratioYtoAxisY(newValue)
                    _drawingPoint.render()
                }
            }
        })
        this.drawingPoint = _drawingPoint
        this.drawKLine()
        this.onResize()
    }
    currentX: number = 0
    moveInterval: number = 500
    tweenTime: number = 300
    xStep: number = 50
    focusOnAxisX: number = 400
    needMoveCamera: boolean = true
    kLineTimer: qc.TimerEvent
    initRandomRange: { minNum: number, maxNum: number } = {
        minNum: this.randomMin,
        maxNum: this.randomMax
    }
    drawKLine(points?: number[], finishCallBack?: Function, stepCallBack?: Function) {
        this.stopLine()
        let pointsNumToStop: number = points && points.length
        this.kLineTimer = this.game.timer.loop(this.moveInterval, () => {
            let y: number = (points && points.length) ? points.shift() : Random.range(this.initRandomRange.minNum, this.initRandomRange.maxNum)
            this.currentX += this.xStep
            Tween.to(this.drawingPoint, {
                x: this.currentX,
                y: y
            }, this.tweenTime, Phaser.Easing.Cubic.Out).onComplete.addOnce(() => {

                // 给定数值点的时候的完成回调
                if (pointsNumToStop) {
                    pointsNumToStop--
                    if (pointsNumToStop === 0) {
                        finishCallBack && finishCallBack()
                    }
                }

                stepCallBack && stepCallBack()
            })
            if (this.currentX > this.focusOnAxisX && this.needMoveCamera) {
                Tween.to(this.gameObject, {
                    x: this.gameObject.x - this.xStep
                }, this.tweenTime, Phaser.Easing.Cubic.Out).onComplete.addOnce(() => {
                    // 去掉不可见结点优化性能
                    if (this.drawingPoint.vertexPoints.length > this.focusOnAxisX / this.xStep + 1) {
                        this.drawingPoint.startX += this.xStep
                        this.drawingPoint.vertexPoints.shift()
                    }
                })
            }

            this.drawingPoint.vertexPoints.push({ x: this.currentX, y: ratioYtoAxisY(y) })
        })
    }

    resumeKline() {
        if (this.kLineTimer) return
        else this.drawKLine()
    }

    stopLine() {
        if (this.kLineTimer) {
            this.game.timer.remove(this.kLineTimer)
            this.kLineTimer = void 0
        }
    }
}
qc.registerBehaviour('KLine', KLine);