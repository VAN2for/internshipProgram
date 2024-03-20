declare namespace ps {
    /** Banner滚动类型 */
    enum BannerScrollType {
        /** 一边消失，另一边出新的 */
        HIDE_SHOW = 1,
        /** 不消失，移往另一边 */
        MOVE_OTHER_SIDE = 2
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
        CHOOSE_FINISH = "ChooseFinish"
    }
    /**
     * 滚动Banner组件
     * @description 可拖拽、或点击箭头滚动Banner
     * @author JingBin
     */
    export class BannerScroll extends ps.Behaviour {
        /** Banner间隔 */
        Space: number;
        /** 拖拽最小距离，小于等于0时不使用拖拽滚动 */
        DeltaMin: number;
        /** 左边箭头，可控制向左滚动 */
        ArrowLeft: qc.Node;
        /** 右边箭头，可控制向左滚动 */
        ArrowRight: qc.Node;
        /** 滚动类型 */
        ScrollType: BannerScrollType;
        /** 滚动单个花费时间 */
        ScrollDuration: number;
        /** 除中间的，其他Banner透明度 */
        OtherAlpha: number;
        /** 除中间的，其他Banner缩放值 */
        OtherScale: number;
        /** 所有Banner图片纹理集 */
        ImgTexs: qc.Texture[];
        /** 所有Banner标题纹理集，可选 */
        TitleTexs: qc.Texture[];
        /** Banner标题方位，0:上 1:下，默认为：下 */
        TitleDire: 0 | 1;
        /** Banner标题方位偏移值 */
        TitleOffsetY: number;
        /** Banner事件对象 */
        eventDisp: EventDispatcher;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.Node);
        awake(): void;
        private getBanner;
        private updateImg;
        private updateTitle;
        private initBanners;
        onDragStart(e: qc.DragStartEvent): void;
        onDrag(e: qc.DragEvent): void;
        onDragEnd(e: qc.DragEndEvent): void;
        playBanner(move?: "left" | "right"): void;
        currId: number;
        playBannering: boolean;
        playBannerLeft(): void;
        playBannerRight(): void;
    }
    export {};
}
