class StartBeh extends ps.Behaviour {
    /** 序列化 */
    private serializableFields: Object = {
    }
    constructor(gameObject: qc.Node) {
        super(gameObject);

    }
    awake(){
        var abby=ps.IosOrAndroid();
        console.log(abby);
        
    }
    onGameStart() {
        ps.Print.purple("onGameStart");
       
        
    }
}
qc.registerBehaviour('StartBeh', StartBeh);