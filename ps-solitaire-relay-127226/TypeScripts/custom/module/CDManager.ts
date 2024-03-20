namespace ps {
    /**
     * CD管理器
     * @author  VaMP
     */
    class CDManager {
        private cdList = {};
        /**
         * 增加冷却时间，如果同名会重置之前的倒计时
         * @param name 名字
         * @param duration 冷却时间，单位是毫秒
         */
        addCD(name: string | number, duration: number) {
            let cd = this.getCD(name);
            if (cd) {
                cd.duration = duration;
                cd.reset(duration);
            } else {
                this.cdList[name] = new CoolDown(name, duration);
            }
            return this.cdList[name] as ps.CoolDown;
        }
        /**
         * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
         * @param type		事件的类型。
         * @param cb	事件侦听函数。
         * @param caller	事件侦听函数的执行域。
         * @return 此 EventDispatcher 对象。
         */
        on(name: string | number, cb: Function, caller?) {
            let cd = this.getCD(name);
            return cd.add(CoolDown.FINISH, caller, cb);
        }
        /**
         * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
         * @param type		事件的类型。
         * @param cb	事件侦听函数。
         * @param caller	事件侦听函数的执行域。
         * @return 此 EventDispatcher 对象。
         */
        once(name: string | number, cb: Function, caller?) {
            let cd = this.getCD(name);
            return cd.add(cd.name, caller, cb);
        }
        /**
         * 销毁
         * @param name 名字
         */
        destroy(name: string | number) {
            let cd = this.getCD(name);
            if (cd) {
                cd.destroy();
                this.cdList[name] = undefined;
            }
        }
        /**
         * 获得倒计时对象
         * @param name 名字
         */
        getCD(name: string | number): CoolDown {
            return this.cdList[name];
        }
        /**
         * 当前剩余时间
         * @param name 名字
         */
        getRemainingTime(name: string | number) {
            return this.getCD(name).remainingTime;
        }
        /**
         * 是否在冷却期间内
         * @param name 名字
         */
        inCD(name: string | number) {
            return this.getCD(name).inCD;
        }
        /**
         * 是否可以执行操作
         * @param name 名字
         */
        canDo(name: string | number) {
            return this.getCD(name).canDo;
        }
        /**
         * 执行操作
         * @param name 名字
         */
        do(name: string | number) {
            let cd = this.getCD(name);
            if (cd) return cd.do();
        }
        /**
         * 更新倒计时
         * @param delta 更新间隔时间
         */
        update(delta: number) {
            for (let name in this.cdList) {
                (this.cdList[name] as ps.CoolDown).update(delta);
            }
        }
    }
    /** CD管理器 */
    export let cdManager = new CDManager();
    ps.updateList.add(cdManager);
}