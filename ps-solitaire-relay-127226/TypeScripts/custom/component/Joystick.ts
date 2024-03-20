/** 摇杆事件 */
enum JoystickEvent {
    ON_DOWN = "JoystickOnDown", //手指、鼠标按下
    ON_DRAG = "JoystickOnDrag", //手指、鼠标拖拽
    ON_UP = "JoystickOnUp", //手指、鼠标抬起
};

/** 摇杆显示类型 */
enum JoystickType {
    FIX = 0, //固定位置
    AUTO = 1, //自由位置
    AUTO_HIDE = 2, //自由位置，隐藏摇杆
};

namespace ps {
    /**
     * 摇杆组件
     * @description 触摸出现摇杆
     * @author JingBin
     */
    export class Joystick extends ps.Behaviour {
        ball: qc.UIImage; //小球
        circle: qc.UIImage; //圆环

        private _showType: JoystickType = JoystickType.AUTO; //摇杆显示类型

        private circleRadius: number = 0; //圆环半径
        private ballRadius: number = 0; //小球半径
        private centerX: number = 0; //中心点X坐标
        private centerY: number = 0; //中心点Y坐标
        private initPoint: qc.Point = new qc.Point();

        /** 序列化 */
        private serializableFields: Object = {
            ball: qc.Serializer.NODE,
            circle: qc.Serializer.NODE,
            _showType: qc.Serializer.NUMBER,
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        awake() {
            this.circle.visible = true;
            this.childrenCreated();
            this.initPoint.x = this.circle.anchoredX;
            this.initPoint.y = this.circle.anchoredY;
        }

        public get showType(): JoystickType {
            return this._showType;
        }
        public set showType(type: JoystickType) {
            if (type != void 0) {
                this._showType = type;
            }
            this.circle.visible = true;
        }

        public childrenCreated() {
            //获取圆环和小球半径
            this.circleRadius = this.circle.height / 2;
            this.ballRadius = this.ball.width / 2;
            //获取中心点
            // this.centerX = this.circleRadius;
            // this.centerY = this.circleRadius;
            //设置锚点
            this.gameObject.pivotX = .5;
            this.gameObject.pivotY = .5;
            //设置小球初始位置
            this.ball.x = this.centerX;
            this.ball.y = this.centerY;
        }

        private startX: number;
        private startY: number;
        private touchID: number;
        private isDown: boolean = false;

        onDown(e: qc.PointerEvent) {
            const pointer: qc.Pointer = e.source as qc.Pointer;
            if(this.isDown && this.touchID != pointer.id) return;
            this.isDown = true;
            this.touchID = pointer.id;

            this.startX = pointer.startX;
            this.startY = pointer.startY;

            const pt = new qc.Point(pointer.x, pointer.y);
            const localPt = this.circle.parent.toLocal(pt);
            this.circle.x = localPt.x;
            this.circle.y = localPt.y;

            this.ball.x = this.centerX;
            this.ball.y = this.centerY;


            let x = pointer.x - this.startX;
            let y = pointer.y - this.startY;

            const boundary = this.circleRadius - this.ballRadius * 0.5;

            // 获取手指和虚拟摇杆的距离
            this.p1.x = this.startX;
            this.p1.y = this.startY;
            this.p2.x = pointer.x;
            this.p2.y = pointer.y;

            let dist = this.p2.distance(this.p1);

            const angle: number = Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);

            if (dist <= boundary) {
                //手指距离在圆环范围内
                this.ball.x = x;
                this.ball.y = y;
            } else {
                //手指距离在圆环范围外
                this.ball.x = Math.cos(angle) * boundary + this.centerX;
                this.ball.y = Math.sin(angle) * boundary + this.centerY;
                dist = boundary;
            }

            main.gameEvent.dispatch(JoystickEvent.ON_DOWN, this.ball.x, this.ball.y, angle, dist / boundary);

            if (this.showType === JoystickType.AUTO_HIDE) {
                this.circle.visible = true;
            }
        }

        //触摸移动，设置小球的位置
        private p1: qc.Point = new qc.Point();
        private p2: qc.Point = new qc.Point();

        private moveBall(pointer: qc.Pointer) {
            // console.log(this.startX, this.startY, pointer.x, pointer.y);
            let x = pointer.x - this.startX;
            let y = pointer.y - this.startY;

            const boundary = this.circleRadius - this.ballRadius * 0.5;

            // 获取手指和虚拟摇杆的距离
            this.p1.x = this.startX;
            this.p1.y = this.startY;
            this.p2.x = pointer.x;
            this.p2.y = pointer.y;

            let dist = this.p2.distance(this.p1);

            const angle: number = Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);

            if (dist <= boundary) {
                //手指距离在圆环范围内
                this.ball.x = x;
                this.ball.y = y;
            } else {
                //手指距离在圆环范围外
                this.ball.x = Math.cos(angle) * boundary + this.centerX;
                this.ball.y = Math.sin(angle) * boundary + this.centerY;
                dist = boundary;
            }

            //派发事件
            main.gameEvent.dispatch(JoystickEvent.ON_DRAG, this.ball.x, this.ball.y, angle, dist / boundary);
        }

        onDrag(e: qc.DragEvent) {
            const pointer: qc.Pointer = e.source as qc.Pointer;
            if(this.isDown && this.touchID != pointer.id) return;
            this.moveBall(pointer);
        }

        onUp(e: qc.DragEndEvent) {
            const pointer: qc.Pointer = e.source as qc.Pointer;
            if(this.isDown && this.touchID != pointer.id) return;
            this.isDown = false;
            this.ball.x = this.centerX;
            this.ball.y = this.centerY;

            if (this.showType === JoystickType.AUTO) {
                this.circle.anchoredX = this.initPoint.x;
                this.circle.anchoredY = this.initPoint.y;
            } else if (this.showType === JoystickType.AUTO_HIDE) {
                this.circle.visible = false;
            }
            main.gameEvent.dispatch(JoystickEvent.ON_UP);
        }
    }
    qc.registerBehaviour('ps.Joystick', Joystick);
    Joystick["__menu"] = 'Custom/Joystick';
    /**
    帧回调（preUpdate、update、postUpdate）
    如果实现了这几个函数，系统会自动每帧进行调度（当挂载的Node节点处于可见、并且本脚本的enable=true时）
    初始化（awake）
    如果实现了awake函数，系统会在Node节点构建完毕（反序列化完成后）自动调度
    脚本可用/不可用（onEnable、onDisable）
    当脚本的enable从false->true时，会自动调用onEnable函数；反之调用onDisable函数
    ps:在awake结束时,如果当前脚本的enable为true，会自动调用onEnable函数
    交互回调（onClick、onUp、onDown、onDrag、onDragStart、onDragEnd）
    当挂载的Node具备交互时，一旦捕获相应的输入事件，这些函数会自动被调用
    脚本析构（onDestroy）
    当脚本被移除时，会自动调用onDestroy函数，用户可以定义必要的资源回收代码
    //PlaySmart新增回调(继承ps.Behaviour)
    pl状态回调(onInit、onStart、onEnding、onRetry)
    如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
    */
}