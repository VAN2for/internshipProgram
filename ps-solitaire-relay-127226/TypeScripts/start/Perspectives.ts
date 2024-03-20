namespace ps {
    export class Perspectives extends qc.Behaviour {
        private serializableFields: Object = {
            // Put your fields here
        }

        constructor(gameObject: qc.Node) {
            super(gameObject);

            // Init the behaviour here




            console.log("drawcomplete")
        }

        protected awake() {
            var sp: qc.Graphics = new qc.Graphics(qc_game, this.gameObject);

            sp.beginFill(0x000000, 0.8);
            sp.drawCircle(0, 0, 500);
            sp.endFill();

            // sp.blendMode = PIXI.blendModes.DIFFERENCE;



        }

        protected update() {

        }
    }
    qc.registerBehaviour('ps.Perspectives', Perspectives);
}

