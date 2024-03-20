namespace ps {
    /**
     * 滑动控制器
     * @author  VaMP
     */
    class SlidingController extends ps.Behaviour {
        /** 序列化 */
        private serializableFields: Object = {
            pointer: qc.Serializer.POINT,
            spd: qc.Serializer.POINT,
            damp: qc.Serializer.POINT,
            areaX: qc.Serializer.POINT,
            areaY: qc.Serializer.POINT,
        };
        /** 摇杆点数据（起始位置） */
        pointer = new qc.Point();
        /** 滑动速度比例 */
        spd = new qc.Point(1, 1);
        /** 阻尼效果值 */
        damp = new qc.Point(4, 4);
        /** X操作范围(两个都0则不限制) */
        areaX = new qc.Point();
        /** Y操作范围(两个都0则不限制) */
        areaY = new qc.Point();
        //-----------------------
        /** 当前滑动控制器位置X */
        get px() {
            return this.pointer.x;
        }
        /** 当前滑动控制器位置Y */
        get py() {
            return this.pointer.y;
        }

        /** 是否正在操作 */
        inTouch = false;
        canCtrl = true;

        private tx: number = 0;
        private ty: number = 0;
        private lastMouseX = 0;
        private lastMouseY = 0;

        private singal = new qc.Signal();
        private singalDown = new qc.Signal();
        private singalUp = new qc.Signal();

        awake() {
            this.tx = this.pointer.x;
            this.ty = this.pointer.y;
            this.gameObject.interactive = true;
        }
        setPointer(x, y) {
            this.pointer.x = x;
            this.pointer.y = y;
            this.tx = x;
            this.ty = y;
        }
        /** 设置X范围 */
        setAreaX(min: number, max?: number) {
            this.areaX.x = min;
            this.areaX.y = max;
            this.checkArea();
        }
        /** 设置Y范围 */
        setAreaY(min: number, max?: number) {
            this.areaY.x = min;
            this.areaY.y = max;
            this.checkArea();
        }
        /** 检测范围 */
        private checkArea() {
            if (this.areaX.x != this.areaX.y) {
                this.tx = Math.max(this.tx, this.areaX.x);
                this.tx = Math.min(this.tx, this.areaX.y);
            }
            if (this.areaY.x != this.areaY.y) {
                this.ty = Math.max(this.ty, this.areaY.x);
                this.ty = Math.min(this.ty, this.areaY.y);
            }
        }
        /**
         * 监听移动事件
         * @param type
         * @param listener
         * @param caller
         */
        listen(
            type: "move" | "up" | "down" = "move",
            listener: Function,
            caller?: any,
            isOnce = false
        ) {
            if (isOnce) {
                this.once(type, listener, caller);
            } else {
                this.on(type, listener, caller);
            }
        }
        /**
         * 监听移动事件
         * @param type
         * @param listener
         * @param caller
         */
        on(type: "move" | "up" | "down" = "move", listener: Function, caller?: any) {
            switch (type) {
                case "move":
                    this.singal.add(listener, caller);
                    break;
                case "up":
                    this.singalUp.add(listener, caller);
                    break;
                case "down":
                    this.singalDown.add(listener, caller);
                    break;
            }
        }
        /**
         * 监听移动事件
         * @param type
         * @param listener
         * @param caller
         */
        once(type: "move" | "up" | "down" = "move", listener: Function, caller?: any) {
            switch (type) {
                case "move":
                    this.singal.addOnce(listener, caller);
                    break;
                case "up":
                    this.singalUp.addOnce(listener, caller);
                    break;
                case "down":
                    this.singalDown.add(listener, caller);
                    break;
            }
        }

        onDown(e: qc.PointerEvent) {
            this.inTouch = true;
            this.lastMouseX = e.source.x;
            this.lastMouseY = e.source.y;
            this.singalDown.dispatch();
        }

        onDrag(e: qc.PointerEvent) {
            if (!this.inTouch) return;
            if (this.canCtrl) {
                this.tx += (e.source.x - this.lastMouseX) * this.spd.x;
                this.ty += (e.source.y - this.lastMouseY) * this.spd.y;
                this.checkArea();
                this.lastMouseX = e.source.x;
                this.lastMouseY = e.source.y;
            }
        }
        onUp(e: qc.PointerEvent) {
            this.inTouch = false;
            this.singalUp.dispatch();
        }

        update() {
            this.pointer.x = Mathf.damp(this.pointer.x, this.tx, this.damp.x);
            this.pointer.y = Mathf.damp(this.pointer.y, this.ty, this.damp.y);
            //发送事件
            if (this.pointer.x != this.tx || this.pointer.y != this.tx) {
                this.singal.dispatch(this.pointer.x, this.pointer.y);
            }
        }
    }
    qc.registerBehaviour("SlidingController", SlidingController);
}
