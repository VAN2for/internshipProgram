class SlideSelecte extends ps.Behaviour {
    /** 序列化 */
    tarArr;//目标数组
    distance = 20;//滑动接触成功距离
    checkTar;//成功触碰目标
    private serializableFields: Object = {
        tarArr: qc.Serializer.NODES,
        distance: qc.Serializer.NUMBER,
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    onStart() {
        qc_game.input.onPointerMove.add(this.onMouseMove, this);//鼠标开始滑动
        qc_game.input.onPointerDown.add(this.onMouseDown, this);//鼠标按下
    }
    //起始位置
    private ox = 0;
    private oy = 0;
    onMouseDown(id, x, y) {
        this.ox = x;
        this.oy = y;
        this.pickWood(x, y);
    }
    onMouseMove(id, x, y) {
        this.pickWood(x, y);
    }
    public pointList = [];
    pickWood(x, y) {
        let pos
        let dis;
        this.pointList = ps.Mathf.pointListByDensity(this.ox, this.oy, x, y);
        for (let i = 0; i < this.tarArr.length; i++) {
            pos = ps.Tools.transPos(this.tarArr[i], this.gameObject);
            let tar = this.tarArr[i] as qc.Node;
            for (let i = 0; i < this.pointList.length; i++) {
                dis = ps.Mathf.getDistance(this.pointList[i].x, this.pointList[i].y, pos.x, pos.y);
                if (dis < this.distance && dis >= 0) {
                    this.checkTar = tar;
                    break;
                }
            }
        }
    }
    getTar() {
        if (!this.checkTar) return
        return this.checkTar;
    }
}
qc.registerBehaviour('SlideSelecte', SlideSelecte);