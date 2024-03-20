declare namespace ps {
    /**
     * 数字滚动组件
     * @author JingBin
     */
    class NumScroll extends ps.Behaviour {
        gameObject: qc.UIText;
        prefix: string;
        prefixPosition: string;
        curNum: number;
        addNum: number;
        chgInterval: number;
        chgCount: number;
        maxNum: number;
        roundCnt: number;
        /** 是否每3位加一个"," */
        isComma: boolean;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.UIText);
        awake(): void;
        refresh(add?: number): void;
        private playDelay;
        private playing;
        private playStop;
        /** 播放数字切换效果 */
        private playNum;
        updateRender(num: number): void;
    }
}
