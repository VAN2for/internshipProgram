declare type eventPara = {
    fixtureA: any;
    fixtureB: any;
    gameObjectA: qc.Node;
    gameObjectB: qc.Node;
    contact: any;
    isBeginning: any;
};

declare namespace qc.Box2D {
    class Body extends qc.Behaviour {
        //type:qc.Box2D.BODY_TYPE.STATIC
        // 是否进入 awake 状态
        isAwake: Boolean;
        // 子弹模式（避免 tunneling）
        bullet: Boolean;
        // 是否为接收器模式
        sensor: Boolean;
        // 转向固定
        fixedRotation: Boolean;
        // 角速度
        angularVelocity: Number;
        // 角阻抗
        angularDamping: Number;
        // 速度
        linearVelocity: Phaser.Point;
        // 线性阻抗
        linearDamping: Number;
        // 重力倍数
        gravityScale: Number;

        // 碰撞事件
        onContact: qc.Signal;
        // Presolve 事件
        onPreSolve: qc.Signal;
        // Postsolve 事件
        onPostSolve: qc.Signal;
        // 初始化事件
        onBodyCreated: qc.Signal;
        // 形状变化事件
        onFixtureChanged: qc.Signal;
        /**
         *  category bits
         */
        categoryBits: number;
        /**
         * mask bits
         */
        maskBits: number;
        applyForce(x: number, y: number);
        applyImpulse(x: number, y: number);

        type: BODY_TYPE;
        fixtureType: FIXTURE_TYPE;
        friction: number;
        restitution: number;
    }

    /**
     * 刚体类型
     */
    export enum BODY_TYPE {
        /**
         * 静态
         */
        STATIC,
        /**
         * 运动学
         * Kinematics强调”运动“，是经典力学的一个分支，在研究的过程中不考虑是什么原因（也就是不考虑力）导致了运动。
         * 运动学研究的过程就是测量和计算运动量（kinematic quantities）并用来描述运动的过程。
         * 运动量包括：速度，加速度，位移，时间，和轨迹。
         */
        KINEMATIC,
        /**
         * 动态
         * Dynamic强调“力“， 要追究运动背后的driving force，即研究运动与“力”的关系，基本所有dynamic的方程的出发点都是牛顿定律，
         * 如F=ma，等式的一边是力F，另一边是运动速度v或加速度a，可以把dynamic看成牛顿定律的推广。
         * 研究动力学问题必须知道系统的拉格朗日量或者哈密顿量。
         * 一些对时间的微分方程我们也经常称之为dynamic system(动力系统)。
         */
        DYNAMIC,
    }

    /**
     * 形状类型
     */
    export enum FIXTURE_TYPE {
        /** 
         * 链形状
         * 链形状提供了方便的方法让我们通过连接线段来创建静态世界。
         * 连形状自动消除我们之前遇到的“鬼打墙”现象，并且链形状能够提供双向的碰撞模拟（链的两侧都可以发生碰撞）。
         */
        CHAIN,
        /** 圆 */
        CIRCLE,
        /** 多边形 */
        POLYGON,
    }
}
