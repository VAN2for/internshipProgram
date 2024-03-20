namespace ps {
    export class BtnControl extends qc.Behaviour {

        private yaogan: qc.Node;
        private targetMc: any;
        private serializableFields: Object = {
            targetMc: qc.Serializer.NODE,
            yaogan: qc.Serializer.NODE
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);


        }

        protected awake() {
            this.gameObject.interactive = true;


            var yaoganCtr = this.yaogan.getScript("ps.virtual.VirtualJoystick") as ps.virtual.VirtualJoystick;

            yaoganCtr.signal.add(this.yaoganCtr, this);
        }


        private yaoganCtr(eventName: string, data: any): void {
            if (eventName == "VirtualJoystick_UPDATE") {
                this.gameObject.rotation = data;
            }
        }

        protected update() {

        }

 
        onDown() {
            var mc: ps.MovieClip = this.targetMc.getScript("ps.MovieClip");
            if(mc.isPlaying)
            {
                mc.stop();
            } else
            {
                mc.resume();
            }
            

        }

        private playCom(aaa: ps.MovieClip): void {
            console.log(123);
            //this.targetMc.destroy();



        }
    }
    qc.registerBehaviour('ps.BtnControl', BtnControl);
}

