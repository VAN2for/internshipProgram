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
    /**
     * 空节点
     * @author yaoquan.wu
     */
    var EmptyNode = /** @class */ (function (_super) {
        __extends(EmptyNode, _super);
        function EmptyNode(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            if (qici.config.editor) {
                this.gameObject.colorTint = new qc.Color('#FAC415');
                this.gameObject.alpha = 0.12;
            } else {
                this.gameObject.alpha = 0;
            }
            /** 序列化 */
            _this.serializableFields = {
            };
            return _this;
        }
        EmptyNode.prototype.awake = function () {
            this.gameObject.interactive = true;
        };
        return EmptyNode;
    }(ps.Behaviour));
    ps.EmptyNode = EmptyNode;
    qc.registerBehaviour('ps.EmptyNode', EmptyNode);
})(ps || (ps = {}));
