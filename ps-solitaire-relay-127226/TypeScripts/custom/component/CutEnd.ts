class CutEnd extends qc.Behaviour {
    /** 序列化 */
    showTime = 300;//每一小格出现时间
    hideTIme = 300;//每一小格隐藏时间
    showTimeDelay = 600;//转场出现延迟时间
    hideTImeDelay = 1200;//转场消失延迟时间
    isPlay: boolean = true;
    private serializableFields: Object = {
        showTime: qc.Serializer.NUMBER,
        hideTIme: qc.Serializer.NUMBER,
        showTimeDelay: qc.Serializer.NUMBER,
        hideTImeDelay: qc.Serializer.NUMBER,
        isPlay: qc.Serializer.BOOLEAN,
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);
    }
    awake() {
        var sc=qc.Point
        this.initTurnBox();
        if(!this.isPlay) return;
        this.playMove();
    }
    playMove() {
        qc_game.timer.add(this.showTimeDelay, () => {
            for (var i = 0; i < this.turn_sps.length; i++) {
                ps.Tween.to(this.turn_sps[i], { scale: 1 }, this.showTime, undefined);
            }
        })
        qc_game.timer.add(this.hideTImeDelay, () => {
            for (var i = 0; i < this.turn_sps.length; i++) {
                ps.Tween.to(this.turn_sps[i], { scale: 0 }, this.hideTIme, undefined);
            }
        })
    }
    public turn_sps = [];
    public initTurnBox() {
        let num = 17;
        let sz = 1334 / num;
        let r = sz / 2;
        let clrs = [
            "#71FF3B",
            "#B3FF3C",
            "#49FF3C",
            "#40DCFF",
            "#3F8AFD",
            "#EA1EFF",
            "#6B24FF",
            "#FEC63E",
            "#FC2D57",
            "#F1FF3C",
        ];
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                let x = j * sz + r;
                let y = i * sz + r;
                var node = qc_game.add.node();
                node.width = sz;
                node.height = sz;
                node.x = x;
                node.y = y;
                node.pivotX = 0.5;
                node.pivotY = 0.5;
                let sp: qc.Graphics = new qc.Graphics(qc_game, this.gameObject);
                let clr = clrs[Math.floor(Math.random() * clrs.length)];
                var clo = new qc.Color(clr);
                sp.clear();
                sp.beginFill(clo.toNumber());
                sp.drawRect(0, 0, sz, sz);
                sp.endFill();
                sp.x = 0;
                sp.y = 0;
                node.addChild(sp);
                this.turn_sps.push(node);
                this.gameObject.addChild(node);
                node.scaleY = node.scaleX = 0;
            }
        }
    }
}
qc.registerBehaviour('CutEnd', CutEnd);
