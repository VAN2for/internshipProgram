namespace ps {
    /** 游戏步骤 */
    export type StepType = "unknown" | "ready" | "step1" | "step2" | "step3" | "end";
    /** 最小等级 */
    export const LvMin = 1;
    /** 最大等级 */
    export const LvMax = 6;
    /** Items总数 */
    export const ItemsTotalCnt = 16;
    /** 获得金钱页面自动隐藏延迟 */
    export const GetMoneyViewAutoHideDelay = 1000;
    /** 自动获得金钱延迟 */
    export const AutoGetMoneyDelayMin = 3000;
    export const AutoGetMoneyDelayMax = 6000;
}