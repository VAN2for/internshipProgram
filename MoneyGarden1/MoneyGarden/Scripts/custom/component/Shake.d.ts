declare namespace ps {
    enum ShakeXY {
        X = 0,
        Y = 1,
        XY = 2
    }
    /**
     * 震动组件
     */
    class Shake extends qc.Behaviour {
        initX: number;
        initY: number;
        duaringTime: number;
        maxDis: number;
        count: number;
        /**
         * 一秒震动次数
         */
        rate: number;
        /** 震动坐标轴 */
        shakeXY: ShakeXY;
        /**
         * 当前正在震动？
         */
        isShaking: boolean;
        playOnAwake: boolean;
        private evt;
        private serializableFields;
        constructor(gameObject: qc.Node);
        protected awake(): void;
        /**
         * 震动
         * @param        _duaringTime      震动持续时长（秒）
         * @param        _rate      震动频率(一秒震动多少次)
         * @param        _maxDis    震动最大距离
         */
        play(_duaringTime?: number, _rate?: number, _maxDis?: number): void;
        /**停止震动 */
        stop(): void;
        private shaking;
        private shakeComplete;
        onDestroy(): void;
        protected update(): void;
    }
}
