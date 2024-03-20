/** 贝塞尔曲线事件 */
enum BezierEvent {
    THROW_START = "throwStart", //开始抛射
};

/**
 * 贝塞尔曲线组件
 * @description 可用于绘制贝塞尔曲线，得到贝塞尔曲线轨迹上所有的点
 * @author JingBin
 */

namespace ps {
    export class Bezier extends ps.Behaviour {
        articleTexture: qc.Texture; //抛射物体纹理
        articleScale: number = 1; //抛射物体缩放值
        orgPot: qc.Point = new qc.Point(0, 0); //初始点
        powerPot: qc.Point = new qc.Point(0, 0); //牵扯点
        tarPot: qc.Point = new qc.Point(0, 0); //目标点
        color: qc.Color = new qc.Color([255, 0, 0]); //抛物线颜色
        lineLen: number = 360; //线的长度
        potCntMax: number = 20; //画线点的最大数量

        public speedX: number = 2; //抛射X轴速度
        public speedY: number = -2; //抛射Y轴速度

        public article: qc.UIImage; //抛射物体
        private articlePool: qc.UIImage[] = []; //抛射物体池

        public graphics: qc.Graphics = new qc.Graphics(qc_game, this.gameObject); //绘图面板
        public curPot: qc.Point = new qc.Point(); //当前点

        private allPot: qc.Point[] = []; //抛射物体轨迹上所有的点

        public eventDisp: ps.EventDispatcher = new ps.EventDispatcher();

        /** 序列化 */
        private serializableFields: Object = {
            articleTexture: qc.Serializer.TEXTURE,
            articleScale: qc.Serializer.NUMBER,
            orgPot: qc.Serializer.POINT,
            powerPot: qc.Serializer.POINT,
            tarPot: qc.Serializer.POINT,
            color: qc.Serializer.COLOR,
            lineLen: qc.Serializer.NUMBER,
            potCntMax: qc.Serializer.NUMBER,
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
            // this.runInEditor = true; 
        }

        awake() {
            this.gameObject.removeChildren();
            this.initBezier();
            this.refresh();
        }

        refresh() {
            this.createArticle();
            this.drawPath();
        }

        public set factor(value: number) {
            let x: number = (1 - value) * (1 - value) * this.orgPot.x + 2 * value * (1 - value) * this.powerPot.x + value * value * this.tarPot.x;
            let y: number = (1 - value) * (1 - value) * this.orgPot.y + 2 * value * (1 - value) * this.powerPot.y + value * value * this.tarPot.y;

            x = Mathf.keepDecimal(x, 0);
            y = Mathf.keepDecimal(y, 0);

            this.curPot.x = x;
            this.curPot.y = y;

            this.allPot.push(new qc.Point(x, y));
        }

        private initBezier() {
            main.gameEvent.remove(JoystickEvent.ON_DOWN, this.chgAngle, this);
            main.gameEvent.remove(JoystickEvent.ON_DRAG, this.chgAngle, this);
            main.gameEvent.remove(JoystickEvent.ON_UP, this.joystickUp, this);

            main.gameEvent.add(JoystickEvent.ON_DOWN, this.chgAngle, this);
            main.gameEvent.add(JoystickEvent.ON_DRAG, this.chgAngle, this);
            main.gameEvent.add(JoystickEvent.ON_UP, this.joystickUp, this);
        }

        private joystickUp() {
            this.throwStart();
        }

        private createArticle() {
            if (this.articleTexture && !this.gameObject.getChildByName("article")) {
                let article: qc.UIImage;
                while (!article && this.articlePool && this.articlePool.length > 0) {
                    article = this.articlePool.shift();
                }
                if (!article) {
                    article = new qc.UIImage(this.game, this.gameObject);
                }

                this.article = article;
                this.article.texture = this.articleTexture;
                this.article.resetNativeSize();
                this.article.pivotX = .5;
                this.article.pivotY = .5;
                this.article.scaleX = this.article.scaleY = this.articleScale;
                this.gameObject.setChildIndex(this.article, 0);
                this.article.name = "article";
            }
        }

        private throwStart(): boolean {
            if (!this.article) {
                return;
            }
            this.article["speedX"] = this.speedX;
            this.article["speedY"] = this.speedY;

            this.eventDisp.dispatch(BezierEvent.THROW_START, this.article, this.speedX, this.speedY, 0, this.allPot);
            return true;
        }

