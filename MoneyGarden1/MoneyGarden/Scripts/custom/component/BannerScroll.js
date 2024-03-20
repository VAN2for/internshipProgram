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
    /** Banner滚动类型 */
    var BannerScrollType;
    (function (BannerScrollType) {
        /** 一边消失，另一边出新的 */
        BannerScrollType[BannerScrollType["HIDE_SHOW"] = 1] = "HIDE_SHOW";
        /** 不消失，移往另一边 */
        BannerScrollType[BannerScrollType["MOVE_OTHER_SIDE"] = 2] = "MOVE_OTHER_SIDE";
    })(BannerScrollType || (BannerScrollType = {}));
    /** Banner事件 */
    var BannerEventType;
    (function (BannerEventType) {
        /** 开始拖拽 */
        BannerEventType["DRAG_START"] = "DragStart";
        /** 拖拽中 */
        BannerEventType["DRAG"] = "Drag";
        /** 拖拽结束 */
        BannerEventType["DRAG_END"] = "DragEnd";
        /** 选中完成 */
        BannerEventType["CHOOSE_FINISH"] = "ChooseFinish";
    })(BannerEventType = ps.BannerEventType || (ps.BannerEventType = {}));
    /**
     * 滚动Banner组件
     * @description 可拖拽、或点击箭头滚动Banner
     * @author JingBin
     */
    var BannerScroll = /** @class */ (function (_super) {
        __extends(BannerScroll, _super);
        function BannerScroll(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** Banner间隔 */
            _this.Space = 200;
            /** 拖拽最小距离，小于等于0时不使用拖拽滚动 */
            _this.DeltaMin = 10;
            /** 滚动类型 */
            _this.ScrollType = BannerScrollType.HIDE_SHOW;
            /** 滚动单个花费时间 */
            _this.ScrollDuration = 300;
            /** 除中间的，其他Banner透明度 */
            _this.OtherAlpha = .8;
            /** 除中间的，其他Banner缩放值 */
            _this.OtherScale = .8;
            /** Banner标题方位，0:上 1:下，默认为：下 */
            _this.TitleDire = 1;
            /** Banner标题方位偏移值 */
            _this.TitleOffsetY = 0;
            /** Banner事件对象 */
            _this.eventDisp = new ps.EventDispatcher();
            /** 序列化 */
            _this.serializableFields = {
                Space: qc.Serializer.NUMBER,
                DeltaMin: qc.Serializer.NUMBER,
                ArrowLeft: qc.Serializer.NODE,
                ArrowRight: qc.Serializer.NODE,
                ScrollType: qc.Serializer.AUTO,
                ScrollDuration: qc.Serializer.NUMBER,
                OtherAlpha: qc.Serializer.NUMBER,
                OtherScale: qc.Serializer.NUMBER,
                ImgTexs: qc.Serializer.TEXTURES,
                TitleTexs: qc.Serializer.TEXTURES,
                TitleDire: qc.Serializer.AUTO,
                TitleOffsetY: qc.Serializer.NUMBER,
            };
            _this.currId = 1;
            return _this;
        }
        BannerScroll.prototype.awake = function () {
            this.initBanners();
            if (this.ArrowLeft)
                this.ArrowLeft.onDown.add(this.playBannerLeft, this);
            if (this.ArrowRight)
                this.ArrowRight.onDown.add(this.playBannerRight, this);
        };
        BannerScroll.prototype.getBanner = function (i) {
            var node;
            if (i < this.gameObject.children.length) {
                node = this.gameObject.getChildAt(i);
            }
            else {
                node = this.game.add.node(this.gameObject);
                node.setAnchor(new qc.Point(.5, .5), new qc.Point(.5, .5));
                node.pivotX = node.pivotY = .5;
            }
            return node;
        };
        BannerScroll.prototype.updateImg = function (banner, i) {
            if (!this.ImgTexs || this.ImgTexs.length <= 0)
                return;
            if (i >= this.ImgTexs.length)
                i = 0;
            else if (i < 0)
                i = this.ImgTexs.length - 1;
            var img = banner.getChild('img');
            if (!img) {
                img = this.game.add.image(banner);
                img.name = 'img';
                img.texture = this.ImgTexs[i];
                img.resetNativeSize();
                img.setAnchor(new qc.Point(.5, .5), new qc.Point(.5, .5));
                img.pivotX = img.pivotY = .5;
                banner.width = img.width;
                banner.height = img.height;
            }
            else if (banner.name !== i + '') {
                img.texture = this.ImgTexs[i];
                img.resetNativeSize();
                banner.width = img.width;
                banner.height = img.height;
            }
            banner.name = i + '';
            return img;
        };
        BannerScroll.prototype.updateTitle = function (banner, i) {
            if (!this.TitleTexs || this.TitleTexs.length <= 0)
                return;
            if (i >= this.TitleTexs.length)
                i = 0;
            else if (i < 0)
                i = this.TitleTexs.length - 1;
            var title = banner.getChild('title');
            if (!title) {
                title = this.game.add.image(banner);
                title.name = 'title';
                title.texture = this.TitleTexs[i];
                title.resetNativeSize();
                title.pivotX = title.pivotY = .5;
            }
            else if (banner.name !== i + '') {
                title.texture = this.TitleTexs[i];
                title.resetNativeSize();
            }
            if (this.TitleDire === 1) {
                //下
                title.setAnchor(new qc.Point(.5, 1), new qc.Point(.5, 1));
            }
            else {
                //上
                title.setAnchor(new qc.Point(.5, 0), new qc.Point(.5, 0));
            }
            title.anchoredY = this.TitleOffsetY;
            return title;
        };
        BannerScroll.prototype.initBanners = function () {
            this.gameObject.interactive = this.DeltaMin > 0;
            var centerI = Math.floor(3 / 2);
            var imgIdx = 0;
            var titleIdx = 0;
            for (var i = 0; i < 3; i++) {
                var banner = this.getBanner(i);
                var c = i - centerI;
                banner.anchoredX = this.Space * c;
                banner.scaleX = banner.scaleY = i === centerI ? 1 : this.OtherScale;
                banner.alpha = i === centerI ? 1 : this.OtherAlpha;
                banner.removeChildren();
                //Banner图片
                if (imgIdx >= this.ImgTexs.length)
                    imgIdx = 0;
                if (imgIdx < this.ImgTexs.length) {
                    this.updateImg(banner, i);
                    if (i === centerI)
                        this.currId = Number(banner.name);
                    imgIdx++;
                }
                //Banner标题
                if (titleIdx >= this.TitleTexs.length)
                    titleIdx = 0;
                if (titleIdx < this.TitleTexs.length) {
                    this.updateTitle(banner, i);
                    titleIdx++;
                }
            }
            this.gameObject.setChildIndex(this.getBanner(centerI), this.gameObject.children.length - 1);
        };
        BannerScroll.prototype.onDragStart = function (e) {
            this.eventDisp.dispatch(BannerEventType.DRAG_START);
        };
        BannerScroll.prototype.onDrag = function (e) {
            this.eventDisp.dispatch(BannerEventType.DRAG);
            var pot = e.source;
            var deltaX = pot.deltaX;
            if (Math.abs(deltaX) >= this.DeltaMin) {
                // console.log("distanceX", pot.distanceX, "deltaX", pot.deltaX);
                this.playBanner(deltaX < 0 ? "left" : "right");
            }
        };
        BannerScroll.prototype.onDragEnd = function (e) {
            this.eventDisp.dispatch(BannerEventType.DRAG_END);
        };
        BannerScroll.prototype.playBanner = function (move) {
            if (move === "left") {
                this.playBannerLeft();
            }
            else {
                this.playBannerRight();
            }
        };
        BannerScroll.prototype.playBannerLeft = function () {
            var _this = this;
            if (this.playBannering)
                return;
            this.playBannering = true;
            var findIdx;
            this.gameObject.children.some(function (banner) {
                if (banner.anchoredX > 0) {
                    findIdx = Number(banner.name);
                    return true;
                }
            });
            this.gameObject.children.forEach(function (banner) {
                var imgIdx = Number(banner.name);
                if (banner.anchoredX < 0) {
                    if (_this.ScrollType === BannerScrollType.HIDE_SHOW) {
                        //左边消失，右边出新的
                        ps.Tween.to(banner, { anchoredX: -_this.Space * 2, alpha: 0, scale: _this.OtherScale }, _this.ScrollDuration).onComplete.addOnce(function () { return banner.removeSelf(); });
                        var banner1 = _this.game.add.clone(banner);
                        banner1.alpha = 0;
                        banner1.anchoredX = _this.Space * 2;
                        _this.updateImg(banner1, findIdx + 1);
                        ps.Tween.to(banner1, { anchoredX: _this.Space, alpha: _this.OtherAlpha, scale: _this.OtherScale }, _this.ScrollDuration).onComplete.addOnce(function () { return _this.playBannering = false; });
                    }
                    else {
                        //左边往右放
                        ps.Tween.to(banner, { anchoredX: 0, alpha: _this.OtherAlpha, scale: _this.OtherScale }, _this.ScrollDuration / 2)
                            .onComplete.addOnce(function () {
                            _this.updateImg(banner, findIdx + 1);
                            ps.Tween.to(banner, { anchoredX: _this.Space }, _this.ScrollDuration / 2).onComplete.addOnce(function () { return _this.playBannering = false; });
                        });
                    }
                }
                else if (banner.anchoredX > 0) {
                    //右边的往中间放
                    _this.currId = imgIdx;
                    ps.Tween.to(banner, { anchoredX: 0, alpha: 1, scale: 1 }, _this.ScrollDuration)
                        .onComplete.addOnce(function () {
                        // console.log(BannerEventType.CHOOSE_FINISH, this.currId)
                        _this.eventDisp.dispatch(BannerEventType.CHOOSE_FINISH, _this.currId);
                    });
                    _this.game.timer.add(10, function () { return banner.parent.setChildIndex(banner, banner.parent.children.length - 1); });
                }
                else {
                    //中间的往左边放
                    ps.Tween.to(banner, { anchoredX: -_this.Space, alpha: _this.OtherAlpha, scale: _this.OtherScale }, _this.ScrollDuration);
                }
            });
        };
        BannerScroll.prototype.playBannerRight = function () {
            var _this = this;
            if (this.playBannering)
                return;
            this.playBannering = true;
            var findIdx;
            this.gameObject.children.some(function (banner) {
                if (banner.anchoredX < 0) {
                    findIdx = Number(banner.name);
                    return true;
                }
            });
            this.gameObject.children.forEach(function (banner) {
                var imgIdx = Number(banner.name);
                if (banner.anchoredX > 0) {
                    if (_this.ScrollType === BannerScrollType.HIDE_SHOW) {
                        //右边消失，左边出新的
                        ps.Tween.to(banner, { anchoredX: _this.Space * 2, alpha: 0, scale: _this.OtherScale }, _this.ScrollDuration).onComplete.addOnce(function () { return banner.removeSelf(); });
                        var banner1 = _this.game.add.clone(banner);
                        banner1.alpha = 0;
                        banner1.anchoredX = -_this.Space * 2;
                        _this.updateImg(banner1, findIdx - 1);
                        ps.Tween.to(banner1, { anchoredX: -_this.Space, alpha: _this.OtherAlpha, scale: _this.OtherScale }, _this.ScrollDuration).onComplete.addOnce(function () { return _this.playBannering = false; });
                    }
                    else {
                        //右边往左放
                        ps.Tween.to(banner, { anchoredX: 0, alpha: _this.OtherAlpha, scale: _this.OtherScale }, _this.ScrollDuration / 2)
                            .onComplete.addOnce(function () {
                            _this.updateImg(banner, findIdx - 1);
                            ps.Tween.to(banner, { anchoredX: -_this.Space }, _this.ScrollDuration / 2).onComplete.addOnce(function () { return _this.playBannering = false; });
                        });
                    }
                }
                else if (banner.anchoredX < 0) {
                    //左边的往中间放
                    _this.currId = imgIdx;
                    ps.Tween.to(banner, { anchoredX: 0, alpha: 1, scale: 1 }, _this.ScrollDuration)
                        .onComplete.addOnce(function () {
                        // console.log(BannerEventType.CHOOSE_FINISH, this.currId)
                        _this.eventDisp.dispatch(BannerEventType.CHOOSE_FINISH, _this.currId);
                    });
                    _this.game.timer.add(10, function () { return banner.parent.setChildIndex(banner, banner.parent.children.length - 1); });
                }
                else {
                    //中间的往右边放
                    ps.Tween.to(banner, { anchoredX: _this.Space, alpha: _this.OtherAlpha, scale: _this.OtherScale }, _this.ScrollDuration);
                }
            });
        };
        return BannerScroll;
    }(ps.Behaviour));
    ps.BannerScroll = BannerScroll;
    qc.registerBehaviour('ps.BannerScroll', BannerScroll);
    BannerScroll["__menu"] = 'Custom/BannerScroll';
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
