class State extends qc.Behaviour {

  public states: qc.Texture[];
  public currState = 0;


  private serializableFields: Object = {
    states: qc.Serializer.TEXTURES,
    currState: qc.Serializer.INT,
  }

  constructor(gameObject: qc.Node) {
    super(gameObject);

    // Init the behaviour here
  }


  public changeState(id: number, resize: boolean = true): void {
    this.currState = id;
    (this.gameObject as qc.UIImage).texture = this.states[id];

    if (resize) {
      // if(window["picDesc"] && window["picDesc"]['num'+id+'_ui_png'])
      // {
      //     var s:string = window["picDesc"]['num'+id+'_ui_png'];
      //     var arr:any = s.split(",");
      //     (this.gameObject as qc.UIImage).width = parseInt(arr[0]);
      //     (this.gameObject as qc.UIImage).height = parseInt(arr[1]);
      // }else
      // {
      //     (this.gameObject as qc.UIImage).resetNativeSize();
      // }
      (this.gameObject as qc.UIImage).resetNativeSize();
    }


  }

  protected awake() {

  }

  protected update() {

  }


}
qc.registerBehaviour('State', State);