        /**
         * 已知某一点坐标，旋转角度，长度，求另一点坐标
         * @param orgPot 
         * @param angle 
         * @param len 
         */
        private calculateCoordinatePoint(orgPot: qc.Point, angle: number, len: number) {
            const pot = new qc.Point(len, 0);
            //计算某一点旋转后的坐标点，这里假设传入的点为原点
            const relativeOriginPoint = this.calculateRotate(pot, angle);
            //计算相对坐标系的坐标
            const points = this.calculateCoordinateRelativePoint(orgPot, relativeOriginPoint);
            return points;
        }

        /**
         * 计算某一点旋转后的坐标点
         * @param pot
         * @param angle
         */
        private calculateRotate(pot: qc.Point, angle: number) {
            let x = pot.x * Math.cos(angle * Math.PI / 180) + pot.y * Math.sin(angle * Math.PI / 180);
            let y = pot.x * Math.sin(angle * Math.PI / 180) + pot.y * Math.cos(angle * Math.PI / 180);
            const relativeOrgPot = new qc.Point(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
            return relativeOrgPot;
        }

        /**
         * 计算相对坐标系的坐标
         * @param orgPot 
         * @param relativeOrgPot 
         */
        private calculateCoordinateRelativePoint(orgPot: qc.Point, relativeOrgPot: qc.Point) {
            const x = relativeOrgPot.x + orgPot.x;
            const y = relativeOrgPot.y + orgPot.y;
            const points = new qc.Point(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
            return points;
        }

        private chgAngle(x: number, y: number, angle?: number, dist?: number, circleRadius?: number, ballRadius?: number, stageX?: number, stageY?: number): void {
            // if (x < 0) {
            //     return;
            // }
            // if (y < 0) {
            //     return;
            // }
            const lineDist = this.lineLen;

            // const potA = this.gameObject.parent.toGlobal(new qc.Point(this.gameObject.x, this.gameObject.y));
            // const potC = new qc.Point(stageX, stageY);
            const potA = new qc.Point(0, 0);
            const potC = new qc.Point(x, y);
            const a = Math.abs(potC.x - potA.x);
            const c = Math.abs(potC.y - potA.y);

            angle = Math.atan2(potC.y - potA.y, potC.x - potA.x);

            const tarPot = this.calculateCoordinatePoint(this.orgPot, Mathf.radianToAngle(angle), lineDist);

            // console.log("chgAngle", stageX, stageY, tarPot);

            if (stageX != void 0 && stageY != void 0) {
                if (!this.tarPot) {
                    this.tarPot = new qc.Point(tarPot.x, tarPot.y);
                } else {
                    this.tarPot.x = tarPot.x;
                    this.tarPot.y = tarPot.y;
                }
                this.drawPath();
            }

            this.speedX = tarPot.x * .02;
            this.speedY = tarPot.y * .02;

            this.chgArticle(angle);
        }

        private chgArticle(angle: number) {
            // let angle: number;
            // if (stageX != void 0 && stageY != void 0) {
            //     const potA = this.gameObject.parent.toGlobal(new qc.Point(this.gameObject.x, this.gameObject.y));
            //     const potC = new qc.Point(stageX, stageY);
            //     const a = Math.abs(potC.x - potA.x);
            //     const c = Math.abs(potC.y - potA.y);

            //     angle = Math.atan2(potC.y - potA.y, potC.x - potA.x);
            // } else {
            //     // angle = Math.atan2(this.speedY, this.speedX);
            // }

            this.createArticle();
            if (this.article) {
                this.article.rotation = angle + 90 * Math.PI / 180;
            }
        }

        private secondPot: qc.Point;

        /** 绘制路径 */
        private drawPath(): void {
            if (!this.tarPot) {
                return;
            }

            this.allPot = [];
            this.graphics.clear();

            // this.drawPot(this.orgPot);
            // this.drawPot(this.powerPot);
            // this.drawPot(this.tarPot);

            const stepCount: number = this.potCntMax;
            for (var i: number = 0; i < stepCount; i++) {
                this.factor = (i + 1) / stepCount;
                // console.log("x=" + this.current.x + "  y=" + this.current.y);
                this.drawPot(this.curPot);
                if (i === 1) {
                    this.secondPot = new qc.Point(this.curPot.x, this.curPot.y);
                }
            }

            if (this.secondPot) {
                this.chgAngle(this.secondPot.x, this.secondPot.y);
            }

            // console.log(this.allPot);
        }

        private drawPot(pot: qc.Point) {
            const sp: qc.Graphics = this.graphics;
            sp.beginFill(this.color.toNumber(), 1);
            sp.drawCircle(pot.x, pot.y, 10);
            sp.endFill();
            if (!sp.parent) {
                this.gameObject.addChild(sp);
            }
        }
    }
    qc.registerBehaviour('ps.Bezier', Bezier);
    Bezier["__menu"] = 'Custom/Bezier';
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