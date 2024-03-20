
class FingerSample extends ps.Behaviour {
    btn1: qc.Button;
    btn2: qc.Button;
    btn3: qc.Button;
    btn4: qc.Button;
    btn5: qc.Button;
    finger: ps.Finger;
    target1: qc.Node;
    target2: qc.Node;
    target3: qc.Node;
    target4: qc.Node;
    /** 序列化 */
    private serializableFields: Object = {
        btn1: qc.Serializer.NODE,
        btn2: qc.Serializer.NODE,
        btn3: qc.Serializer.NODE,
        btn4: qc.Serializer.NODE,
        btn5: qc.Serializer.NODE,
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    onStart() {
        this.finger = UIRoot.getChild("Finger").getComponent(ps.Finger);
        this.target1 = UIRoot.getChild("Target1");
        this.target2 = UIRoot.getChild("Target2");
        this.target3 = UIRoot.getChild("Target3");
        this.target4 = UIRoot.getChild("Target4");
        //
        this.btn1.onClick.add(this.showSample1, this);
        this.btn2.onClick.add(this.showSample2, this);
        this.btn3.onClick.add(this.showSample22, this);
        this.btn4.onClick.add(this.showSample3, this);
        this.btn5.onClick.add(this.showSample4, this);
        this.showSample1();
    }

    private showSample1() {
        //指向某个目标
        this.finger.hide();
        this.finger.show();
        this.finger.moveToTarget0(this.target1);
        this.finger.showScaleEffect();
    }
    private showSample2() {
        this.finger.hide();
        this.finger.show();
        this.finger.startLoop(() => {
            this.finger.moveToTarget(this.target1)
                .showImg()
                .scaleImg(0.8)
                .moveToTarget(this.target2, 1000)
                .scaleImg(1)
                .hideImg()
        });
    }

    private showSample22() {
        this.finger.hide();
        this.finger.show();
        this.finger.startLoop(() => {
            this.finger.moveToTarget(this.target3, 1)
                .moveToTarget(this.target4, 1000)
                .moveToTarget(this.target3, 1000)
        });
    }

    private showSample3() {
        this.finger.hide();
        this.finger.show();
        this.finger.startLoop(() => {
            this.finger.moveToTarget(this.target1, 1)
                .moveToTarget(this.target2, 1000)
                .moveToTarget(this.target3, 1000)
                .moveToTarget(this.target4, 1000)
                .moveToTarget(this.target1, 1000)
        });
    }
    private showSample4() {
        this.finger.hide();
        this.finger.show();
        this.finger.startLoop(() => {
            this.finger.moveToTarget(this.target1, 1)
                .showImg(200)
                .moveToTarget(this.target2, 1000)
                .hideImg(200)
                .moveToTarget(this.target3, 1)
                .showImg(200)
                .moveToTarget(this.target4, 1000)
                .hideImg(200)
        });
    }
}
qc.registerBehaviour('FingerSample', FingerSample);
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
pl状态回调(onInit、onStart、onEnding、onRetry、onResize)
如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
*/