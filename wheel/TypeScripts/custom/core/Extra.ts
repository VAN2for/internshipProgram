declare let qici: {
    /** 一些配置信息 */
    config: {
        /** 编辑器模式下 */
        editor: boolean
        /** 视频类型 */
        videoType: ps.VideoType;
    }
};
declare namespace qc {
    /**
     * 定义快捷查找对象的方法
     * 根据唯一名字查找对象
     */
    function N(name: string): qc.Node;

    interface UIText {
        /**
         * 格式化多语言文本。例如：label.format("My name is {0}, and my age is {1}", "hubluesky", 18);
         * 大括号内的数字对应后面params参数对应的索引位置。
         * 
         * @param format 格式化的字符串
         * @param params 格式化参数
         */
        format(format: string, ...params: any[]): void;
        /**
         * 更新文本样式。
         * @param key 样式的key
         */
        updateStyle(key: string): void;
    }
}
namespace ps {
    /**
     * 定义快捷查找对象的方法
     * 根据唯一名字查找对象
     */
    export function find(uniqueName: string) {
        return qc.N(uniqueName);
    }
    /**
     * 克隆物体或预设
     * @param node 物体或预设
     * @param parent 父亲
     */
    export function Instantiate(node: qc.Node | qc.Prefab, parent?: qc.Node) {
        return qc_game.add.clone(node, parent)
    }
    /**
     * 根据Y对孩子的层次排序
     * @param parent 父容器
     */
    export function sortChild(parent: qc.Node) {
        let arr: qc.Node[] = [];
        parent.children.forEach(element => {
            arr.push(element);
        });
        arr.sort((a, b) => {
            return b.y - a.y
        })
        arr.forEach(element => {
            parent.setChildIndex(element, 0)
        });
    }
}
/**
 * 根据名字获取子节点。
 * @param name 名字
 */
qc.Node.prototype.getChildByName = function (name: string) {
    for (let child of this.children) {
        if (child.name === name) return child;
    }
}
/**
 * 根据名字获取子节点数组。
 * @param name 名字
 */
qc.Node.prototype.getChildsByName = function (name: string) {
    let list = [];
    for (let child of this.children) {
        if (child.name === name) {
            list.push(child);
        }
    }
    return list;
}
/**
 * 根据名字获取子节点。(递归)
 * @param name 名字
 */
qc.Node.prototype.getChild = function (name: string) {
    let child = this.getChildByName(name);
    if (child) return child;
    for (let child of this.children) {
        //if (child.name === name) return child;
        let r = child.getChild(name);
        if (r) return r;
    }
}
/**
 * 从父对象里移除自己
 */
qc.Node.prototype.removeSelf = function () {
    if (this.parent) this.parent.removeChild(this);
}
/**
 * 添加组件，同addScript
 * @param script 组件类或类名
 */
qc.Node.prototype.addComponent = function (script: any) {
    return this.addScript(script);
}
/**
 * 移除组件，同removeScript
 * @param script 组件类或类名
 */
qc.Node.prototype.removeComponent = function (script: any) {
    return this.removeScript(script);
}
/**
 * 获取组件，同getScript
 * @param script 组件类或类名
 */
qc.Node.prototype.getComponent = function (script: any) {
    return this.getScript(script);
}
//==================================================================
/**
 * 根据名字获取子节点。
 * @param name 名字
 */
qc.Behaviour.prototype.getChildByName = function (name: string) {
    return this.gameObject.getChildByName(name);
}
/**
 * 根据名字获取子节点数组。
 * @param name 名字
 */
qc.Behaviour.prototype.getChildsByName = function (name: string) {
    return this.gameObject.getChildsByName(name);
}
/**
 * 根据名字获取子节点。(递归)
 * @param name 名字
 */
qc.Behaviour.prototype.getChild = function (path: string) {
    return this.gameObject.getChild(path);
}
/**
 * 根据路径获取子节点。(同一级下如有同名可能会获取不到)
 * @param path 路径，用/分割
 */
qc.Behaviour.prototype.find = function (path: string) {
    return this.gameObject.find(path);
}
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
qc.UIText.prototype.format = function (this: any, format: string, ...params: any[]): void {
    let valuesTranslate: any[] = [];
    for (let value of params) {
        if (typeof value == 'string') value = languagesMgr.getCfg(value)?.value ?? value;
        valuesTranslate.push(value);
    }
    this.text = String.format(languagesMgr.getCfg(format)?.value ?? format, ...valuesTranslate);
}

qc.UIText.prototype.updateStyle = function (this: any, key: string): void {
    languagesMgr.updateLabel(this, key);
}