var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ps;
(function (ps) {
    /**
     * 定义快捷查找对象的方法
     * 根据唯一名字查找对象
     */
    function find(uniqueName) {
        return qc.N(uniqueName);
    }
    ps.find = find;
    /**
     * 克隆物体或预设
     * @param node 物体或预设
     * @param parent 父亲
     */
    function Instantiate(node, parent) {
        return qc_game.add.clone(node, parent);
    }
    ps.Instantiate = Instantiate;
    /**
     * 根据Y对孩子的层次排序
     * @param parent 父容器
     */
    function sortChild(parent) {
        var arr = [];
        parent.children.forEach(function (element) {
            arr.push(element);
        });
        arr.sort(function (a, b) {
            return b.y - a.y;
        });
        arr.forEach(function (element) {
            parent.setChildIndex(element, 0);
        });
    }
    ps.sortChild = sortChild;
})(ps || (ps = {}));
/**
 * 根据名字获取子节点。
 * @param name 名字
 */
qc.Node.prototype.getChildByName = function (name) {
    var e_1, _a;
    try {
        for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            if (child.name === name)
                return child;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
/**
 * 根据名字获取子节点数组。
 * @param name 名字
 */
qc.Node.prototype.getChildsByName = function (name) {
    var e_2, _a;
    var list = [];
    try {
        for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            if (child.name === name) {
                list.push(child);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return list;
};
/**
 * 根据名字获取子节点。(递归)
 * @param name 名字
 */
qc.Node.prototype.getChild = function (name) {
    var e_3, _a;
    var child = this.getChildByName(name);
    if (child)
        return child;
    try {
        for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child_1 = _c.value;
            //if (child.name === name) return child;
            var r = child_1.getChild(name);
            if (r)
                return r;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
};
/**
 * 从父对象里移除自己
 */
qc.Node.prototype.removeSelf = function () {
    if (this.parent)
        this.parent.removeChild(this);
};
/**
 * 添加组件，同addScript
 * @param script 组件类或类名
 */
qc.Node.prototype.addComponent = function (script) {
    return this.addScript(script);
};
/**
 * 移除组件，同removeScript
 * @param script 组件类或类名
 */
qc.Node.prototype.removeComponent = function (script) {
    return this.removeScript(script);
};
/**
 * 获取组件，同getScript
 * @param script 组件类或类名
 */
qc.Node.prototype.getComponent = function (script) {
    return this.getScript(script);
};
//==================================================================
/**
 * 根据名字获取子节点。
 * @param name 名字
 */
qc.Behaviour.prototype.getChildByName = function (name) {
    return this.gameObject.getChildByName(name);
};
/**
 * 根据名字获取子节点数组。
 * @param name 名字
 */
qc.Behaviour.prototype.getChildsByName = function (name) {
    return this.gameObject.getChildsByName(name);
};
/**
 * 根据名字获取子节点。(递归)
 * @param name 名字
 */
qc.Behaviour.prototype.getChild = function (path) {
    return this.gameObject.getChild(path);
};
/**
 * 根据路径获取子节点。(同一级下如有同名可能会获取不到)
 * @param path 路径，用/分割
 */
qc.Behaviour.prototype.find = function (path) {
    return this.gameObject.find(path);
};
//==================================================================
/** 特殊处理IS渠道的适配 */
qc.ScaleAdapter.prototype["getTargetSize"] = function () {
    if (window["adWidth"] && window["adHeight"]) {
        ps.ScrFix.width = window["adWidth"];
        ps.ScrFix.width = window["adWidth"];
        return new qc.Point(window["adWidth"], window["adHeight"]);
    }
    var currTarget = this.target || this.gameObject.game.world;
    if (!currTarget || !currTarget.width || !currTarget.height)
        return new qc.Point(0, 0);
    return new qc.Point(currTarget.width, currTarget.height);
};
//==================================================================
qc.UIText.prototype.format = function (format) {
    var e_4, _a;
    var _b, _c, _d, _e;
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var valuesTranslate = [];
    try {
        for (var params_1 = __values(params), params_1_1 = params_1.next(); !params_1_1.done; params_1_1 = params_1.next()) {
            var value = params_1_1.value;
            if (typeof value == 'string')
                value = (_c = (_b = languagesMgr.getCfg(value)) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : value;
            valuesTranslate.push(value);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (params_1_1 && !params_1_1.done && (_a = params_1.return)) _a.call(params_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    this.text = String.format.apply(String, __spreadArray([(_e = (_d = languagesMgr.getCfg(format)) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : format], __read(valuesTranslate), false));
};
qc.UIText.prototype.updateStyle = function (key) {
    languagesMgr.updateLabel(this, key);
};
//# sourceMappingURL=Extra.js.map