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
    DOWN: 'DOWN',
    UP: 'UP',
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
     * 新版ps的简易版事件
     * @author yaoquan.wu
     */
    var EventToy = /** @class */ (function (_super) {
        __extends(EventToy, _super);
        function EventToy(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            this.actionCode = [];
            this.actionList = ['hideUIAfterItWasClicked', 'doInstallAfterInstall', 'switchScene']
            /** 序列化 */
            _this.serializableFields = {
                actionCode: qc.Serializer.MAPPING
            };
            return _this;
        }
        EventToy.prototype.awake = function () {
            this.gameObject.interactive = true;
        };
        EventToy.prototype.onDown = function (e) {
            var t = new Date().getTime();
            this.clickTime = t
            this.downX = e.source._x;
            this.downY = e.source._y;
            this.onMouseDown(e);
        };
        EventToy.prototype.onUp = function (e) {
            var that = this;
            var t = new Date().getTime();
            if (t - that.clickTime > 3000) {
                that.clickTime = 0;
                that.clickEndTime = 0;
                that.onMouseUp(e);
                that.onHold(e);
            } else {
                var doubleClickInterval = 200
                if (t - that.clickTime != 0 && t - that.clickEndTime <= doubleClickInterval) {
                    that.clickTime = 0;
                    that.clickEndTime = 0;
                    that.onDouckClick(e);
                    return;
                }
                that.clickEndTime = t;
                that.onMouseUp(e);
            }

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

            if (isAny) {
                that.onMoveAny(e);
            }
        };
        EventToy.prototype.onMouseDown = function (e) {
            this.dispatchEvent(ActionType.DOWN);
        };
        EventToy.prototype.onMouseUp = function (e) {
            this.dispatchEvent(ActionType.UP);
        };
        EventToy.prototype.onHold = function (e) {
            this.dispatchEvent(ActionType.HOLD)
        };
        EventToy.prototype.onClick = function (e) {
            this.dispatchEvent(ActionType.CLICK)
        };
        EventToy.prototype.onMoveRight = function (e) {
            this.dispatchEvent(ActionType.SWIPE_RIGHT)
        };
        EventToy.prototype.onMoveLeft = function (e) {
            this.dispatchEvent(ActionType.SWIPE_LEFT)
        };
        EventToy.prototype.onMoveUp = function (e) {
            this.dispatchEvent(ActionType.SWIPE_UP)
        };
        EventToy.prototype.onMoveDown = function (e) {
            this.dispatchEvent(ActionType.SWIPE_DOWN)
        };
        EventToy.prototype.onMoveAny = function (e) {
            this.dispatchEvent(ActionType.SWIPE_ANY)
        };
        EventToy.prototype.onDouckClick = function (e) {
            this.dispatchEvent(ActionType.DOUBLE_CLICK)
        };
        EventToy.prototype.dispatchEvent = function (event) {
            // ps.mainState.dispatch(event, this.gameObject.uuid)
            console.log('EventToy: ',event, ' uuid: ', this.gameObject.uuid);
            var _this = this;
            var index = -1;
            for (var i in this.actionCode) {
                if(this.actionCode[i].handType === event) {
                    index = i;
                }
            }
            if(this.actionCode[index] && this.actionCode[index]['callback'].length > 0) {
                this.actionCode[index]['callback'].forEach(function(code) {
                    if (code.method === 'hideUIAfterItWasClicked') {
                        _this.hideUIAfterItWasClicked();
                    } else if (code.method === 'doInstallAfterInstall') {
                        _this.doInstallAfterInstall();
                    } else if (code.method === 'switchScene') {
                        _this.switchScene(code.param.sceneUuid);
                    }
                });
            }
        };
        EventToy.prototype.hideUIAfterItWasClicked = function () {
            this.gameObject.visible = false;
        };
        EventToy.prototype.doInstallAfterInstall = function () {
            ps.install();
        };
        EventToy.prototype.switchScene = function (sceneUuid) {
            var gamePlay = UIRoot.getChild('gamePlay');
            var vb = gamePlay.getScript('ps.VideoBeh');
            if (typeof vb !== 'undefined' && vb.isEcPlus) {
                var node = this.gameObject;
                while(node.parent !== gamePlay) {
                    node = node.parent;
                }
                node.visible = false;
                var nextScene = qc_game.nodePool.find(sceneUuid);
                nextScene.visible = true;
                var sc = nextScene.getScript('ps.SceneConfig');
                if (sc && sc.isEnding) {
                    ps.Print.blue("gameEnd");
                    window.gameEnd && window.gameEnd();
                }
                ps.mainState.dispatch(ps.GameState.SCENECHANGE, sceneUuid);
            }
        };
        return EventToy;
    }(ps.Behaviour));
    ps.EventToy = EventToy;
    qc.registerBehaviour('ps.EventToy', EventToy);
})(ps || (ps = {}));
