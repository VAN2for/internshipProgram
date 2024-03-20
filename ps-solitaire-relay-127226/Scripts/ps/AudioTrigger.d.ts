declare namespace ps.AudioTrigger {
    /**
     * 播放音效
     * @param gameObject 音效节点
     * @param param {{ isStop: boolean, loop: boolean, loopNumber: number }}
     * @param param.isStop 是否从头播放
     * @param param.loop 是否循环
     * @param param.loopNumber 播放次数
     */
    function playSound(gameObject: qc.Node, isStop: boolean, loop: boolean, loopNumber: number): void;
    /**
     * 暂停音效
     * @param gameObject 音效节点
     */
    function stopSound(gameObject: qc.Node): void;
}

