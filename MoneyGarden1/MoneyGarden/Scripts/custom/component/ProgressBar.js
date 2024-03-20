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
    var ProgressBar = /** @class */ (function (_super) {
        __extends(ProgressBar, _super);
        function ProgressBar(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            /** 序列化 */
            _this.serializableFields = {
                perChange: qc.Serializer.NUMBER
            };
            _this.progressBar = gameObject;
            return _this;
        }
        ProgressBar.prototype.onStart = function () {
            this.changeByDelta();
        };
        ProgressBar.prototype.changeByDelta = function () {
            var i = 0;
            var loop = function () {
                if (i++ > 20)
                    ps.timer.removeFrameLoop(loop);
                console.log(i);
            };
            ps.timer.frameLoop(loop);
        };
        ProgressBar.prototype.changeToTarget = function () {
        };
        ProgressBar.prototype.update = function () {
            // this.progressBar.value += this.perChange
        };
        return ProgressBar;
    }(ps.Behaviour));
    qc.registerBehaviour('ps.ProgressBar', ProgressBar);
})(ps || (ps = {}));
