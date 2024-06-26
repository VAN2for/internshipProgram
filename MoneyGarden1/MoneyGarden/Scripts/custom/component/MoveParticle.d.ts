declare namespace ps {
    enum EmissionSpace {
        START = 0,
        END = 1,
        WORLD = 2
    }
    /**
     * 移动的粒子组件
     * @description 创建粒子，移动到目标对象处
     * @author JingBin
     */
    class MoveParticle extends ps.Behaviour {
        textures: qc.Texture[];
        target: qc.Node;
        emissionSpace: EmissionSpace;
        life: number;
        lifeVar: number;
        endClear: boolean;
        interval: number;
        intervalVar: number;
        duration: number;
        durationVar: number;
        startPointVar: qc.Point;
        endPointVar: qc.Point;
        startScale: number;
        startScaleVar: number;
        endScale: number;
        endScaleVar: number;
        startAlpha: number;
        startAlphaVar: number;
        endAlpha: number;
        endAlphaVar: number;
        startRotation: number;
        startRotationVar: number;
        endRotation: number;
        endRotationVar: number;
        private endLife;
        private endLifeTime;
        private lastCreateTime;
        private nodePool;
        private currNodes;
        currLife: number;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.Node);
        awake(): void;
        refresh(): void;
        update(): void;
        /** 创建粒子 */
        private createNode;
        /** 启动粒子 */
        private startNode;
        /** 移除粒子 */
        private removeNode;
        /** 销毁所有粒子 */
        private destroyAllNode;
    }
}
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
