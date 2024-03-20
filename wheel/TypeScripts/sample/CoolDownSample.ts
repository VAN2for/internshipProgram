/** CD的名字类型 */
enum cdType {
    ctrlRemind
}
class CoolDownSample extends ps.Behaviour {
    cdName: string;
    duration: number;
    uiText: qc.UIText;
    finger: qc.Node;
    private cd: ps.CoolDown;
    private ctrlRemind: ps.CoolDown;
    /** 序列化 */
    private serializableFields: Object = {
        cdName: qc.Serializer.STRING,
        duration: qc.Serializer.NUMBER,
        uiText: qc.Serializer.NODE,
        finger: qc.Serializer.NODE,
    }
    onStart() {
        this.cd = ps.cdManager.addCD(this.cdName, this.duration);
        this.cd.add(ps.CoolDown.FINISH, () => {
            this.print("finish", true);
        })
        this.cd.add(ps.CoolDown.DO, () => {
            this.print("do", true);
        })
        this.cd.add(ps.CoolDown.DOFALSE, () => {
            this.print("do false", true);
        })
        //qc_game.time.timeScale =10;
        //状态切换机
        let state = new ps.SwitchState(() => {
            Tween.showAlpha(this.finger, 300);
            ps.Print.purple("显示指引");
        }, () => {
            Tween.hideAlpha(this.finger, 300);
            ps.Print.purple("隐藏指引");
        }, true)
        this.ctrlRemind = ps.cdManager.addCD(cdType.ctrlRemind, 3000);
        this.ctrlRemind.add(ps.CoolDown.DO, () => state.close());
        this.ctrlRemind.add(ps.CoolDown.FINISH, () => state.open());
    }

    update() {
        if (!this.cd) return;
        let str = `${this.cdName}:${Math.ceil(this.cd.percentage * 100)}% ${this.cd.remainingTime}`;
        this.uiText.text = str;
        this.uiText.color = this.cd.canDo ? new qc.Color("#00ff00") : new qc.Color("#ff0000")
    }
    private print(text, print = false) {
        if (print) ps.Print.purple(this.cdName + ":" + text);
        else this.uiText.text = this.cdName + ":" + text;
    }
}
qc.registerBehaviour('CoolDownSample', CoolDownSample);