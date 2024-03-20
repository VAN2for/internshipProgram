/** 抛物线事件 */
enum ParabolaEvent {
    THROW_START = "throwStart", //开始抛射
};

/** 抛射控制类型 */
enum ParabolaType {
    JOYSTICK = 0, //摇杆控制
    MOUSE_UP = 1, //鼠标离开
    TIME_LOOP = 2, //按时间间隔循环
};

/**
 * 抛物线组件
 * @description 绘制抛物线，可用于物体抛射
 * @author JingBin
 */
namespace ps {
    export class Parabola extends ps.Behaviour {
        articleTexture: qc.Texture; //抛射物体纹理
        articleScale: number = 1; //抛射物体缩放值
        gravity: number = 0; //物体重力

        parabolaAuto: boolean = false; //是否自动抛射物体
        parabolaParent: qc.Node; //自动抛射父级节点

        parabolaInterval: number = 1000; //自动抛射时间间隔
        parabolaTimeMin: number = 0; //自动抛射最小时间
        parabolaLittleTime: number = 0; //自动抛射递减时间

        private _parabolaType: ParabolaType = ParabolaType.JOYSTICK; //抛射类型

        public speedX: number = 2; //抛射X轴速度
        public speedY: number = -2; //抛射Y轴速度
        public speedMin: { x: number, y: number } = { x: 1, y: -5 }; //抛射速度最小值
        public speedMax: { x: number, y: number } = { x: 3, y: -3 }; //抛射速度最大值

        public color: qc.Color = new qc.Color([255, 0, 0]); //抛物线颜色

        public article: qc.UIImage; //抛射物体
        public articleParabola: qc.UIImage[] = []; //抛射中的物体
        private articlePool: qc.UIImage[] = []; //抛射物体池
        private shapes: qc.Graphics[] = []; //抛物线绘制圆点

        private parabolaTimer: qc.TimerEvent;

        private awaked: boolean;

        public eventDisp: ps.EventDispatcher = new ps.EventDispatcher();

        /** 序列化 */
        private serializableFields: Object = {
            articleTexture: qc.Serializer.TEXTURE,
            articleScale: qc.Serializer.NUMBER,
            gravity: qc.Serializer.NUMBER,
            speedX: qc.Serializer.NUMBER,
            speedY: qc.Serializer.NUMBER,
            parabolaAuto: qc.Serializer.BOOLEAN,
            parabolaParent: qc.Serializer.NODE,
            parabolaInterval: qc.Serializer.NUMBER,
            parabolaTimeMin: qc.Serializer.NUMBER,
            parabolaLittleTime: qc.Serializer.NUMBER,
            _parabolaType: qc.Serializer.NUMBER,
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
            // this.runInEditor = true;
        }

        awake() {
            this.awaked = true;
            this.initParabolaType();
            this.refresh();
        }

        update() {
            if (this.parabolaType === ParabolaType.JOYSTICK) {
                return;
            }
            this.updateWeapon();
        }

        refresh() {
            this.gameObject.children.forEach((child: qc.Graphics) => {
                if (child) {
                    if (child.clear) {
                        child.clear();
                    }
                    child.destroy();
                }
            });
            this.shapes = [];

            this.createArticle();
            // this.drawPath();
        }

        public get parabolaType(): ParabolaType {
            return this._parabolaType;
        }
        public set parabolaType(type: ParabolaType) {
            if (type != void 0) {
                this._parabolaType = type;
            }
            this.initParabolaType();
        }

