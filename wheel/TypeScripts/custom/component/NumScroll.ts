namespace ps {
    /**
     * 数字滚动组件
     * @author JingBin
     */
    export class NumScroll extends ps.Behaviour {
        gameObject: qc.UIText;
        prefix: string = "";
        curNum: number = 0; //当前数值
        addNum: number = 0; //添加数值
        chgInterval: number = 5; //每次翻滚数字时间间隔
        chgCount: number = 30; //翻滚数字的次数
        maxNum: number = 9999; //最大数值
        roundCnt: number = 0; //保留几位小数
        /** 是否每3位加一个"," */
        isComma: boolean = false;

        /** 序列化 */
        private serializableFields: Object = {
            prefix: qc.Serializer.STRING,
            curNum: qc.Serializer.NUMBER,
            addNum: qc.Serializer.NUMBER,
            chgInterval: qc.Serializer.NUMBER,
            chgCount: qc.Serializer.NUMBER,
            maxNum: qc.Serializer.NUMBER,
            roundCnt: qc.Serializer.INT,
            isComma: qc.Serializer.BOOLEAN,
        };

        constructor(gameObject: qc.UIText) {
            super(gameObject);
            this.playing = false;
            this.roundCnt = Math.abs(this.roundCnt);
            this.runInEditor = true;
        }

        awake() {
            let num = this.curNum = ps.Mathf.keepDecimal(this.curNum, this.roundCnt);
            num = Math.min(num, this.maxNum);
            num = ps.Mathf.keepDecimal(num, this.roundCnt);
            const text = this.prefix + ps.Tools.switchNum(num, this.isComma);
            if (this.gameObject.text !== text) {
                this.gameObject.text = text;
            }
        }

        refresh(add?: number) {
            if (this.playing) {
                return;
            }
            if (add != void 0) {
                this.addNum = add;
            }
            this.awake();
            this.playNum();
        }

        private playDelay: qc.TimerEvent[] = [];
        private playing: boolean;
        private playStop: boolean;

        /** 播放数字切换效果 */
        private playNum() {
            if (!this.addNum) {
                return;
            }

            // 最后一滚直接变成最终值
            const lastUpdate: Function = () => {
                this.updateRender(this.curNum);
                this.playing = false;
            };

            const clearDelay: Function = () => {
                while (this.playDelay && this.playDelay.length) {
                    this.game.timer.remove(this.playDelay.shift());
                }
            };

            const change: Function = (random: number) => {
                const diffNum: number = random - baseNum; //与原数字的差
                const changeTimes: number = this.chgCount; //滚动次数
                const changeUnit: number = Mathf.keepDecimal(diffNum / changeTimes, this.roundCnt); //每次变化的值
                //依次变化
                let i: number = 0;
                const changeNum: Function = () => {
                    if (this.playStop) {
                        return;
                    }
                    this.playDelay[this.playDelay.length] = this.game.timer.add(
                        this.chgInterval,
                        () => {
                            if (this.playStop) {
                                return;
                            }
                            //最后一步指定最终值
                            if (i == changeTimes - 1) {
                                lastUpdate.call(this);
                                return;
                            } else {
                                //过程中
                                this.updateRender((baseNum += changeUnit));
                            }
                            i++;
                            changeNum();
                        }
                    );
                };
                changeNum();
            };

            const start: Function = () => {
                let max: number;
                let min: number;
                if (this.curNum > baseNum) {
                    max = this.curNum;
                    min = baseNum;
                } else {
                    max = baseNum;
                    min = this.curNum;
                }

                this.playStop = false;
                this.playing = true;
                change(this.curNum);
            };

            if (this.playing) {
                this.playStop = true;
                //不清除上次的延迟，即继续上次值播放到最新
                clearDelay.call(this);
                lastUpdate.call(this);
            }

            let baseNum: number = this.curNum;
            this.curNum += this.addNum;

            start();
        }

        updateRender(num: number) {
            if (num > this.curNum) {
                return;
            }

            num = Math.min(num, this.maxNum);

            num = Mathf.keepDecimal(num, this.roundCnt);

            const text = this.prefix + ps.Tools.switchNum(num, this.isComma);
            if (this.gameObject.text !== text) {
                this.gameObject.text = text;
            }
        }
    }
    qc.registerBehaviour("ps.NumScroll", NumScroll);
    NumScroll["__menu"] = "Custom/NumScroll";
}
