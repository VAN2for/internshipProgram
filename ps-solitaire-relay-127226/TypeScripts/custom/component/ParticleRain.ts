namespace ps.particle {
    export class ParticleRain extends qc.Behaviour {

        private t: qc.TimerEvent;
        private t2: qc.TimerEvent;
        private autoPlay: boolean = false;
        private gravityX: number = 0
        private gravityY: number = 0;
        private particles = [];

        /**
        * 播放时间 <= 0 就一直播放
        **/
        private playTime: number = 1000;
        /**
        * 创建间隔
        **/
        private createInterval: number = 100;


        private particleLife: number = 3000;
        private particleLifeFloating: number = 500;

        private speedX: number = -1;
        private speedXFloating: number = 2;

        private speedY: number = -2;
        private speedYFloating: number = -2;

        private scale: number = 0.6;
        private scaleFloating: number = 0.6;

        private rotationSpeed: number = 0;
        private rotationSpeedFloating: number = 0;

        private startX: number = 0;
        private startXFloating: number = 0;

        private startY: number = 0;
        private startYFloating: number = 0;

        private imgs: ParticleImage[] = [];

        private serializableFields: Object = {
            particles: qc.Serializer.TEXTURES,
            autoPlay: qc.Serializer.BOOLEAN,
            playTime: qc.Serializer.NUMBER,
            startX: qc.Serializer.NUMBER,
            startXFloating: qc.Serializer.NUMBER,
            startY: qc.Serializer.NUMBER,
            startYFloating: qc.Serializer.NUMBER,
            particleLife: qc.Serializer.NUMBER,
            particleLifeFloating: qc.Serializer.NUMBER,
            speedX: qc.Serializer.NUMBER,
            speedXFloating: qc.Serializer.NUMBER,
            speedY: qc.Serializer.NUMBER,
            speedYFloating: qc.Serializer.NUMBER,
            scale: qc.Serializer.NUMBER,
            scaleFloating: qc.Serializer.NUMBER,
            rotationSpeed: qc.Serializer.NUMBER,
            rotationSpeedFloating: qc.Serializer.NUMBER,
            createInterval: qc.Serializer.NUMBER,
            gravityX: qc.Serializer.NUMBER,
            gravityY: qc.Serializer.NUMBER,

        }

        constructor(gameObject: qc.Node) {
            super(gameObject);


        }

        protected awake() {
            if (this.autoPlay) {
                console.log("开始播放粒子");


                this.play(this.playTime);

            }
        }



        /**
        * 播放时间 <= 0 就一直播放
        **/
        public play(time: number = -1): void {
            if (this.t) {
                qc_game.timer.remove(this.t);
            }

            if (this.t2) {
                qc_game.timer.remove(this.t2);
            }
            this.t = null;
            this.t2 = null;

            if (time > 0) {
                this.t2 = qc_game.timer.add(time, this.stop, this);
            }
            this.t = qc_game.timer.loop(this.createInterval, this.creates, this);
        }

        /**
        * kill true 立即销毁目前所有的粒子
        **/
        public stop(kill: boolean = false): void {
            if (kill) {
                for (var i: number = 0; i < this.imgs.length; i++) {
                    var img: ParticleImage = this.imgs[i];
                    img.destroy();
                }
                this.imgs.length = 0;
            }

            if (this.t) {
                qc_game.timer.remove(this.t);
            }

            if (this.t2) {
                qc_game.timer.remove(this.t2);
            }
            this.t = null;
            this.t2 = null;
        }


        private creates(): void {
            var img: ParticleImage = new ParticleImage(qc_game, this.gameObject);//qc_game.add.image(this.gameObject);
            var index: number = Math.floor(Math.random() * this.particles.length);
            img.texture = this.particles[index];
            img.x = this.startX + Math.random() * this.startXFloating;
            img.y = this.startY + Math.random() * this.startYFloating;
            img.pivotX = img.pivotY = 0.5;
            img.createTime = qc_game.time.scaledTime;
            img.speedX = this.speedX + Math.random() * this.speedXFloating;
            img.speedY = this.speedY + Math.random() * this.speedYFloating;
            img.resetNativeSize();
            img.scaleX = img.scaleY = this.scale + Math.random() * this.scaleFloating;

            img.life = this.particleLife + Math.random() * this.particleLifeFloating;
            img.rotationSpeed = this.rotationSpeed + Math.random() * this.rotationSpeedFloating;

            this.imgs.push(img);
        }

        protected update() {
            var currentTime: number = qc_game.time.scaledTime;
            for (var i: number = 0; i < this.imgs.length; i++) {
                var img: ParticleImage = this.imgs[i];
                img.speedY += this.gravityY;
                img.speedX += this.gravityX;
                img.x += img.speedX;
                img.y += img.speedY;
                img.rotation += img.rotationSpeed / 180 * Math.PI;
                if (img.createTime + img.life < currentTime) {
                    img.destroy();
                    this.imgs.splice(i, 1);
                    i--;
                }
            }
        }

        onDestroy() {
            for (var i: number = 0; i < this.imgs.length; i++) {
                var img: ParticleImage = this.imgs[i];
                img.destroy();
            }
            if (this.t) {
                qc_game.timer.remove(this.t);
            }
            if (this.t2) {
                qc_game.timer.remove(this.t2);
            }
            this.t = null;
            this.t2 = null;
            this.imgs = null;
        }

    }
    qc.registerBehaviour('ps.particle.ParticleRain', ParticleRain);
    ParticleRain["__menu"] = 'Custom/ParticleRain';


    export class ParticleImage extends qc.UIImage {

        public speedX: number = 0;
        public speedY: number = 0;
        public createTime: number = 0;
        public life: number = 0;
        public rotationSpeed: number = 0;
        constructor(game, parent) {
            super(game, parent);
        }
    }
}