        private initParabolaType() {
            if (!this.awaked) {
                return;
            }
            main.gameEvent.remove(JoystickEvent.ON_DOWN, this.chgAngle, this);
            main.gameEvent.remove(JoystickEvent.ON_DRAG, this.chgAngle, this);
            main.gameEvent.remove(JoystickEvent.ON_UP, this.joystickUp, this);
            //this.game.input.mouse.onMouseUp.remove(this.mouseUp, this);
            if (this.parabolaTimer) {
                this.game.timer.remove(this.parabolaTimer);
            }
            switch (this.parabolaType) {
                //摇杆控制
                case ParabolaType.JOYSTICK:
                    main.gameEvent.add(JoystickEvent.ON_DOWN, this.chgAngle, this);
                    main.gameEvent.add(JoystickEvent.ON_DRAG, this.chgAngle, this);
                    main.gameEvent.add(JoystickEvent.ON_UP, this.joystickUp, this);
                    break;
                //鼠标离开
                case ParabolaType.MOUSE_UP:
                    //this.game.input.mouse.onMouseUp.add(this.mouseUp, this);
                    break;
                //按时间间隔循环
                case ParabolaType.TIME_LOOP:
                    this.parabolaTimer = this.game.timer.add(this.parabolaInterval, this.timeFinish, this);
                    break;
            }
        }

        private joystickUp() {
            if (this.parabolaType !== ParabolaType.JOYSTICK) {
                return;
            }
            this.throwStart();
        }

        private mouseUp() {
            if (this.parabolaType !== ParabolaType.MOUSE_UP) {
                return;
            }
            this.createArticle();
            this.throwStart();
        }

        private timeFinish() {
            if (this.parabolaType !== ParabolaType.TIME_LOOP) {
                return;
            }
            if (this.parabolaTimer) {
                this.game.timer.remove(this.parabolaTimer);
            }
            this.createArticle();
            if (this.throwStart()) {
                this.parabolaInterval -= this.parabolaLittleTime;
                this.parabolaInterval = Math.max(this.parabolaInterval, this.parabolaTimeMin);
            }
            this.parabolaTimer = this.game.timer.add(this.parabolaInterval, this.timeFinish, this);
        }

        private updateWeapon(): void {
            const stepRate: number = 5;
            for (let i: number = 0, isAdd: boolean = true; i < this.articleParabola.length; isAdd ? i++ : i) {
                isAdd = true;
                const article = this.articleParabola[i];
                if (!article.parent) {
                    continue;
                }
                if (article["shooted"]) {
                    continue;
                }
                for (let j: number = 0; j < stepRate; j++) {
                    article.x += article["speedX"];
                    article.y += article["speedY"];
                    article["speedY"] += (article["gravity"]);

                    const gPot = article.parent.toGlobal(new qc.Point(article.x, article.y));
                    if (
                        gPot.x + article.width * article.scaleX >= ps.ScrFix.width / ps.ScrFix.scale
                        || gPot.y + article.height * article.scaleY >= ps.ScrFix.height / ps.ScrFix.scale
                        || gPot.x - article.width * article.scaleX <= -ps.ScrFix.width / ps.ScrFix.scale
                        || gPot.y - article.height * article.scaleY <= -ps.ScrFix.height / ps.ScrFix.scale
                    ) {
                        isAdd = false;
                        // article.destroy();
                        this.article.removeSelf();
                        this.articlePool.push(article);
                        this.articleParabola.splice(i, 1);
                        break;
                    }
                }

                const angle: number = Math.atan2(article["speedY"], article["speedX"]);
                const rot: number = angle + 90 * Math.PI / 180;
                article.rotation = rot;
            }
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
            this.article["gravity"] = this.gravity;

            if (this.parabolaAuto) {
                this.addParabola(this.article);
            }
            this.eventDisp.dispatch(ParabolaEvent.THROW_START, this.article, this.speedX, this.speedY, this.gravity);
            return true;
        }

        private addParabola(article: qc.UIImage) {
            if (!article) {
                return;
            }
            if (!article.parent) {
                return;
            }
            if (article["shooted"]) {
                return;
            }
            const parent = this.parabolaParent;
            if (!parent) {
                return;
            }

            let pt = article.parent.toGlobal(new qc.Point(article.x, article.y));
            pt = parent.toLocal(pt);
            parent.addChild(article);
            article.x = pt.x;
            article.y = pt.y;

            this.articleParabola.push(article);
        }

