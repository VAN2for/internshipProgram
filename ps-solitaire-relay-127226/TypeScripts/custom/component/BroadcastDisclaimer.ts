namespace ps {
    /**
     * 
     * @description 
     * @author bin
     * @date 2023/02/17 17:50:06
     */
    export class BroadcastDisclaimer extends Behaviour {

        private disclaimerCopy: qc.Node;
        private copyLength: number;
        private cloneDisclaimerArr: qc.Node[] = [];
        private moveTimer: Function;
        private moveSpeed = -0.3;
        private intervalDis: number = 50;

        private maxDisX: number;
        private minDisX: number;
        private isOpen = false;


        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        /** 序列化 */
        private serializableFields: unknown = {
            disclaimerCopy: qc.Serializer.NODE,
            moveSpeed: qc.Serializer.NUMBER,
            intervalDis: qc.Serializer.NUMBER,
        };

        /** 试玩初始化的处理 */
        public onInit() {
            this.copyLength = (this.disclaimerCopy as qc.UIText).textPhaser.width;
            const disclaimerCopyLayout = this.disclaimerCopy.getScript('ps.Layout') as ps.Layout;
            if (disclaimerCopyLayout) {
                disclaimerCopyLayout.enable = false;
            }
            this.disclaimerCopy.x = 0;
            this.cloneAndMoveDisclaimer();
        }
        cloneAndMoveDisclaimer() {
            this.isOpen = true;
            this.disclaimerCopy.visible = false;

            if (this.copyLength < UIRoot.width) {
                this.disclaimerCopy.visible = true;
            } else {
                const disX: number[] = [];
                for (let i = 0; i < 5; i++) {
                    const clone = this.game.add.clone(this.disclaimerCopy, this.disclaimerCopy.parent);
                    clone.visible = true;
                    this.cloneDisclaimerArr.push(clone);
                    clone.x = (this.copyLength + this.intervalDis) * (i - 2);
                    disX.push(clone.x);
                }
                this.maxDisX = this.getMax(disX);
                this.minDisX = this.getMin(disX);

                this.moveTimer = ps.timer.frameLoop(() => {
                    const deltaTime = qc_game.time.deltaTime;
                    const moveDis = this.moveSpeed * deltaTime;

                    this.cloneDisclaimerArr.forEach(item => {
                        item.x += moveDis;
                        if (this.moveSpeed > 0) {
                            if (item.x >= this.maxDisX + this.copyLength) {
                                const gapdis = item.x - (this.maxDisX + this.copyLength + this.intervalDis);
                                item.x = this.minDisX + gapdis;
                            }
                        } else {
                            if (item.x <= this.minDisX - this.copyLength) {
                                const gapdis = item.x - (this.minDisX - this.copyLength - this.intervalDis);
                                item.x = this.maxDisX + gapdis;
                            }
                        }
                    })

                }, this);
            }
        }

        stopMoveAndClearCloneDisclaimer() {
            ps.timer.removeFrameLoop(this.moveTimer);
            this.cloneDisclaimerArr.forEach(item => {
                item.destroy();
            })
            this.cloneDisclaimerArr = [];
        }

        onResize() {
            if (this.isOpen) {
                this.stopMoveAndClearCloneDisclaimer();
                this.cloneAndMoveDisclaimer();
            }
        }

        getMax(arr: number[]) {
            let number: number = arr[0];
            for (let i = 1; i < arr.length; i++) {
                if (number < arr[i]) number = arr[i];
            }
            return number;
        }

        getMin(arr: number[]) {
            let number: number = arr[0];
            for (let i = 1; i < arr.length; i++) {
                if (number > arr[i]) number = arr[i];
            }
            return number;
        }
    }
    qc.registerBehaviour("ps.BroadcastDisclaimer", BroadcastDisclaimer);
    BroadcastDisclaimer["__menu"] = "Custom/BroadcastDisclaimer";
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