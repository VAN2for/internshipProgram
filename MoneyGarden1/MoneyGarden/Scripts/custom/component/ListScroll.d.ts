/** 滚动方向 */
declare enum DireScroll {
    /** 向上/左 */
    UP_OR_LEFT = -1,
    /** 向下/右 */
    DOWN_OR_RIGHT = 1
}
/** 布局类型 */
declare enum ListLayout {
    /** 水平 */
    HORIZONTAL = 0,
    /** 垂直 */
    VERTICAL = 1
}
/** 滚动列表事件 */
declare enum ListScrollEvent {
    /** 滚动完成起步阶段 */
    PLAY_FINISHED_FIRST = "playFinishedFirst",
    /** 滚动完成第一步骤阶段 */
    PLAY_FINISHED_TW0 = "playFinishedTw0",
    /** 滚动完成收尾阶段 */
    PLAY_FINISHED_LAST = "playFinishedLast"
}
/** 滚动列表当前状态 */
declare enum ListScrollState {
    /** 待机静止状态 */
    IDLE = 0,
    /** 滚动起步阶段 */
    PLAYING_FIRST = 1,
    /** 滚动收尾阶段 */
    PLAYING_LAST = 2
}
declare namespace ps {
    /**
     * 滚动列表组件
     * @description 滚动列表组件，可用于如：摇奖、老虎机、关卡楼层等需要滚动列表
     * @author JingBin
     */
    class ListScroll extends ps.Behaviour {
        /** 所有用到的图片纹理 */
        textures: qc.Texture[];
        /** 图片索引，按顺序渲染 */
        textureIdxs: number[];
        /** 间距 */
        space: number;
        /** 滚动方向: -1:向上/左 1:向下/右 */
        direScroll: DireScroll;
        /** 布局: 0:水平 1:垂直 */
        listLayout: ListLayout;
        /** 滚动时间 */
        duration: number;
        /** 滚动圈数 */
        scrollCnt: number;
        /** 最终停在的图片索引 */
        stopToIdx: number;
        /** 启用速度模糊 */
        isSpeedBlur: boolean;
        /** 速度模糊 */
        speedBlur: number;
        /** 启用Debug模式，点击对象即滚动 */
        debug: boolean;
        /** 滚动列表过程中循环播放的音效 */
        smPlaying: string;
        /** 滚动列表过程中循环播放的音效，时间间隔 */
        smPlayingInterval: number;
        /** 滚动列表完成音效 */
        smFinish: string;
        /** 发光索引 */
        lightIdx: number;
        /** 斜光特效节点 */
        msk: qc.Node;
        /** 随机出现斜光特效，时间间隔 */
        idleLightEffInterval: number;
        private scrollCnt0;
        private scrollCnt1;
        private xy;
        private xyBack;
        private wh;
        private whBack;
        private orgXY;
        private orgXYBack;
        private stopToXY;
        eventDisp: ps.EventDispatcher;
        state: ListScrollState;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.Node);
        awake(resetToEnd?: boolean): void;
        private showLightE;
        private showLight;
        /** 试玩初始化的处理 */
        onInit(): void;
        /** 试玩开始时的处理 */
        onStart(): void;
        listBox0: qc.Node;
        listBox1: qc.Node;
        private renderList;
        private cloneListBox;
        get tw0(): qc.TweenPosition;
        initTw0(resetFrom?: boolean): void;
        private resetTw0;
        playCnt: number;
        private playSoundE;
        /** 滚动起来 */
        play(reset: any): void;
        private startBlur;
        private stopBlur;
        private playFinishedTw0;
        get tw1(): qc.TweenPosition;
        initTw1(resetFrom?: boolean): void;
        private resetTw1;
        resetToEndTw1(): void;
        /** 滚动总时长（毫秒） */
        get scrollTime(): number;
        resetToStopPot(): void;
        playTw1(): void;
        private playFinishedTw1;
        playLight(): void;
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
}
