namespace ps {
    /**
     * 缓动模块，使用代码添加缓动，跟方便的缓动接口
     * @author VaMP
     */
    export class Tween {
        /**
         * 缓动对象的props属性到目标值。可用scale参数代表scaleX跟scaleY
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param props 变化的属性列表，比如
         * @param duration 花费的时间，单位毫秒。
         * @param ease 缓动类型，默认为匀速运动。
         * @param delay 延迟执行时间。
         * @param autoStart 自动开始，默认true。如果要执行连续的缓动，请设置为false
         * @param repeat 重复次数，-1为无限，默认1。
         * @param yoyo 是否返回到原点，默认false。
         * @return 返回Tween对象。
         */
        static to(
            target: any,
            props: any,
            duration: number,
            ease?: Function | string,
            delay?: number,
            autoStart = true,
            repeat?: number,
            yoyo?: boolean
        ) {
            target = initTarget(target, props);
            initProps(props);
            let tween: Phaser.Tween;
            if (typeof ease === "string") {
                tween = game.add
                    .tween(target)
                    .to(props, duration, ease, autoStart, delay, repeat, yoyo);
            } else {
                tween = game.add
                    .tween(target)
                    .to(props, duration, ease, autoStart, delay, repeat, yoyo);
            }
            return tween;
        }
        /**
         * 缓动对象的props属性。可用scale参数代表scaleX跟scaleY
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param props 变化的属性列表，比如
         * @param duration 花费的时间，单位毫秒。
         * @param ease 缓动类型，默认为匀速运动。
         * @param delay 延迟执行时间。
         * @param autoStart 自动开始，默认true。如果要执行连续的缓动，请设置为false
         * @param repeat 重复次数，-1为无限，默认1。
         * @param yoyo 是否返回到原点，默认false。
         * @return 返回Tween对象。
         */
        static by(
            target: any,
            props: any,
            duration: number,
            ease?: Function | string,
            delay?: number,
            autoStart = true,
            repeat?: number,
            yoyo?: boolean
        ) {
            target = initTarget(target, props);
            initProps(props);
            let nprops = {};
            for (let k in props) {
                nprops[k] = props[k] + target[k];
            }
            return Tween.to(target, nprops, duration, ease, delay, autoStart, repeat, yoyo);
        }
        /**
         * 清理某个缓动。
         * @param tween 缓动对象。
         */
        static clear(tween: Phaser.Tween) {
            game.tweens.remove(tween);
        }
        /**
         * 清理指定目标对象上的所有缓动。
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         */
        static clearAll(target: any, isBehaviour = false) {
            if (!isBehaviour) target = initTarget(target);
            game.tweens.removeFrom(target);
        }
        //下面是方便的函数==========================================================================
        /**
         * 渐现
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param duration  花费的时间，单位毫秒。默认500毫秒
         * @param endValue 结束值，默认1
         * @param delay   延迟时间，单位毫秒。默认0毫秒
         * @param complete  完成时的回调
         */
        static showAlpha(
            target: any,
            duration: number = 500,
            endValue = 1,
            delay = 0,
            complete?: Function
        ) {
            target = initTarget(target);
            target.visible = true;
            target.alpha = 0;
            let tween = Tween.to(
                target,
                { alpha: endValue },
                duration,
                Phaser.Easing.Sinusoidal.InOut,
                delay
            );
            if (complete) tween.onComplete.addOnce(complete);
            return tween;
        }
        /**
         * 弹出
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param duration  花费的时间，单位毫秒。默认500毫秒
         * @param endValue 结束值，默认1
         * @param delay   延迟时间，单位毫秒。默认0毫秒
         * @param complete  完成时的回调
         */
        static showZoom(
            target: any,
            duration: number = 500,
            endValue = 1,
            delay = 0,
            complete?: Function
        ) {
            target = initTarget(target);
            target.visible = true;
            target.scaleX = 0;
            target.scaleY = 0;
            let tween = Tween.to(
                target,
                { scale: endValue },
                duration,
                Phaser.Easing.Back.Out,
                delay
            );
            if (complete) tween.onComplete.addOnce(complete);
            return tween;
        }
        /**
         * 渐隐
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param duration  花费的时间，单位毫秒。默认500毫秒
         * @param delay   延迟时间，单位毫秒。默认0毫秒
         * @param finishType  完成时的操作,null:无操作;  hide:visible=false;  remove:this.removeSelf()
         * @param complete  完成时的回调
         */
        static hideAlpha(
            target: any,
            duration: number = 500,
            delay = 0,
            finishType: null | "hide" | "remove" = null,
            complete?: Function
        ) {
            return Tween.hide("alpha", target, duration, delay, finishType, complete);
        }
        /**
         * 缩没
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param duration  花费的时间，单位毫秒。默认500毫秒
         * @param delay   延迟时间，单位毫秒。默认0毫秒
         * @param finishType  完成时的操作,null:无操作;  hide:visible=false;  remove:this.removeSelf()
         * @param complete  完成时的回调
         */
        static hideZoom(
            target: any,
            duration: number = 500,
            delay = 0,
            finishType: null | "hide" | "remove" = null,
            complete?: Function
        ) {
            return Tween.hide("zoom", target, duration, delay, finishType, complete);
        }
        /**
         * 隐藏
         * @param type 动画类型，有 "zoom" | "alpha" 两种
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param duration  花费的时间，单位毫秒。默认500毫秒
         * @param delay   延迟时间，单位毫秒。默认0毫秒
         * @param finishType  完成时的操作,null:无操作;  hide:visible=false;  remove:this.removeSelf()
         * @param complete  完成时的回调
         */
        static hide(
            type: "zoom" | "alpha" = "alpha",
            target: any,
            duration: number = 500,
            delay = 0,
            finishType: null | "hide" | "remove" | "null" = "hide",
            complete?: Function
        ) {
            let tween: Phaser.Tween;
            switch (type) {
                case "zoom":
                    tween = Tween.to(target, { scale: 0 }, duration, Phaser.Easing.Back.In, delay);
                    break;
                case "alpha":
                    tween = Tween.to(target, { alpha: 0 }, duration, undefined, delay);
                    break;
            }
            tween.onComplete.addOnce(() => {
                switch (finishType) {
                    case "null":
                        break;
                    case "hide":
                        target.visible = false;
                        break;
                    case "remove":
                        if (target.parent) target.parent.removeChild(target);
                        //target.removeSelf();
                        break;
                }
                if (complete) complete();
            });
            return tween;
        }

