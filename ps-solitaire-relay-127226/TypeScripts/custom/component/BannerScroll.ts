namespace ps {
    /** Banner滚动类型 */
    enum BannerScrollType {
        /** 一边消失，另一边出新的 */
        HIDE_SHOW = 1,
        /** 不消失，移往另一边 */
        MOVE_OTHER_SIDE = 2,
    }

    /** Banner事件 */
    export enum BannerEventType {
        /** 开始拖拽 */
        DRAG_START = "DragStart",
        /** 拖拽中 */
        DRAG = "Drag",
        /** 拖拽结束 */
        DRAG_END = "DragEnd",
        /** 选中完成 */
        CHOOSE_FINISH = "ChooseFinish",
    }

    /**
     * 滚动Banner组件
     * @description 可拖拽、或点击箭头滚动Banner
     * @author JingBin
     */
    export class BannerScroll extends ps.Behaviour {
        /** Banner间隔 */
        Space: number = 200
        /** 拖拽最小距离，小于等于0时不使用拖拽滚动 */
        DeltaMin: number = 10
        /** 左边箭头，可控制向左滚动 */
        ArrowLeft: qc.Node
        /** 右边箭头，可控制向左滚动 */
        ArrowRight: qc.Node
        /** 滚动类型 */
        ScrollType: BannerScrollType = BannerScrollType.HIDE_SHOW
        /** 滚动单个花费时间 */
        ScrollDuration: number = 300
        /** 除中间的，其他Banner透明度 */
        OtherAlpha: number = .8
        /** 除中间的，其他Banner缩放值 */
        OtherScale: number = .8
        /** 所有Banner图片纹理集 */
        ImgTexs: qc.Texture[]
        /** 所有Banner标题纹理集，可选 */
        TitleTexs: qc.Texture[]
        /** Banner标题方位，0:上 1:下，默认为：下 */
        TitleDire: 0 | 1 = 1
        /** Banner标题方位偏移值 */
        TitleOffsetY: number = 0

        /** Banner事件对象 */
        public eventDisp = new ps.EventDispatcher()

        /** 序列化 */
        private serializableFields: Object = {
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
        }

        constructor(gameObject: qc.Node) {
            super(gameObject)
        }

        awake() {
            this.initBanners()
            if (this.ArrowLeft) this.ArrowLeft.onDown.add(this.playBannerLeft, this)
            if (this.ArrowRight) this.ArrowRight.onDown.add(this.playBannerRight, this)
        }

        private getBanner(i: number): qc.Node {
            let node: qc.Node
            if (i < this.gameObject.children.length) {
                node = this.gameObject.getChildAt(i)
            } else {
                node = this.game.add.node(this.gameObject)
                node.setAnchor(new qc.Point(.5, .5), new qc.Point(.5, .5))
                node.pivotX = node.pivotY = .5
            }
            return node
        }

        private updateImg(banner: qc.Node, i: number): qc.UIImage {
            if (!this.ImgTexs || this.ImgTexs.length <= 0) return
            if (i >= this.ImgTexs.length) i = 0
            else if (i < 0) i = this.ImgTexs.length - 1
            let img: qc.UIImage = banner.getChild('img') as qc.UIImage
            if (!img) {
                img = this.game.add.image(banner)
                img.name = 'img'
                img.texture = this.ImgTexs[i]
                img.resetNativeSize()
                img.setAnchor(new qc.Point(.5, .5), new qc.Point(.5, .5))
                img.pivotX = img.pivotY = .5
                banner.width = img.width
                banner.height = img.height
            } else if (banner.name !== i + '') {
                img.texture = this.ImgTexs[i]
                img.resetNativeSize()
                banner.width = img.width
                banner.height = img.height
            }
            banner.name = i + ''
            return img
        }

        private updateTitle(banner: qc.Node, i: number): qc.UIImage {
            if (!this.TitleTexs || this.TitleTexs.length <= 0) return
            if (i >= this.TitleTexs.length) i = 0
            else if (i < 0) i = this.TitleTexs.length - 1
            let title: qc.UIImage = banner.getChild('title') as qc.UIImage
            if (!title) {
                title = this.game.add.image(banner)
                title.name = 'title'
                title.texture = this.TitleTexs[i]
                title.resetNativeSize()
                title.pivotX = title.pivotY = .5
            } else if (banner.name !== i + '') {
                title.texture = this.TitleTexs[i]
                title.resetNativeSize()
            }
            if (this.TitleDire === 1) {
                //下
                title.setAnchor(new qc.Point(.5, 1), new qc.Point(.5, 1))
            } else {
                //上
                title.setAnchor(new qc.Point(.5, 0), new qc.Point(.5, 0))
            }
            title.anchoredY = this.TitleOffsetY
            return title
        }

        private initBanners() {
            this.gameObject.interactive = this.DeltaMin > 0
            const centerI = Math.floor(3 / 2)
            let imgIdx = 0
            let titleIdx = 0
            for (let i = 0; i < 3; i++) {
                const banner = this.getBanner(i)
                const c = i - centerI
                banner.anchoredX = this.Space * c
                banner.scaleX = banner.scaleY = i === centerI ? 1 : this.OtherScale
                banner.alpha = i === centerI ? 1 : this.OtherAlpha
                banner.removeChildren()
                //Banner图片
                if (imgIdx >= this.ImgTexs.length) imgIdx = 0
                if (imgIdx < this.ImgTexs.length) {
                    this.updateImg(banner, i)
                    if (i === centerI) this.currId = Number(banner.name)
                    imgIdx++
                }
                //Banner标题
                if (titleIdx >= this.TitleTexs.length) titleIdx = 0
                if (titleIdx < this.TitleTexs.length) {
                    this.updateTitle(banner, i)
                    titleIdx++
                }
            }
            this.gameObject.setChildIndex(this.getBanner(centerI), this.gameObject.children.length - 1)
        }

        onDragStart(e: qc.DragStartEvent) {
            this.eventDisp.dispatch(BannerEventType.DRAG_START)
        }

        onDrag(e: qc.DragEvent) {
            this.eventDisp.dispatch(BannerEventType.DRAG)
            const pot = e.source as qc.Pointer
            const deltaX = pot.deltaX
            if (Math.abs(deltaX) >= this.DeltaMin) {
                // console.log("distanceX", pot.distanceX, "deltaX", pot.deltaX);
                this.playBanner(deltaX < 0 ? "left" : "right")
            }
        }

        onDragEnd(e: qc.DragEndEvent) {
            this.eventDisp.dispatch(BannerEventType.DRAG_END)
        }

        playBanner(move?: "left" | "right") {
            if (move === "left") {
                this.playBannerLeft()
            } else {
                this.playBannerRight()
            }
        }

        public currId: number = 1
        public playBannering: boolean

        playBannerLeft() {
            if (this.playBannering) return
            this.playBannering = true
            let findIdx: number
            this.gameObject.children.some((banner) => {
                if (banner.anchoredX > 0) {
                    findIdx = Number(banner.name);
                    return true
                }
            })
            this.gameObject.children.forEach((banner) => {
                const imgIdx = Number(banner.name)
                if (banner.anchoredX < 0) {
                    if (this.ScrollType === BannerScrollType.HIDE_SHOW) {
                        //左边消失，右边出新的
                        ps.Tween.to(banner, { anchoredX: -this.Space * 2, alpha: 0, scale: this.OtherScale }, this.ScrollDuration).onComplete.addOnce(() => banner.removeSelf())
                        const banner1 = this.game.add.clone(banner)
                        banner1.alpha = 0
                        banner1.anchoredX = this.Space * 2
                        this.updateImg(banner1, findIdx + 1)
                        ps.Tween.to(banner1, { anchoredX: this.Space, alpha: this.OtherAlpha, scale: this.OtherScale }, this.ScrollDuration).onComplete.addOnce(() => this.playBannering = false)
                    } else {
                        //左边往右放
                        ps.Tween.to(banner, { anchoredX: 0, alpha: this.OtherAlpha, scale: this.OtherScale }, this.ScrollDuration / 2)
                            .onComplete.addOnce(() => {
                                this.updateImg(banner, findIdx + 1)
                                ps.Tween.to(banner, { anchoredX: this.Space }, this.ScrollDuration / 2).onComplete.addOnce(() => this.playBannering = false)
                            })
                    }
                } else if (banner.anchoredX > 0) {
                    //右边的往中间放
                    this.currId = imgIdx
                    ps.Tween.to(banner, { anchoredX: 0, alpha: 1, scale: 1 }, this.ScrollDuration)
                        .onComplete.addOnce(() => {
                            // console.log(BannerEventType.CHOOSE_FINISH, this.currId)
                            this.eventDisp.dispatch(BannerEventType.CHOOSE_FINISH, this.currId)
                        })
                    this.game.timer.add(10, () => banner.parent.setChildIndex(banner, banner.parent.children.length - 1))
                } else {
                    //中间的往左边放
                    ps.Tween.to(banner, { anchoredX: -this.Space, alpha: this.OtherAlpha, scale: this.OtherScale }, this.ScrollDuration)
                }
            })
        }

        playBannerRight() {
            if (this.playBannering) return
            this.playBannering = true
            let findIdx: number
            this.gameObject.children.some((banner) => {
                if (banner.anchoredX < 0) {
                    findIdx = Number(banner.name);
                    return true
                }
            })
            this.gameObject.children.forEach((banner) => {
                const imgIdx = Number(banner.name)
                if (banner.anchoredX > 0) {
                    if (this.ScrollType === BannerScrollType.HIDE_SHOW) {
                        //右边消失，左边出新的
                        ps.Tween.to(banner, { anchoredX: this.Space * 2, alpha: 0, scale: this.OtherScale }, this.ScrollDuration).onComplete.addOnce(() => banner.removeSelf())
                        const banner1 = this.game.add.clone(banner)
                        banner1.alpha = 0
                        banner1.anchoredX = -this.Space * 2
                        this.updateImg(banner1, findIdx - 1)
                        ps.Tween.to(banner1, { anchoredX: -this.Space, alpha: this.OtherAlpha, scale: this.OtherScale }, this.ScrollDuration).onComplete.addOnce(() => this.playBannering = false)
                    } else {
                        //右边往左放
                        ps.Tween.to(banner, { anchoredX: 0, alpha: this.OtherAlpha, scale: this.OtherScale }, this.ScrollDuration / 2)
                            .onComplete.addOnce(() => {
                                this.updateImg(banner, findIdx - 1)
                                ps.Tween.to(banner, { anchoredX: -this.Space }, this.ScrollDuration / 2).onComplete.addOnce(() => this.playBannering = false)
                            })
                    }
                } else if (banner.anchoredX < 0) {
                    //左边的往中间放
                    this.currId = imgIdx
                    ps.Tween.to(banner, { anchoredX: 0, alpha: 1, scale: 1 }, this.ScrollDuration)
                        .onComplete.addOnce(() => {
                            // console.log(BannerEventType.CHOOSE_FINISH, this.currId)
                            this.eventDisp.dispatch(BannerEventType.CHOOSE_FINISH, this.currId)
                        })
                    this.game.timer.add(10, () => banner.parent.setChildIndex(banner, banner.parent.children.length - 1))
                } else {
                    //中间的往右边放
                    ps.Tween.to(banner, { anchoredX: this.Space, alpha: this.OtherAlpha, scale: this.OtherScale }, this.ScrollDuration)
                }
            })
        }
    }
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
}