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
     * 刮刮乐
     * @description 刮刮乐
     * @author bin
     * @date 2023/02/14 18:30:01
     */
    var ScrapeOff = /** @class */ (function (_super) {
        __extends(ScrapeOff, _super);
        function ScrapeOff(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.channelSize = 50;
            _this.isSolidColor = false;
            _this.solidColor = new qc.Color("#ffffff");
            _this.filledPercentage = 0;
            _this.isUpdateBMD = false;
            _this.isFilledPercentage = false;
            _this.refrshTime = 0;
            _this.refrshInterval = 100;
            /** 序列化 */
            _this.serializableFields = {
                channelSize: qc.Serializer.NUMBER,
                isSolidColor: qc.Serializer.BOOLEAN,
                solidColor: qc.Serializer.COLOR,
                isUpdateBMD: qc.Serializer.BOOLEAN,
                isFilledPercentage: qc.Serializer.BOOLEAN,
                refrshInterval: qc.Serializer.NUMBER,
            };
            _this.fristDown = true;
            _this.isDrag = false;
            return _this;
        }
        ScrapeOff.prototype.createGui = function () {
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
        };
        /** 试玩初始化的处理 */
        ScrapeOff.prototype.onInit = function () {
            this.initBmd();
            this.initContext();
            this.initPixelsData();
        };
        ScrapeOff.prototype.initBmd = function () {
            this.bmd = game.make.bitmapData(this.gameObject.width, this.gameObject.height);
            this.bmd.draw(this.gameObject.texture.atlas.url, 0, 0);
            this.bmd.update();
            this.bmd.processPixelRGB(this.changeImgToSolidColor, this);
            this.gameObject["phaser"].loadTexture(this.bmd);
            this.gameObject.interactive = true;
        };
        ScrapeOff.prototype.initContext = function () {
            this.bmd.context.globalCompositeOperation = "destination-out";
            this.bmd.context.lineWidth = this.channelSize * 2;
        };
        ScrapeOff.prototype.initPixelsData = function () {
            this.totalPixels = this.bmd.data.length / 4;
            var transPixels = [];
            for (var i = 0; i < this.bmd.data.length; i += 4) {
                if (this.bmd.data[i + 3] === 0) {
                    transPixels.push(this.bmd.data[i + 3]);
                }
            }
            this.transparentPixels = transPixels.length;
            this.actualPixel = this.totalPixels - this.transparentPixels;
        };
        ScrapeOff.prototype.onDown = function (event) {
            var pointer = event.source;
            var point = new qc.Point(pointer.x, pointer.y);
            var localPoint = this.gameObject.toLocal(point);
            localPoint.x = Math.floor(localPoint.x);
            localPoint.y = Math.floor(localPoint.y);
            this.bmd.context.beginPath();
            this.bmd.context.arc(localPoint.x + this.gameObject.width / 2, localPoint.y + this.gameObject.height / 2, this.channelSize, 0, Math.PI * 2, false);
            this.bmd.context.closePath();
            this.bmd.context.fill();
            this.bmd.dirty = true;
            this.updateBMD();
            this.filledPercentage = this.getFilledPercentage();
            this.nowLocalPointY = localPoint.y;
            this.nowLocalPointX = localPoint.x;
        };
        ScrapeOff.prototype.onDrag = function (event) {
            this.isDrag = true;
            var pointer = event.source;
            var point = new qc.Point(pointer.x, pointer.y);
            var localPoint = this.gameObject.toLocal(point);
            localPoint.x = Math.floor(localPoint.x);
            localPoint.y = Math.floor(localPoint.y);
            this.bmd.context.beginPath();
            this.bmd.context.moveTo(this.nowLocalPointX + this.gameObject.width / 2, this.nowLocalPointY + this.gameObject.height / 2);
            this.bmd.context.lineTo(localPoint.x + this.gameObject.width / 2, localPoint.y + this.gameObject.height / 2);
            this.bmd.context.closePath();
            this.bmd.context.stroke();
            this.bmd.context.beginPath();
            this.bmd.context.arc(localPoint.x + this.gameObject.width / 2, localPoint.y + this.gameObject.height / 2, this.channelSize, 0, Math.PI * 2, false);
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
        };
        ScrapeOff.prototype.onUp = function (event) {
            if (this.isDrag) {
                this.isDrag = false;
                this.refrshTime = 0;
                this.filledPercentage = this.getFilledPercentage();
            }
        };
        ScrapeOff.prototype.updateBMD = function () {
            if (!this.isUpdateBMD)
                return;
            this.bmd.update();
        };
        ScrapeOff.prototype.getFilledPercentage = function () {
            if (!this.isFilledPercentage)
                return 0;
            var pixels = this.bmd.data;
            var transPixels = [];
            for (var i = 0; i < pixels.length; i += 4) {
                // 严格上来说，判断像素点是否透明需要判断该像素点的a值是否等于0，
                // 为了提高计算效率，这儿也可以设置当a值小于128，也就是半透明状态时就可以了
                if (pixels[i + 3] === 0 /* pixels[i + 3] < 128 */) {
                    transPixels.push(pixels[i + 3]);
                }
            }
            return (((transPixels.length - this.transparentPixels) /
                this.actualPixel) *
                100);
        };
        ScrapeOff.prototype.changeImgToSolidColor = function (pixel) {
            if (!this.isSolidColor)
                return;
            if (pixel.a === 0)
                return;
            pixel.r = this.solidColor.rgb[0];
            pixel.g = this.solidColor.rgb[1];
            pixel.b = this.solidColor.rgb[2];
            pixel.a = 255;
            return pixel;
        };
        return ScrapeOff;
    }(ps.Behaviour));
    ps.ScrapeOff = ScrapeOff;
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
})(ps || (ps = {}));
//# sourceMappingURL=ScrapeOff.js.map