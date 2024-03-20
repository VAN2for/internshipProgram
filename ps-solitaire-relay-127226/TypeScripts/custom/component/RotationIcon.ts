class RotationIcon extends ps.Behaviour {
    /** 序列化 */

    isClick = true; // 是否支持点击
    isDrag = true;  // 是否支持拖拽
    node: qc.Node;  // 传入的旋转节点


    saveDown: number = Math.PI * 2;
    saveDrag: number = 0;  // 总的拖拽角度 逆时针会抵消

    private serializableFields: Object = {
        isClick: qc.Serializer.BOOLEAN,
        isDrag: qc.Serializer.BOOLEAN,
        node: qc.Serializer.NODE
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }

    awake() {
        this.gameObject.interactive = true;
    }

    onDrag(e: qc.DragEvent) {
        if (!this.isDrag) return;
        const p = e.source as qc.Pointer;
        let localPosition = this.node.parent.toLocal(new qc.Point(p.x, p.y)); // 转化为本地坐标
        let lastAngle = this.positiveAngle(this.node.rotation);
        let rotation = Math.atan2(localPosition.y, localPosition.x)
        let curAngle = this.positiveAngle(rotation);
        let deltaAngle = this.deltaAngle(curAngle, lastAngle);
        if (deltaAngle > Math.PI) {
            this.saveDrag += deltaAngle - Math.PI * 2;
        }
        else {
            this.saveDrag += deltaAngle;
        }
        this.node.rotation = rotation;
    }

    onDown(e: qc.DragEvent) {
        if (!this.isClick) return;
        const p = e.source as qc.Pointer
        let localPosition = this.node.parent.toLocal(new qc.Point(p.x, p.y));
        let lastAngle = this.positiveAngle(this.saveDown);
        let rotation = Math.atan2(localPosition.y, localPosition.x);
        let curAngle = this.positiveAngle(rotation);
        let deltaAngle = this.deltaAngle(curAngle, lastAngle);
        if (deltaAngle > Math.PI) {
            this.saveDown += deltaAngle - Math.PI * 2;
        }
        else {
            this.saveDown += deltaAngle;
        }
        this.saveDown = this.saveDown % (Math.PI * 2);
        ps.XTween.removeTargetTweens(this.node);
        ps.xtween(this.node).to(150, { rotation: this.saveDown }).start();
    }

    deltaAngle(target: number, current: number) { // 判断旋转的两个角度的增量值（都转为正数）
        if (target < current) target += Math.PI * 2;
        let d = (target - current) % (Math.PI * 2);
        return this.positiveAngle(d);
    }

    positiveAngle(radian: number) { //将旋转的角度都变成0到360°之间
        return radian > 0 ? radian : radian + Math.PI * 2;
    }
}
qc.registerBehaviour('RotationIcon', RotationIcon);
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
*/