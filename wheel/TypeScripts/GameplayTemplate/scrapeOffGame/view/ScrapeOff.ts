namespace ps {
    /**
     * 刮刮乐
     * @description 刮刮乐
     * @author bin
     * @date 2023/02/14 18:30:01
     */
    export class ScrapeOff extends Behaviour {
        private bmd: Phaser.BitmapData;
        private channelSize: number = 50;
        private isSolidColor = false;
        private solidColor: qc.Color = new qc.Color("#ffffff");

        private nowLocalPointX: number;
        private nowLocalPointY: number;

        private totalPixels: number;
        private transparentPixels: number;
        private actualPixel: number;

        public filledPercentage: number = 0;

        private isUpdateBMD = false;
        private isFilledPercentage = false;

        private refrshTime = 0;
        private refrshInterval: number = 100;

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {
            channelSize: qc.Serializer.NUMBER,
            isSolidColor: qc.Serializer.BOOLEAN,
            solidColor: qc.Serializer.COLOR,
            isUpdateBMD: qc.Serializer.BOOLEAN,
            isFilledPercentage: qc.Serializer.BOOLEAN,
            refrshInterval: qc.Serializer.NUMBER,
        };
        public createGui(): GuiType {
            return {
                channelSize: {
                    title: "笔触大小",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
                isSolidColor: {
                    title: "是否开启纯色面板",
                    component: "switch",
                },
                isUpdateBMD: {
                    title: "是否刷新BMD数据",
                    tail: "此功能会影响素材性能，请根据实际情况使用",
                    component: "switch",
                },
                isFilledPercentage: {
                    title: "是否获取填充百分比",
                    tail: "此功能会影响素材性能，请根据实际情况使用",
                    component: "switch",
                },
                refrshInterval: {
                    title: "获取百分比刷新间隔时间(ms)",
                    tail: "此功能会影响素材性能，请根据实际情况使用",
                    component: "input",
                    field: {
                        type: "number",
                    },
                },
            };
        }
        /** 试玩初始化的处理 */
        public onInit() {
            this.initBmd();
            this.initContext();
            this.initPixelsData();
        }
        initBmd() {
            this.bmd = game.make.bitmapData(
                this.gameObject.width,
                this.gameObject.height
            );
            this.bmd.draw(
                (this.gameObject as qc.UIImage).texture.atlas.url,
                0,
                0
            );
            this.bmd.update();
            this.bmd.processPixelRGB(this.changeImgToSolidColor, this);
            this.gameObject["phaser"].loadTexture(this.bmd);
            this.gameObject.interactive = true;
        }
        initContext() {
            this.bmd.context.globalCompositeOperation = "destination-out";
            this.bmd.context.lineWidth = this.channelSize * 2;
        }
        initPixelsData() {
            this.totalPixels = this.bmd.data.length / 4;
            const transPixels = [];
            for (let i = 0; i < this.bmd.data.length; i += 4) {
                if (this.bmd.data[i + 3] === 0) {
                    transPixels.push(this.bmd.data[i + 3]);
                }
            }
            this.transparentPixels = transPixels.length;
            this.actualPixel = this.totalPixels - this.transparentPixels;
        }

        private fristDown: boolean = true;
        onDown(event: qc.PointerEvent): void {
            const pointer = event.source as qc.Pointer;
            const point = new qc.Point(pointer.x, pointer.y);

            let localPoint = this.gameObject.toLocal(point);
            localPoint.x = Math.floor(localPoint.x);
            localPoint.y = Math.floor(localPoint.y);

            this.bmd.context.beginPath();
            this.bmd.context.arc(
                localPoint.x + this.gameObject.width / 2,
                localPoint.y + this.gameObject.height / 2,
                this.channelSize,
                0,
                Math.PI * 2,
                false
            );
            this.bmd.context.closePath();
            this.bmd.context.fill();
            this.bmd.dirty = true;

            this.updateBMD();
            this.filledPercentage = this.getFilledPercentage();

            this.nowLocalPointY = localPoint.y;
            this.nowLocalPointX = localPoint.x;
        }
        private isDrag = false;
        onDrag(event: qc.DragEvent): void {
            this.isDrag = true;
            const pointer = event.source as qc.Pointer;
            const point = new qc.Point(pointer.x, pointer.y);
            let localPoint = this.gameObject.toLocal(point);
            localPoint.x = Math.floor(localPoint.x);
            localPoint.y = Math.floor(localPoint.y);

            this.bmd.context.beginPath();
            this.bmd.context.moveTo(
                this.nowLocalPointX + this.gameObject.width / 2,
                this.nowLocalPointY + this.gameObject.height / 2
            );
            this.bmd.context.lineTo(
                localPoint.x + this.gameObject.width / 2,
                localPoint.y + this.gameObject.height / 2
            );
            this.bmd.context.closePath();
            this.bmd.context.stroke();

            this.bmd.context.beginPath();
            this.bmd.context.arc(
                localPoint.x + this.gameObject.width / 2,
                localPoint.y + this.gameObject.height / 2,
                this.channelSize,
                0,
                Math.PI * 2,
                false
            );
            this.bmd.context.closePath();
            this.bmd.context.fill();
            this.bmd.dirty = true;

            this.updateBMD();

            this.refrshTime += this.game.time.deltaTime;
            if (this.refrshTime > this.refrshInterval) {
                this.refrshTime = 0;
                this.filledPercentage = this.getFilledPercentage();
            }

            this.nowLocalPointY = localPoint.y;
            this.nowLocalPointX = localPoint.x;
        }
        onUp(event: qc.PointerEvent): void {
            if (this.isDrag) {
                this.isDrag = false;
                this.refrshTime = 0;
                this.filledPercentage = this.getFilledPercentage();
            }
        }

        private updateBMD() {
            if (!this.isUpdateBMD) return;
            this.bmd.update();
        }

        private getFilledPercentage() {
            if (!this.isFilledPercentage) return 0;
            let pixels = this.bmd.data;
            let transPixels = [];
            for (let i = 0; i < pixels.length; i += 4) {
                // 严格上来说，判断像素点是否透明需要判断该像素点的a值是否等于0，
                // 为了提高计算效率，这儿也可以设置当a值小于128，也就是半透明状态时就可以了
                if (pixels[i + 3] === 0 /* pixels[i + 3] < 128 */) {
                    transPixels.push(pixels[i + 3]);
                }
            }
            return (
                ((transPixels.length - this.transparentPixels) /
                    this.actualPixel) *
                100
            );
        }

        private changeImgToSolidColor(pixel: {
            a: number;
            r: number;
            g: number;
            b: number;
        }) {
            if (!this.isSolidColor) return;
            if (pixel.a === 0) return;
            pixel.r = this.solidColor.rgb[0];
            pixel.g = this.solidColor.rgb[1];
            pixel.b = this.solidColor.rgb[2];
            pixel.a = 255;
            return pixel;
        }
    }
    qc.registerBehaviour("ps.ScrapeOff", ScrapeOff);
    ScrapeOff["__menu"] = "玩法模板/刮刮乐玩法/刮刮乐(ScrapeOff)";
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
