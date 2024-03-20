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
     * 摄像机跟随，挂在有相机的对象上
     * @author  VaMP
     */
    var CameraFollow = /** @class */ (function (_super) {
        __extends(CameraFollow, _super);
        function CameraFollow() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** 序列化 */
            _this.serializableFields = {
                followNode: qc.Serializer.NODE,
                offset: qc.Serializer.POINT,
                dumplambda: qc.Serializer.NUMBER,
            };
            _this.offset = new qc.Point();
            _this.dumplambda = 10;
            return _this;
        }
        CameraFollow.prototype.awake = function () {
            this.camera = this.gameObject.getComponent(ps.Camera);
        };
        CameraFollow.prototype.initCameraPosition = function () {
            var position = this.gameObject.getWorldPosition();
            position = this.gameObject.toLocal(position);
            this.camera.pos(position.x, position.y);
        };
        CameraFollow.prototype.postUpdate = function () {
            if (this.followNode == null)
                return;
            var p = this.followNode.toGlobal(new qc.Point(this.gameObject.pivotX * this.gameObject.width, this.gameObject.pivotY * this.gameObject.height));
            p = this.gameObject.toLocal(p);
            var x = p.x - this.offset.x;
            var y = p.y - this.offset.y;
            var deltaTime = qc_game.time.deltaTime / 5000;
            x = ps.Mathf.damp(this.camera.x, x, this.dumplambda);
            y = ps.Mathf.damp(this.camera.y, y, this.dumplambda);
            this.camera.pos(x, y);
        };
        return CameraFollow;
    }(qc.Behaviour));
    qc.registerBehaviour("CameraFollow", CameraFollow);
})(ps || (ps = {}));
