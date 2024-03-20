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
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    function State(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.serializableFields = {
            states: qc.Serializer.TEXTURES
        };
        return _this;
        // Init the behaviour here
    }
    State.prototype.changeState = function (id, resize) {
        if (resize === void 0) { resize = true; }
        this.gameObject.texture = this.states[id];
        if (resize) {
            // if(window["picDesc"] && window["picDesc"]['num'+id+'_ui_png'])
            // {
            //     var s:string = window["picDesc"]['num'+id+'_ui_png'];
            //     var arr:any = s.split(",");
            //     (this.gameObject as qc.UIImage).width = parseInt(arr[0]);
            //     (this.gameObject as qc.UIImage).height = parseInt(arr[1]);
            // }else
            // {
            //     (this.gameObject as qc.UIImage).resetNativeSize();
            // }
            this.gameObject.resetNativeSize();
        }
    };
    State.prototype.awake = function () {
    };
    State.prototype.update = function () {
    };
    return State;
}(qc.Behaviour));
qc.registerBehaviour('State', State);
