class ScaleAdapterMtg extends ps.Behaviour {
    public scaleAdaper:qc.ScaleAdapter;
    public videoNode:qc.Node;

    private firstScreen:boolean;

    private design_width = 0;
    private design_height = 0;

    private serializableFields: Object = {
        // Put your fields here
        videoNode:qc.Serializer.NODE,
        design_width:qc.Serializer.NUMBER,
        design_height:qc.Serializer.NUMBER,
        referenceResolution_type:qc.Serializer.STRING
    }
    private referenceResolution_type: string;

    constructor(gameObject: qc.Node) {
        super(gameObject);

        // if(qici.config.editor)
        // {
        //     this.game.timer.loop(200, this.editorUpdate, this);
        // }
    }

    editorUpdate()
    {
        if(this.firstScreen==false)
        {
            this.updateScreen();
        }
    }

    public awake() {
        this.scaleAdaper = this.gameObject.getScript("qc.ScaleAdapter");
        this.updateScreen();
    }

    public updateScreen()
    {
        if(this.scaleAdaper == null)
        {
            this.scaleAdaper = this.gameObject.getScript("qc.ScaleAdapter");
        }

        // 如果是自研素材, 直接 return
        // @ts-ignore
        if (window.PlaySmartEditorData) {
            const data = UIRoot.getScript('playsmart.editor.data')
            if (data && data.$data && data.$data.isTransformByPt) {
                return
            }
        }

        var nodeMask = UIRoot.getChild("gamePlay").getScript("qc.NodeMask")
        if(!nodeMask)
        {
            nodeMask = UIRoot.getChild("gamePlay").addScript("qc.NodeMask")
        }
        nodeMask.enable = false;
        UIRoot.getChild("gamePlay").pivotX = UIRoot.getChild("gamePlay").pivotY = 0;
        // @ts-ignore
        UIRoot.getChild("gamePlay")._maxAnchor.x = UIRoot.getChild("gamePlay")._maxAnchor.y = 1;
        // @ts-ignore
        UIRoot.getChild("gamePlay")._minAnchor.x = UIRoot.getChild("gamePlay")._minAnchor.y = 0;
        UIRoot.getChild("gamePlay").anchoredX = UIRoot.getChild("gamePlay").anchoredY = 0;
        if (UIRoot.width > UIRoot.height) {
            this.scaleAdaper.referenceResolution = new qc.Point(1334, 750);
        }
        else {
            this.scaleAdaper.referenceResolution = new qc.Point(750, 1334);
        }
        if (UIRoot.width > UIRoot.height) {
            if (UIRoot.height / UIRoot.width > 750 / 1334) {
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_WIDTH;
                console.log(UIRoot.width / UIRoot.height + " == 宽适配");
            }
            else {
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_HEIGHT;
                console.log(UIRoot.width / UIRoot.height + " == 高适配");
            }
        }
        else {
            if (UIRoot.width / UIRoot.height > 750 / 1334) {
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_HEIGHT;
                console.log(UIRoot.width / UIRoot.height + " == 高适配");
            }
            else {
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_WIDTH;
                console.log(UIRoot.width / UIRoot.height + " == 宽适配");
            }
        }

        if( this.referenceResolution_type == "Horizontal")
        {
            if (ps.ScrFix.isP) {
                UIRoot.getChild("gamePlay").pivotX = UIRoot.getChild("gamePlay").pivotY = 0.5;
                // @ts-ignore
                UIRoot.getChild("gamePlay")._maxAnchor.x = UIRoot.getChild("gamePlay")._maxAnchor.y = 0.5;
                // @ts-ignore
                UIRoot.getChild("gamePlay")._minAnchor.x = UIRoot.getChild("gamePlay")._minAnchor.y = 0.5;
                UIRoot.getChild("gamePlay").anchoredX = UIRoot.getChild("gamePlay").anchoredY = 0;
                this.scaleAdaper.referenceResolution = new qc.Point(1334,750)
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_WIDTH

                UIRoot.getChild("gamePlay").width = 1334;
                UIRoot.getChild("gamePlay").height = 750;
            }

            nodeMask.enable = !ps.ScrFix.isL;
        }
        else if(this.referenceResolution_type == "Vertical")
        {
            if (ps.ScrFix.isL) {
                UIRoot.getChild("gamePlay").pivotX = UIRoot.getChild("gamePlay").pivotY = 0.5;
                // @ts-ignore
                UIRoot.getChild("gamePlay")._maxAnchor.x = UIRoot.getChild("gamePlay")._maxAnchor.y = 0.5;
                // @ts-ignore
                UIRoot.getChild("gamePlay")._minAnchor.x = UIRoot.getChild("gamePlay")._minAnchor.y = 0.5;
                UIRoot.getChild("gamePlay").anchoredX = UIRoot.getChild("gamePlay").anchoredY = 0;
                this.scaleAdaper.referenceResolution = new qc.Point(750,1334)
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_HEIGHT
                UIRoot.getChild("gamePlay").width = 750;
                UIRoot.getChild("gamePlay").height = 1334;
            }
            nodeMask.enable = !ps.ScrFix.isP;
        }
    }

    protected onResize() {
        console.log("onResize");

        this.updateScreen();
    }

    protected update()
    {

    }
}
qc.registerBehaviour('ps.ScaleAdapterMtg', ScaleAdapterMtg);

