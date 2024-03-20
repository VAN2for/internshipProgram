namespace ps.virtual {
    export class VirtualJoystick extends qc.Behaviour 
	{
		
		public static TOUCH_START:string = "VirtualJoystick_TOUCH_START";
		public static UPDATE:string = "VirtualJoystick_UPDATE";
		public static TOUCH_END:string = "VirtualJoystick_TOUCH_END";
		
		
		private ball:qc.Node;
		private autoInit:boolean = false;
		//半径
		private radius:number;
		
		
		private isWake:boolean = false;
		public signal:qc.Signal;
		
        private serializableFields: Object = {
            ball: qc.Serializer.NODE,
			autoInit:qc.Serializer.BOOLEAN
        }
		

        constructor(gameObject: qc.Node) {
            super(gameObject);
			this.radius = gameObject.width/2;
			this.signal = new qc.Signal();
        }
		
	

        protected awake() 
		{
			if(this.autoInit)
			{
				this.start();
			}
			
        }
		
		public onDown(pt:qc.PointerEvent):void
		{
			
			if(this.isWake == false)
			{
				return;
			}
			
			var pointer:qc.Pointer = pt.source as qc.Pointer ;
			var id:number = pointer.eventId;
			this.signal.dispatch(VirtualJoystick.TOUCH_START);
			
			this.ballMove(pt);
		}
		
		onDrag(pt){
			if(this.isWake == false)
			{
				return;
			}
			this.ballMove(pt);
		}
		
		onDragEnd(){
			this.onBallDragEnd();
		}
		
		public start():void
		{
			this.isWake = true;
		}
		
		public stop():void
		{
			this.isWake = false;
			this.onBallDragEnd();
		}
		
		//按下了小球
		private mouseDown(img:qc.UIImage,pt:qc.PointerEvent):void
		{
			var pointer:qc.Pointer = pt.source as qc.Pointer;
			var id:number = pointer.eventId;
			this.signal.dispatch(VirtualJoystick.TOUCH_START);
		}
		
		
		
		//拖动小球开始移动
		private ballMove(pt:qc.DragEvent):void
		{
			
			var pointer:qc.Pointer = pt.source as qc.Pointer;
			var _x:number = pointer.x;
			var _y:number = pointer.y;
			var localPt = this.gameObject.toLocal(new Phaser.Point(_x,_y));
			var centerPt = new Phaser.Point(this.radius,this.radius);

			var dist:number = Phaser.Point.distance(localPt, centerPt);
			var angle:number = Math.atan2(localPt.y - centerPt.y, localPt.x - centerPt.x);
			
			if(dist <= this.radius)
			{
				this.ball.x = localPt.x;
				this.ball.y = localPt.y;
			//手指距离在圆环范围外
			}else{
				this.ball.x = Math.cos(angle)*(this.radius) + this.radius;
				this.ball.y = Math.sin(angle)*(this.radius) + this.radius;
			}
			
			this.signal.dispatch(VirtualJoystick.UPDATE,angle);
			//console.log("angle="+angle);
		}
		
		//移动完毕
		private onBallDragEnd():void
		{
			
			
			this.ball.x = this.radius;
			this.ball.y = this.radius;
			
			this.signal.dispatch(VirtualJoystick.TOUCH_END);
		}
		
		
		onDestroy(){
			this.isWake = false;
			// this.signal.dispose();
			this.signal = null;
		}
		
        protected update() {
            
        }
    }
    qc.registerBehaviour('ps.virtual.VirtualJoystick', VirtualJoystick);
    VirtualJoystick["__menu"] = 'Custom/VirtualJoystick';
}
    
