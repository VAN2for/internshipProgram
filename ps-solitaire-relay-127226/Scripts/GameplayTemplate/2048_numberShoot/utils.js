var ps;
(function (ps) {
    ps.graph = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 2, 0, 256, 0],
        [0, 4, 0, 64, 0],
        [0, 8, 4, 8, 0],
        [32, 16, 16, 64, 256]
    ];
    var mergeEvent;
    (function (mergeEvent) {
        /**
         * 开始运行
         */
        mergeEvent[mergeEvent["Start"] = 0] = "Start";
        /**
         * 合并成功并创建新的节点
         */
        mergeEvent[mergeEvent["Merge"] = 1] = "Merge";
        /**
         * 合并完成的调用
         */
        mergeEvent[mergeEvent["mergeComplete"] = 2] = "mergeComplete";
        /**
         * 发射数字
         */
        mergeEvent[mergeEvent["Shoot"] = 3] = "Shoot";
        /**
         * 2048数字射击玩法结束
         */
        mergeEvent[mergeEvent["End"] = 4] = "End";
    })(mergeEvent = ps.mergeEvent || (ps.mergeEvent = {}));
})(ps || (ps = {}));
//# sourceMappingURL=utils.js.map