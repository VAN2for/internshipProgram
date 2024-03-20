var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };
  return function (d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var ActionType = {
CLICK: 'CLICK',
SWIPE_LEFT: 'SWIPE_LEFT',
SWIPE_RIGHT: 'SWIPE_RIGHT',
SWIPE_UP: 'SWIPE_UP',
SWIPE_DOWN: 'SWIPE_DOWN',
SWIPE_ANY: 'SWIPE_ANY',
HOLD: 'HOLD',
DOUBLE_CLICK: 'DOUBLE_CLICK'
};
var ps;
(function (ps) {
  /**
   * 场景跳转指令
   * @author VaMP
   */
  var SwitchSceneManager = /** @class */ (function (_super) {
      __extends(SwitchSceneManager, _super);
      function SwitchSceneManager(gameObject) {
          var _this = _super.call(this, gameObject) || this;
          _this.awakeCode = "";
          _this.onActionCode = "";
          _this.switchScene = "";
          _this.rootNode = "";
          _this.page = "";
          _this.actionManager = "";
          /** 序列化 */
          _this.serializableFields = {
              awakeCode: qc.Serializer.STRING,
              onActionCode: qc.Serializer.STRING,
              switchScene: qc.Serializer.STRING,
              rootNode: qc.Serializer.STRING,
              actionManager: qc.Serializer.STRING,
              currentActionManager: qc.Serializer.STRING
          };
          return _this;
      }
      SwitchSceneManager.prototype.awake = function () {
          if (this.onActionCode != "")
            this.gameObject.interactive = true;
      };
      SwitchSceneManager.prototype.onDown = function (e) {
          console.log("在屏幕按下时");
          if (this.onActionCode === ActionType.CLICK) {
            this.onActionClick(e);
          } else {
            var t = new Date().getTime();
            this.clickTime = t
            this.downX = e.source._x;
            this.downY = e.source._y;
          }
      };
      SwitchSceneManager.prototype.onUp = function (e) {
          var that = this;
          var t = new Date().getTime();
          if (t - that.clickTime > 800) {
            that.clickTime = 0;
            that.clickEndTime = 0;
            that.onHold(e);
          } else {
            if (this.onActionCode === ActionType.DOUBLE_CLICK && t - that.clickTime != 0 && t - that.clickEndTime <= 300) {
              that.clickTime = 0;
              that.clickEndTime = 0;
              that.onDouckClick(e);
            }
            that.clickEndTime = t;
          }
          console.log("onUp");
          // console.log("在屏幕抬起时");
          var minDelta = 30
          var isAny = false;
          if (e.source._x - that.downX > minDelta) {
              that.onMoveRight(e);
              isAny = true;
          }
          else if (e.source._x - that.downX < -1 * minDelta) {
              that.onMoveLeft(e);
              isAny = true;
          }

          if (e.source._y - that.downY < -1 * minDelta) {
              that.onMoveUp(e);
              isAny = true;
          }
          else if (e.source._y - that.downY > minDelta) {
              that.onMoveDown(e);
              isAny = true;
          }

          if(isAny)
          {
            that.onMoveAny(e);
          }
      };
      SwitchSceneManager.prototype.onHold = function (e) {
        if (this.onActionCode !== ActionType.HOLD) return
        this.switchSceneHandler()
        console.log("长按");
      };
      SwitchSceneManager.prototype.onActionClick = function (e) {
        if (this.onActionCode !== ActionType.CLICK) return
        this.switchSceneHandler()
        console.log("点击");
      };
      SwitchSceneManager.prototype.onMoveRight = function (e) {
        if (this.onActionCode !== ActionType.SWIPE_RIGHT) return
        this.switchSceneHandler()
        console.log("向右");
      };
      SwitchSceneManager.prototype.onMoveLeft = function (e) {
        if (this.onActionCode !== ActionType.SWIPE_LEFT) return
        this.switchSceneHandler()
        console.log("向左");
      };
      SwitchSceneManager.prototype.onMoveUp = function (e) {
        if (this.onActionCode !== ActionType.SWIPE_UP) return
        this.switchSceneHandler()
        console.log("向上");
      };
      SwitchSceneManager.prototype.onMoveDown = function (e) {
        if (this.onActionCode !== ActionType.SWIPE_DOWN) return
        this.switchSceneHandler()
        console.log("向下");
      };
      SwitchSceneManager.prototype.onMoveAny = function (e) {
        if (this.onActionCode !== ActionType.SWIPE_ANY) return
        this.switchSceneHandler()
        console.log("任意方向滑动");
      };
      SwitchSceneManager.prototype.onDouckClick = function (e) {
        if (this.onActionCode !== ActionType.DOUBLE_CLICK) return
        this.switchSceneHandler()
        console.log("双击屏幕时");
      };
      SwitchSceneManager.prototype.switchSceneHandler = function (e) {
        if(ps.mainState.isEnded)return;
        var that = this
        var parent = qc.gameOb.world.children[0]._findByName(this.rootNode)
        // if (this.switchScene !== 'end') {
          parent.children.forEach(function(item){
            if (item.uuid === that.switchScene) {
              item.visible = true
            } else {
              item.visible = false
            }
          })
        // }
        var vb = (typeof ps.VideoBeh === 'undefined') ? undefined : parent.getScript('ps.VideoBeh')
        if (typeof vb !== 'undefined' && vb !== null && vb.isEcPlus) {
          if (this.switchScene === 'end') {
            vb.startTurn()
          } else {
            vb.changeScene(this.switchScene)
          }
          ps.mainState.dispatch(ps.GameState.SCENECHANGE,this.switchScene);
        }
        parent.Animator.stop(this.currentActionManager)
        parent.Animator.play(this.actionManager)
        parent.Animator.playActionManager = this.actionManager
      }
      return SwitchSceneManager;
  }(ps.Behaviour));
  ps.SwitchSceneManager = SwitchSceneManager;
  qc.registerBehaviour('ps.SwitchSceneManager', SwitchSceneManager);
  SwitchSceneManager["__menu"] = 'Custom/SwitchSceneManager';
})(ps || (ps = {}));
/**
帧回调（preUpdate、update、postUpdate）
如果实现了这几个函数，系统会自动每帧进行调度（当挂载的Node节点处于可见、并且本脚本的enable=true时）
初始化（awake）
如果实现了awake函数，系统会在Node节点构建完毕（反序列化完成后）自动调度
脚本可用/不可用（onEnable、onDisable）
当脚本的enable从false->true时，会自动调用onEnable函数；反之调用onDisable函数
ps:在awake结束时,如果当前脚本的enable为true，会自动调用onEnable函数
交互回调（onClick、onUp、onDown、onDrag、onDragStart、onDragEnd）
当挂载的Node具备交互时，一旦捕获相应的输入事件，这些函数会自动被调用
脚本析构（onDestroy）
当脚本被移除时，会自动调用onDestroy函数，用户可以定义必要的资源回收代码
//PlaySmart新增回调(继承ps.Behaviour)
pl状态回调(onInit、onStart、onEnding、onRetry、onResize)
如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
*/ 
