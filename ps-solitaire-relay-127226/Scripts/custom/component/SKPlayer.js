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
var ps;
(function (ps) {
    var SKPlayer = /** @class */ (function (_super) {
        __extends(SKPlayer, _super);
        function SKPlayer(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.playOnAwake = true;
            _this.loop = false;
            _this.speed = 1;
            _this.delay = 0;
            _this.isGameStart = 0;
            _this.isplayed = 0;
            /** 序列化 */
            _this.serializableFields = {
                playOnAwake: qc.Serializer.BOOLEAN,
                loop: qc.Serializer.BOOLEAN,
                animationName: qc.Serializer.STRING,
                speed: qc.Serializer.NUMBER,
                delay: qc.Serializer.NUMBER,
            };
            return _this;
        }
        SKPlayer.prototype.awake = function () {
             if (this.playOnAwake && this.gameObject.visible)
                this.play();
            // this.update();
        };
        SKPlayer.prototype.onStart = function () {
        };
        SKPlayer.prototype.update = function () {
            // if(this.gameObject.parent.getScript(ps.UserBehaviour) && this.gameObject.parent.getScript(ps.UserBehaviour).onDownCode == "playTweenWhenClick")
            // {
            //     return;
            // }
            // if (this.gameObject.visible && !this.isplayed && ps.hasStart)
            // {
            //     this.play();
            // }
        };
        SKPlayer.prototype.onEnd = function () {
        }
        SKPlayer.prototype.onSceneChange = function (id) {
            // if(this.gameObject.parent.getScript(ps.UserBehaviour) && this.gameObject.parent.getScript(ps.UserBehaviour).onDownCode == "playTweenWhenClick")
            // {
            //     return;
            // }
            // if (this.playOnAwake && this.gameObject.visible && ps.hasStart)
            //     this.play();
        };
        SKPlayer.prototype.play = function () {
            // 在非编辑器环境下，播放龙骨会有闪烁问题，为了优化闪烁问题，需要先隐藏龙骨，播放后展示。
            // 但是编辑器环境下，play 时获取 visible 的值会获取到一个 visible = false 的值，导致 layout 记录数值有错
            if (ps.ENV !== "EDITOR") {
                this.gameObject.visible = false;
                this.game.timer.add(10, function(){this.gameObject.visible = true}, this);
            }
            this.gameObject.playAnimation(this.animationName, this.speed, this.loop);
        };
        SKPlayer.prototype.onResize = function ()
        {
            // if(this.gameObject.parent.getScript(ps.UserBehaviour) && this.gameObject.parent.getScript(ps.UserBehaviour).onDownCode == "playTweenWhenClick")
            // {
            //     return;
            // }

            if (!this.gameObject.visible || !ps.hasStart )return;

            this.play();
        };
        return SKPlayer;
    }(ps.Behaviour));
    ps.SKPlayer = SKPlayer;
    qc.registerBehaviour('ps.SKPlayer', SKPlayer);
    SKPlayer["__menu"] = 'Custom/SKPlayer';
})(ps || (ps = {}));
