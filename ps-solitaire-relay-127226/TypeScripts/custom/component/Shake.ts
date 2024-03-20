namespace ps {
    //震动坐标轴
    export enum ShakeXY {
        X = 0, //X
        Y = 1, //Y
        XY = 2, //XY
    }

    /**
     * 震动组件
     */
    export class Shake extends qc.Behaviour {

        initX: number;                //初始位置
        initY: number;
        duaringTime: number = 0.5;
        maxDis: number = 10;
        count: number = 0;           //计时器次数

        /**
         * 一秒震动次数
         */
        rate: number = 20;
        /** 震动坐标轴 */
        shakeXY: ShakeXY = ShakeXY.XY

        /**
         * 当前正在震动？
         */
        isShaking: boolean = false;

        playOnAwake: boolean = false;

        private evt: qc.TimerEvent;

        private serializableFields: Object = {
            playOnAwake: qc.Serializer.BOOLEAN,
            duaringTime: qc.Serializer.NUMBER,
            maxDis: qc.Serializer.NUMBER,
            rate: qc.Serializer.NUMBER,
            shakeXY: qc.Serializer.AUTO,
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        protected awake() {
            if (this.playOnAwake) {
                this.play();
            }

        }

        /**
         * 震动
         * @param        _duaringTime      震动持续时长（秒）
         * @param        _rate      震动频率(一秒震动多少次)
         * @param        _maxDis    震动最大距离
         */
        public play(_duaringTime?: number, _rate?: number, _maxDis?: number): void {
            if (this.isShaking) {
                this.shakeComplete();
            }


            if (_duaringTime != undefined) {
                this.duaringTime = _duaringTime;
            }
            if (_rate != undefined) {
                this.rate = _rate;
            }
            if (_maxDis != undefined) {
                this.maxDis = _maxDis;
            }

            this.isShaking = true;
            this.initX = this.gameObject.x;
            this.initY = this.gameObject.y;
            this.count = this.duaringTime * this.rate;
            var t: number = 1000 / this.rate;
            this.evt = qc_game.timer.loop(t, this.shaking, this);
        }

        /**停止震动 */
        public stop() {
            if (this.isShaking) {
                this.shakeComplete();
            }

        }


        private shaking(): void {
            this.count--;
            if (this.count == -1) {
                this.shakeComplete();
                return;
            }
            // Tween.clearAll(this.gameObject);
            switch (this.shakeXY) {
                case ShakeXY.X:
                    this.gameObject.x = this.initX - this.maxDis + Math.random() * this.maxDis * 2;
                    Tween.to(this.gameObject, { x: this.initX }, 999 / this.rate);
                    break;
                case ShakeXY.Y:
                    this.gameObject.y = this.initY - this.maxDis + Math.random() * this.maxDis * 2;
                    Tween.to(this.gameObject, { y: this.initY }, 999 / this.rate);
                    break;
                default:
                    this.gameObject.x = this.initX - this.maxDis + Math.random() * this.maxDis * 2;
                    this.gameObject.y = this.initY - this.maxDis + Math.random() * this.maxDis * 2;
                    Tween.to(this.gameObject, { x: this.initX, y: this.initY }, 999 / this.rate);
                    break;
            }
        }

        private shakeComplete(): void {
            this.isShaking = false;
            if (this.evt) qc_game.timer.remove(this.evt);
            if (this.gameObject && this.gameObject.parent) {
                Tween.clearAll(this.gameObject)
                switch (this.shakeXY) {
                    case ShakeXY.X:
                        this.gameObject.x = this.initX;
                        break;
                    case ShakeXY.Y:
                        this.gameObject.y = this.initY;
                        break;
                    default:
                        this.gameObject.x = this.initX;
                        this.gameObject.y = this.initY;
                        break;
                }
            }
        }

        onDestroy() {
            this.stop();
        }

        protected update() {

        }
    }
    qc.registerBehaviour('ps.Shake', Shake);
    Shake["__menu"] = 'Custom/Shake';
}

