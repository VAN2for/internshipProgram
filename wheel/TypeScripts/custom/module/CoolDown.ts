namespace ps {
    export class CoolDown extends ps.EventDispatcher {
        static FINISH = "finish";
        static DO = "do";
        static DOFALSE = "dofalse";
        static RESET = "reset";
        /** 名字 */
        name: string | number;
        /** 冷却持续时间 */
        duration: number;
        /** 剩余时间 */
        remainingTime: number = 0;
        /** 完成百分比 */
        get percentage() {
            return 1 - this.remainingTime / this.duration;
        }
        /** 是否暂停 */
        isPause = true;
        /** 时间缩放 */
        timeScale = 1;
        /**
         * 冷却时间模块
         * @param name 名字
         * @param duration 冷却持续时间
         * @author VaMP
         */
        constructor(name: string | number, duration: number, ) {
            super();
            this.name = name;
            this.duration = duration;
            ps.updateList.add(this);
        }
        /**
         * 重新开始CD计时 
         * @param duration 冷却持续时间,如不需要修改则不填
         */
        reset(duration?: number) {
            if (duration != undefined) this.duration = duration;
            this.remainingTime = this.duration;
            this.resume();
            this.dispatch(CoolDown.RESET, this.name);
        }
        /** 
         * 重新开始CD计时并暂停
         */
        resetAndPause() {
            this.remainingTime = this.duration;
            this.pause();
        }
        /** 是否在冷却期间内 */
        get inCD() {
            return this.remainingTime > 0;
        }
        /** 是否可以执行操作 */
        get canDo() {
            return !this.inCD;
        }
        /**
         * 更新倒计时
         * @param delta 更新间隔时间
         */
        update(delta: number) {
            if (this.isPause) return;
            if (this.inCD) {
                this.remainingTime -= delta / this.timeScale;
                if (this.canDo) {
                    this.dispatch(CoolDown.FINISH, this.name);
                    this.remainingTime = 0;
                }
            } else {
                this.remainingTime = 0;
            }
        }
        /** 执行操作,如果在CD期间，则执行失败 */
        do() {
            if (this.inCD) {
                this.dispatch(CoolDown.DOFALSE, this.name);
                return false;
            }
            this.reset();
            this.dispatch(CoolDown.DO, this.name);
            return true;
        }

        /** 恢复 */
        resume() {
            this.isPause = false;
        }
        /** 暂停计时 */
        pause() {
            this.isPause = true;
        }
        /** 刷新CD */
        refresh() {
            this.remainingTime = 0;
        }
        /** 销毁 */
        destroy() {
            super.destroy();
            //
            ps.updateList.remove(this);
        }
    }
}