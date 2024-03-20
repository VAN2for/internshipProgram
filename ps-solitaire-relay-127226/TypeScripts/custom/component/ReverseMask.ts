namespace ps {
    /**
 * 反向遮罩组件，该组件只支持 WebGL模式
 * 
 * @author badyoo
 * 需要对 graphics 属性进行绘画实现遮罩，或者往graphics里面添加显示对象
 */
export class ReverseMask extends ps.Behaviour
{
    /**
     * 遮罩的绘制对象
     */
    public graphics:qc.Graphics;
    /**
     * 遮罩背景的绘制对象
     */
    public bgGraphics:qc.Graphics;

    /**
     * 圆形效果遮罩的大小
     */
    public circleEffSize:number = 2000;
    public circleEffOffset:qc.Point = new qc.Point(0, 0); //原型效果原点
    private cacheAsBitmap:qc.CacheAsBitmap;
    private m_ratio:number = 0;

     /** 序列化 */
     private serializableFields: Object = {
        circleEffSize: qc.Serializer.NUMBER,
        circleEffOffset: qc.Serializer.POINT
    }

    constructor(gameObject: qc.Node)
    {
        super(gameObject);
        
    }
    
    public get ratio() : number {
        return this.m_ratio;
    }
    public set ratio(v : number) {
        this.m_ratio = v;
        this.graphics.clear();
        this.graphics.beginFill();
        this.graphics.drawCircle(this.circleEffOffset.x,this.circleEffOffset.y,this.circleEffSize*this.m_ratio);
        this.graphics.endFill();
        this.updateMask();
    }
    circleEff()
    {
        this.ratio = 1;
        game.add.tween(this).to({ratio:0},1000,Phaser.Easing.Linear.None,true);
    }
    awake()
    {   
        var node:qc.Node =  ReverseMask.newMask(this.gameObject,this.gameObject.width,this.gameObject.height);
        this.cacheAsBitmap = node.getScript('qc.CacheAsBitmap');
        this.graphics = node.find("graphics") as qc.Graphics;
        this.bgGraphics = node.find("bgGraphics") as qc.Graphics;
    }
    /**
     * 更新绘制对象后需要手动更新一次
     */
    updateMask()
    {
        this.cacheAsBitmap.dirty = true;
    }
    static newMask( node: qc.Node,width:number,height:number,color:number = 0,alpha:number = 1 )
    {
        if( PIXI["blendModesWebGL"] && PIXI["blendModesWebGL"][17] == null ) PIXI["blendModesWebGL"][17] = [ game.renderer["gl"].ZERO, game.renderer["gl"].ZERO];
        var g:qc.Graphics = new qc.Graphics(qc_game,node);
        g.name = "bgGraphics";
        // g.beginFill(0,0.7);
        // g.drawRect(-width>>1,-height>>1,width,height);
        // g.endFill();
        var g:qc.Graphics = new qc.Graphics(qc_game,node);
        g.name = "graphics"
        g.blendMode = 17;
        // g.beginFill();
        // g.drawCircle(0,0,300);
        // g.endFill();
        var cacheAsBitmap:qc.CacheAsBitmap = node.addScript('qc.CacheAsBitmap');
        return node;
    }
}
qc.registerBehaviour('ps.ReverseMask', ReverseMask);
ReverseMask["__menu"] = 'Custom/ReverseMask';
}