        private startPos: qc.Point = new qc.Point();

        private chgAngle(x: number, y: number, angle: number, dist: number, circleRadius: number, ballRadius: number, stageX: number, stageY: number): void {
            const rad: number = (circleRadius - ballRadius);
            if (dist > rad) {
                dist = rad;
            }

            const perX: number = Math.max(x / (rad / 2), -.48);
            const perY: number = 1 - y / (rad / 2);
            // console.log(perX, perY);

            this.speedX = this.speedMin.x + (this.speedMax.x - this.speedMin.x) * perX;
            this.speedY = this.speedMax.y + (this.speedMin.y - this.speedMax.y) * perY;

            // this.angle = angle;

            if (this.parabolaType !== ParabolaType.TIME_LOOP) {
                this.drawPath();
            }
            this.chgArticle(/* stageX, stageY */);
        }

        private chgArticle(stageX?: number, stageY?: number) {
            let angle: number;
            if (stageX != void 0 && stageY != void 0) {
                const potA = this.gameObject.parent.toGlobal(new qc.Point(this.gameObject.x, this.gameObject.y));
                const potC = new qc.Point(stageX, stageY);
                const a = Math.abs(potC.x - potA.x);
                const c = Math.abs(potC.y - potA.y);

                angle = Math.atan2(potC.y - potA.y, potC.x - potA.x);
            } else {
                angle = Math.atan2(this.speedY, this.speedX);
            }

            this.createArticle();
            if (this.article) {
                this.article.rotation = angle + 90 * Math.PI / 180;
            }
        }

        /** 绘制路径 */
        public drawPath(stageX?: number, stageY?: number): void {
            let g: number = this.gravity;
            let speedX: number = this.speedX;
            let speedY: number = this.speedY;

            let currentX: number = this.startPos.x;
            let currentY: number = this.startPos.y;
            let validCnt: number = 0;
            const lastPt: qc.Point = new qc.Point(this.startPos.x, this.startPos.y);
            const centerPt: qc.Point = new qc.Point(0, 0);

            let index: number = 0;
            while (true) {
                currentX += speedX;
                currentY += speedY;
                speedY += g;
                centerPt.x = currentX;
                centerPt.y = currentY;
                if (lastPt.distance(centerPt) > 20) {
                    lastPt.x = centerPt.x;
                    lastPt.y = centerPt.y;
                    const sp: qc.Graphics = this.getGraphics(validCnt);
                    sp.x = currentX;
                    sp.y = currentY;
                    index++;
                    sp.alpha = 1;
                    this.gameObject.addChild(sp);
                    validCnt++;
                    if (validCnt >= 35) {
                        break;
                    }

                    if (sp.y > this.startPos.y) {
                        break;
                    }
                }
            }

            for (let i: number = index; i < this.shapes.length; i++) {
                this.shapes[i].visible = false;
            }

            let idx: number = 0;
            for (let i: number = this.shapes.length - 1; i >= 0; i--) {
                const sp = this.shapes[i];
                if (!sp.visible) {
                    continue;
                }
                this.shapes[i].alpha = 0.2 + idx * 0.2;
                if (idx >= 4) {
                    break;
                }
                idx++;
            }
        }

        private getGraphics(index: number): qc.Graphics {
            if (this.shapes.length <= index) {
                const sp: qc.Graphics = new qc.Graphics(this.game, void 0);
                sp.beginFill(this.color.toNumber(), 1);
                sp.drawCircle(0, 0, 6);
                sp.endFill();
                this.shapes[index] = sp;
            }

            this.shapes[index].visible = true;
            return this.shapes[index];
        }
    }
    qc.registerBehaviour('ps.Parabola', Parabola);
    Parabola["__menu"] = 'Custom/Parabola';
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