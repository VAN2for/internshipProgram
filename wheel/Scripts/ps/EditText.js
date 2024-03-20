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
     * 编辑区编辑文本节点时添加的脚本
     * @author yaoquan.wu
     */
    var EditText = /** @class */ (function (_super) {
        __extends(EditText, _super);
        function EditText(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            this.proxyVisible = true;
            _this.serializableFields = {
                proxyVisible: qc.Serializer.BOOLEAN
            };
            _this.runInEditor = true;
            return _this;
        }
        EditText.prototype.awake = function () {
            this.gameObject.visible = this.proxyVisible;
        }
        return EditText;
    }(ps.Behaviour));
    ps.EditText = EditText;
    qc.registerBehaviour('ps.EditText', EditText);
})(ps || (ps = {}));
