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
var ScaleAdapterMtg = /** @class */ (function (_super) {
    __extends(ScaleAdapterMtg, _super);
    function ScaleAdapterMtg(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.design_width = 0;
        _this.design_height = 0;
        _this.serializableFields = {
            // Put your fields here
            videoNode: qc.Serializer.NODE,
            design_width: qc.Serializer.NUMBER,
            design_height: qc.Serializer.NUMBER,
            referenceResolution_type: qc.Serializer.STRING
        };
        return _this;
        // if(qici.config.editor)
        // {
        //     this.game.timer.loop(200, this.editorUpdate, this);
        // }
    }
    ScaleAdapterMtg.prototype.editorUpdate = function () {
        if (this.firstScreen == false) {
            this.updateScreen();
        }
    };
    ScaleAdapterMtg.prototype.awake = function () {
        this.scaleAdaper = this.gameObject.getScript("qc.ScaleAdapter");
        this.updateScreen();
    };
    ScaleAdapterMtg.prototype.updateScreen = function () {
        if (this.scaleAdaper == null) {
            this.scaleAdaper = this.gameObject.getScript("qc.ScaleAdapter");
        }
        // 如果是自研素材, 直接 return
        // @ts-ignore
        if (window.PlaySmartEditorData) {
            var data = UIRoot.getScript('playsmart.editor.data');
            if (data && data.$data && data.$data.isTransformByPt) {
                return;
            }
        }
        var nodeMask = UIRoot.getChild("gamePlay").getScript("qc.NodeMask");
        if (!nodeMask) {
            nodeMask = UIRoot.getChild("gamePlay").addScript("qc.NodeMask");
        }
        nodeMask.enable = false;
        UIRoot.getChild("gamePlay").pivotX = UIRoot.getChild("gamePlay").pivotY = 0;
        // @ts-ignore
        UIRoot.getChild("gamePlay")._maxAnchor.x = UIRoot.getChild("gamePlay")._maxAnchor.y = 1;
        // @ts-ignore
        UIRoot.getChild("gamePlay")._minAnchor.x = UIRoot.getChild("gamePlay")._minAnchor.y = 0;
        UIRoot.getChild("gamePlay").anchoredX = UIRoot.getChild("gamePlay").anchoredY = 0;
        if (UIRoot.width > UIRoot.height) {
            this.scaleAdaper.referenceResolution = new qc.Point(1334, 750);
        }
        else {
            this.scaleAdaper.referenceResolution = new qc.Point(750, 1334);
        }
        if (UIRoot.width > UIRoot.height) {
            if (UIRoot.height / UIRoot.width > 750 / 1334) {
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_WIDTH;
                console.log(UIRoot.width / UIRoot.height + " == 宽适配");
            }
            else {
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_HEIGHT;
                console.log(UIRoot.width / UIRoot.height + " == 高适配");
            }
        }
        else {
            if (UIRoot.width / UIRoot.height > 750 / 1334) {
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_HEIGHT;
                console.log(UIRoot.width / UIRoot.height + " == 高适配");
            }
            else {
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_WIDTH;
                console.log(UIRoot.width / UIRoot.height + " == 宽适配");
            }
        }
        if (this.referenceResolution_type == "Horizontal") {
            if (ps.ScrFix.isP) {
                UIRoot.getChild("gamePlay").pivotX = UIRoot.getChild("gamePlay").pivotY = 0.5;
                // @ts-ignore
                UIRoot.getChild("gamePlay")._maxAnchor.x = UIRoot.getChild("gamePlay")._maxAnchor.y = 0.5;
                // @ts-ignore
                UIRoot.getChild("gamePlay")._minAnchor.x = UIRoot.getChild("gamePlay")._minAnchor.y = 0.5;
                UIRoot.getChild("gamePlay").anchoredX = UIRoot.getChild("gamePlay").anchoredY = 0;
                this.scaleAdaper.referenceResolution = new qc.Point(1334, 750);
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_WIDTH;
                UIRoot.getChild("gamePlay").width = 1334;
                UIRoot.getChild("gamePlay").height = 750;
            }
            nodeMask.enable = !ps.ScrFix.isL;
        }
        else if (this.referenceResolution_type == "Vertical") {
            if (ps.ScrFix.isL) {
                UIRoot.getChild("gamePlay").pivotX = UIRoot.getChild("gamePlay").pivotY = 0.5;
                // @ts-ignore
                UIRoot.getChild("gamePlay")._maxAnchor.x = UIRoot.getChild("gamePlay")._maxAnchor.y = 0.5;
                // @ts-ignore
                UIRoot.getChild("gamePlay")._minAnchor.x = UIRoot.getChild("gamePlay")._minAnchor.y = 0.5;
                UIRoot.getChild("gamePlay").anchoredX = UIRoot.getChild("gamePlay").anchoredY = 0;
                this.scaleAdaper.referenceResolution = new qc.Point(750, 1334);
                this.scaleAdaper.manualType = qc.ScaleAdapter.MANUAL_HEIGHT;
                UIRoot.getChild("gamePlay").width = 750;
                UIRoot.getChild("gamePlay").height = 1334;
            }
            nodeMask.enable = !ps.ScrFix.isP;
        }
    };
    ScaleAdapterMtg.prototype.onResize = function () {
        console.log("onResize");
        this.updateScreen();
    };
    ScaleAdapterMtg.prototype.update = function () {
    };
    return ScaleAdapterMtg;
}(ps.Behaviour));
qc.registerBehaviour('ps.ScaleAdapterMtg', ScaleAdapterMtg);
//# sourceMappingURL=ScaleAdapterMtg.js.map