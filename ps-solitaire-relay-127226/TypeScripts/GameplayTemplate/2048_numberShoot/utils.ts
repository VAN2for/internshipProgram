namespace ps {
    export interface GridNode {
        value: number;
        node: qc.Node;
        isStart: boolean;
    }

    export interface PointType {
        x: number;
        y: number;
        value: number;
    }

    export const graph = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 2, 0, 256, 0],
        [0, 4, 0, 64, 0],
        [0, 8, 4, 8, 0],
        [32, 16, 16, 64, 256]
    ];

    export enum mergeEvent {
        /**
         * 开始运行
         */
        Start,
        /**
         * 合并成功并创建新的节点
         */
        Merge,

        /**
         * 合并完成的调用
         */
        mergeComplete,
        /**
         * 发射数字
         */
        Shoot,
        /**
         * 2048数字射击玩法结束
         */
        End,
    }
}
