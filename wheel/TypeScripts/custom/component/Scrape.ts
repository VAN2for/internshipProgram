namespace ps {
    /**
     * 刮图层
     * @description 刮图层
     * @author bin
     * @date 2022/04/22 11:21:42
     */
    export class Scrape extends Behaviour {
        private cacheAsBitmap: qc.CacheAsBitmap;
        private graphics: qc.Graphics;

        private scrapeColor: number = 0x3b271a;
        private scrapeAlpha: number = 1;
        private scrapeSize: number = 160;

        private nowLocalPointX: number;
        private nowLocalPointY: number;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {
            scrapeSize: qc.Serializer.NUMBER,
        };

        /** 组件被激活后执行 */
        public awake() {
            // console.info("[info] ScratchOffGame.awake");

        }


        /** 试玩初始化的处理 */
        public onInit() {
            // console.info("[info] ScratchOffGame.onInit");
            /* 已经手动给引擎设置了第18个枚举值，将graphics的混合模式设置为PIXI.blendModes.ERASE即可 */
            // if (PIXI["blendModesWebGL"] && PIXI["blendModesWebGL"][17] == null)
            //     PIXI["blendModesWebGL"][17] = [game.renderer["gl"].ZERO, game.renderer["gl"].ZERO];
            this.graphics = new qc.Graphics(qc_game, this.gameObject);
            this.graphics.blendMode = PIXI.blendModes.ERASE;
            this.cacheAsBitmap = this.gameObject.addScript('qc.CacheAsBitmap');
            this.graphics.lineStyle(this.scrapeSize, this.scrapeColor, this.scrapeAlpha);
        }

        // 按下时
        onDown(event: qc.PointerEvent): void {
            const pointer = event.source as qc.Pointer;
            const point = new qc.Point(pointer.x, pointer.y);

            let localPoint = this.gameObject.toLocal(point);
            localPoint.x = Math.floor(localPoint.x);
            localPoint.y = Math.floor(localPoint.y);

            // 画圆
            this.graphics.drawCircle(localPoint.x, localPoint.y, 0.5);
            this.graphics.endFill();

            // 设置为true以刷新缓存图片
            this.cacheAsBitmap.dirty = true;

            // 更新当前点的位置 
            this.nowLocalPointY = localPoint.y;
            this.nowLocalPointX = localPoint.x;
        }

        // 按下拖拽时
        onDrag(event: qc.DragEvent): void {
            const pointer = event.source as qc.Pointer;
            const point = new qc.Point(pointer.x, pointer.y);
            let localPoint = this.gameObject.toLocal(point);
            localPoint.x = Math.floor(localPoint.x);
            localPoint.y = Math.floor(localPoint.y);

            // 画线
            this.graphics.moveTo(this.nowLocalPointX, this.nowLocalPointY);
            this.graphics.lineTo(localPoint.x, localPoint.y);

            // 画圆
            this.graphics.drawCircle(localPoint.x, localPoint.y, 0.5);
            this.graphics.endFill();

            // 设置为true以刷新缓存图片
            this.cacheAsBitmap.dirty = true;

            // 更新当前点的位置
            this.nowLocalPointX = localPoint.x;
            this.nowLocalPointY = localPoint.y;

        }

        onUp(event: qc.PointerEvent): void {

        }

        update() {

        }

        /** 试玩开始时的处理 */
        public onStart() {
            // console.info("[info] Scrape.onStart");
        }

        /** 当脚本被移除时，会自动调用 */
        public onDestroy() {
            // console.info("[info] Scrape.onDestroy");
        }
    }
    qc.registerBehaviour("ps.Scrape", Scrape);
    Scrape["__menu"] = "Custom/Scrape";
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