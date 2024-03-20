namespace ps {
    /**
     * 拖尾组件
     * @description 用于游戏中的拖尾效果，如：拖拽屏幕拖尾、指引拖尾
     * @author JingBin
     */
    export class Trail extends ps.Behaviour {
        /** 是否拖拽屏幕拖尾 */
        isDragEff: boolean = true
        /** 每帧跟随目标拖尾 */
        target: qc.Node
        /** 目标透明度小于多少时不跟随 */
        alphaMinNotEff: number = 1
        /** 效果宽度 */
        width: number = 40
        /** 效果颜色 */
        color: qc.Color = new qc.Color('#ffffff')
        /** 消失时间 */
        duration: number = 300
        /** 延迟消失时间 */
        delay: number = 0

        /** 是否Y轴缩小消失 */
        scaleYEffect = true
        /** 是否透明度降低消失 */
        alphaEffect = false

        /** 前一次X轴 */
        private preX: number
        /** 前一次Y轴 */
        private preY: number

        constructor(gameObject: qc.Node) {
            super(gameObject)
        }

        /** 序列化 */
        private serializableFields: Object = {
            isDragEff: qc.Serializer.BOOLEAN,
            target: qc.Serializer.NODE,
            width: qc.Serializer.NUMBER,
            alphaMinNotEff: qc.Serializer.NUMBER,
            color: qc.Serializer.COLOR,
            duration: qc.Serializer.NUMBER,
            delay: qc.Serializer.NUMBER,
            scaleYEffect: qc.Serializer.BOOLEAN,
            alphaEffect: qc.Serializer.BOOLEAN,
        }

        awake() {
            this.alphaMinNotEff = Math.max(Math.min(this.alphaMinNotEff, 1), 0)
        }

        update() {
            if (!this.target || !this.target.visible || this.target.alpha < this.alphaMinNotEff || !this.target.parent) return
            // const p = ps.Tools.transPos(this.target, this.gameObject)
            const p = this.gameObject.toLocal(this.target.parent.toGlobal(new qc.Point(this.target.x, this.target.y)));
            this.pos(p.x, p.y)
        }

        /** 试玩初始化的处理 */
        onInit() {
            //ps.Print.purple('Trail.onInit')
        }

        /** 试玩开始时的处理 */
        onStart() {
            //ps.Print.purple('Trail.onStart')
        }

        onDown() {
            if (this.isDragEff) this.reset()
        }

        onDrag(e: qc.DragEvent) {
            if (!this.isDragEff) return
            const p = e.source as qc.Pointer
            const p1 = this.gameObject.toLocal(new qc.Point(p.x, p.y))
            this.pos(p1.x, p1.y)
        }

        reset() {
            this.preX = null
            this.preY = null
        }
        /** 设置新位置 */
        pos(x: number, y: number) {
            if (!this.preX) {
                this.preX = x
                this.preY = y
                return
            }
            const long = ps.Mathf.getDistance(this.preX, this.preY, x, y)
            if (long === 0) return this

            const ag = ps.Mathf.getRadian(this.preX, this.preY, x, y)
            this.emit(x, y, ag, long)
            this.preX = x
            this.preY = y
            return this
        }
        private emit(x: number, y: number, rotation: number, long: number,) {
            let p = new SParticle(this.game, this.gameObject, long, this.width, this.color)
            p.x = x
            p.y = y
            p.rotation = rotation
            p.play(this.duration, this.delay, this.scaleYEffect, this.alphaEffect)
            this.gameObject.addChild(p)
            if (this.target && this.target.parent === this.gameObject) this.gameObject.setChildIndex(p, this.gameObject.getChildIndex(this.target))
        }
    }
    qc.registerBehaviour('ps.Trail', Trail)
    Trail['__menu'] = 'Custom/Trail'

    class SParticle extends qc.Graphics {
        constructor(game: qc.Game, parent: qc.Node, long: number, width: number, color?: qc.Color) {
            super(game, parent)
            // this.lineStyle(0)
            this.beginFill(color.toNumber())
            this.drawRect(-long, -width / 2, long, width)
            this.drawCircle(-long, 0, width)
            // this.drawPolygon(0, -25, [0, 0, 0, 50, -long * 1.5, 25], "#ffffff", undefined, 0)
            // this.cacheAs = "bitmap"

            // const cacheAsBitmap = this.addScript('qc.CacheAsBitmap') as qc.CacheAsBitmap
            // cacheAsBitmap.cacheType = qc.CacheAsBitmap.CACHE_FOR_SELF
            // cacheAsBitmap.boundsType = qc.CacheAsBitmap.BOUNDS_ALL
            // cacheAsBitmap.boundsInScreen = true
            // cacheAsBitmap.dirty = false

            this.endFill()
        }
        play(duration: number, delay: number = 0, hasScaleY: boolean, hasAlpha: boolean) {
            let props: any = {}
            if (hasScaleY) props.scaleY = 0
            if (hasAlpha) props.alpha = 0
            ps.Tween.to(this, props, duration, void 0, delay).onComplete.addOnce(this.removeSelf, this)
        }
    }
}
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