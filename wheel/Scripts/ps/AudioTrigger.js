var ps;
(function (ps) {
    (function (AudioTrigger) {
        /**
         * 播放音效
         * @param gameObject 音效节点
         * @param param {{ isStop: boolean, loop: boolean, loopNumber: number }}
         * @param param.isStop 是否从头播放
         * @param param.loop 是否循环
         * @param param.loopNumber 播放次数
         */
        function playSound(gameObject, isStop, loop, loopNumber) {
            if (typeof gameObject === 'undefined') {
                return;
            }
            var audioNode = gameObject.getScript('ps.AudioNode')
            if (audioNode) {
                audioNode.vpReplaySound({
                    isStop: isStop,
                    loop: loop,
                    loopNumber: loopNumber
                })
            }
        }
        AudioTrigger.playSound = playSound;
        /**
         * 暂停音效
         * @param gameObject 音效节点
         */
        function stopSound(gameObject) {
            if (typeof gameObject === 'undefined') {
                return;
            }
            var audioNode = gameObject.getScript('ps.AudioNode')
            if (audioNode) {
                audioNode.vpStopSound()
            }
        }
        AudioTrigger.stopSound = stopSound;
        
    })(AudioTrigger = ps.AudioTrigger || (ps.AudioTrigger = {}));
})(ps || (ps = {}));
//# sourceMappingURL=Audio.js.map