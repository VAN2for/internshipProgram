namespace ps {
    export class SKhelp extends qc.Behaviour {

       

        constructor(gameObject: qc.Node) {
            super(gameObject);


        }

        protected awake() {
            this.gameObject.interactive = true;
			
			let sk = this.gameObject as qc.Sprite;
			sk.playAnimation("fail",2,true);
        }


       

        protected update() {

        }

 
        onDown() {
           

        }

       
    }
    qc.registerBehaviour('ps.SKhelp', SKhelp);
}