        /**
         * 一直缩放
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param scale 要放大的值，例如0.1表示放大到1.1
         * @param duration 单程持续时间，单位毫秒，例如500表示放大500毫秒，然后缩小500毫秒
         * @param delay 延迟执行时间。
         * @param autoStart 自动开始，默认true。
         */
        static zoom(target: any, scale: number, duration: number, delay = 0, autoStart = true) {
            return Tween.by(
                target,
                { scaleX: scale, scaleY: scale },
                duration,
                Phaser.Easing.Sinusoidal.InOut,
                delay,
                autoStart,
                -1,
                true
            );
        }
        /**
         * 一直闪烁
         * @param target  目标对象。如传入组件，则目标对象为组件的gameObject
         * @param duration  单程持续时间，单位毫秒
         * @param delay 延迟执行时间。
         * @param autoStart 自动开始，默认true。
         */
        static glint(target: any, duration: number, delay = 0, autoStart = true) {
            let ta = 0;
            if (target.alpha === 0) ta = 1;
            return Tween.to(
                target,
                { alpha: ta },
                duration,
                Phaser.Easing.Sinusoidal.InOut,
                delay,
                autoStart,
                -1,
                true
            );
        }
        /** 一直旋转
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param spd 角速度,默认为1，1秒转100度。
         * @param delay 延迟执行时间。
         * @param autoStart 自动开始，默认true。
         */
        static rotationLoop(target: any, spd: number = 100, delay = 0, autoStart = true) {
            let d = spd > 0 ? 1 : -1;
            return Tween.by(
                target,
                { rotation: Mathf.angleToRadian(360) * d },
                (360000 / spd) * d,
                undefined,
                delay,
                autoStart,
                -1
            );
        }
        /**
         * 一直来回移动
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param valueX 移动的X值
         * @param valueY 移动的Y值
         * @param duration 单程持续时间，单位毫秒
         * @param delay 延迟执行时间。
         * * @param autoStart 自动开始，默认true。
         */
        static moveYoyo(
            target: any,
            valueX: number,
            valueY: number,
            duration: number,
            delay = 0,
            autoStart = true
        ) {
            return Tween.by(
                target,
                { x: valueX, y: valueY },
                duration,
                Phaser.Easing.Sinusoidal.InOut,
                delay,
                autoStart,
                -1,
                true
            );
        }

        /**
         * 抖动式来回旋转（共4次
         * @param target 目标对象。如传入组件，则目标对象为组件的gameObject
         * @param times 扭动的次数，默认4次，为右，左，右，回中
         * @param value 旋转的角度
         * @param duration 持续时间
         * @param delay 延迟执行时间
         */
        static shakeRotation(target: any, times = 4, value = 5, duration = 50, delay?: number) {
            target = initTarget(target);
            let start = target.rotation;
            let easing = Phaser.Easing.Sinusoidal.InOut;
            let direction = -1;
            let tweener = Tween.to(
                target,
                { rotation: Mathf.angleToRadian(start + value) },
                duration,
                easing,
                delay,
                false
            );
            for (let i = 0; i < times - 2; i++) {
                tweener.to(
                    { rotation: Mathf.angleToRadian(start + value * direction) },
                    duration * 2,
                    easing
                );
                direction *= -1;
            }
            tweener.to({ rotation: Mathf.angleToRadian(start) }, duration, easing).start();
            return tweener.start();
        }
    }

    function initTarget(target: any, props?: any) {
        if (target instanceof qc.Behaviour) {
            if (props) {
                for (let key in props) {
                    if (target[key] != undefined) return target;
                }
            }
            return target.gameObject;
        }
        return target;
    }
    /** 个性化参数 */
    function initProps(props: any) {
        //添加scale参数，代表scaleX跟scaleY
        if (props.scale != undefined) {
            props.scaleX = props.scale;
            props.scaleY = props.scale;
            delete props.scale;
        }
        if (props.scaleXY != undefined) {
            props.scaleX = props.scaleXY;
            props.scaleY = props.scaleXY;
            delete props.scaleXY;
        }
    }
}
