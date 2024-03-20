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
var DraggableItemSample = /** @class */ (function (_super) {
    __extends(DraggableItemSample, _super);
    function DraggableItemSample(gameObject) {
        return _super.call(this, gameObject) || this;
    }
    DraggableItemSample.prototype.onStart = function () {
        this.addListen();
    };
    DraggableItemSample.prototype.addListen = function () {
        var messageText = UIRoot.getChild('messageText');
        var _loop_1 = function (i) {
            var item = UIRoot.getChild('item' + i);
            var DraggableItem = item.getScript(ps.DraggableItem);
            DraggableItem.itemEvent.add(ps.DraggableItemEvent.MissTarget, function (endPoint) { messageText.text = "item".concat(i, "\u5F52\u4F4D\u3002\n\u9519\u8BEF\u4F4D\u7F6E\u4E3A").concat(endPoint.x.toFixed(0), ",").concat(endPoint.y.toFixed(0)); });
            DraggableItem.itemEvent.add(ps.DraggableItemEvent.TriggerTarget, function () { messageText.text = "item".concat(i, "\u89E6\u53D1\u76EE\u6807\uFF01"); });
        };
        for (var i = 1; i < 5; i++) {
            _loop_1(i);
        }
    };
    return DraggableItemSample;
}(ps.Behaviour));
qc.registerBehaviour('DraggableItemSample', DraggableItemSample);
//# sourceMappingURL=DraggableItemSample.js.map