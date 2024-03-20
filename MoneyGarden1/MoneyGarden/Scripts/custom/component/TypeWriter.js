var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ps;
(function (ps) {
    /**
     * 打字机组件
     * @description 可用于文本，实现打字机的效果
     * @author Abby
     */
    var TypeWriter = /** @class */ (function (_super) {
        __extends(TypeWriter, _super);
        function TypeWriter(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.interval = 10;
            _this.delay = 1;
            _this.isAutoStart = true;
            /** 序列化 */
            _this.serializableFields = {
                interval: qc.Serializer.NUMBER,
                delay: qc.Serializer.NUMBER,
                isAutoStart: qc.Serializer.BOOLEAN
            };
            return _this;
        }
        TypeWriter.prototype.awake = function () {
            var wirteConfig = {
                interval: this.interval,
                delay: this.delay, //每个字符出现的延迟时间
            };
            if (!this.isAutoStart)
                return;
            this.typewriter(this.gameObject, wirteConfig.interval, wirteConfig.delay);
        };
        //打字机效果
        TypeWriter.prototype.typewriter = function (label, interval, delay) {
            var _this = this;
            if (delay === void 0) { delay = 1; }
            var string = label.text;
            var i = 0;
            label.text = " ";
            qc_game.timer.add(delay, function () {
                _this.setText(label, string, 0);
                qc_game.timer.loop(interval, function () {
                    i++;
                    var isFinish = _this.setText(label, string, i);
                    if (isFinish) {
                    }
                });
            });
        };
        TypeWriter.prototype.setText = function (label, string, index) {
            label.text = (string.slice(0, index));
            return index >= string.length;
        };
        return TypeWriter;
    }(ps.Behaviour));
    ps.TypeWriter = TypeWriter;
    qc.registerBehaviour('ps.TypeWriter', TypeWriter);
    TypeWriter["__menu"] = 'Custom/TypeWriter';
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
    pl状态回调(onInit、onStart、onEnding、onRetry)
    如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
    */
})(ps || (ps = {}));
