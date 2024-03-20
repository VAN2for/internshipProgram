/** 经营玩法模板 点击升级组件 编辑器扩展 */
G.extend.inspector('ps.UpgradeButton', function () {
    var self = this,
        target = self.target;

    // 调用默认的绘制方法
    // self.defaultDraw();

    // 调用自己的绘制
    var gui = qc.editor.gui;
    gui.columnWidths = ["110+0.1", "60+0.5"];

    gui.line([
        gui.text('初始状态数值'),
        gui.numberInput({
            bind: "state",
        }),
    ]);

    gui.line([
        gui.text('每次升级状态添加值'),
        gui.numberInput({
            bind: "stateAddNum",
        }),
    ]);

    gui.line([
        gui.text('状态数值文本节点'),
        gui.objectInput({
            objectType: 'node',
            target,
            bind: "stateText",
        }),
    ]);

    gui.line([
        gui.text('初次升级所需货币'),
        gui.numberInput({
            bind: 'initCurrency'
        })
    ])

    gui.line([
        gui.text('每次升级货币添加倍数'),
        gui.numberInput({
            bind: "currencyAddMutiple",
        }),
    ]);

    gui.line([
        gui.text('所需货币数值文本节点'),
        gui.objectInput({
            objectType: 'node',
            target,
            bind: "currencyText",
        }),
    ]);
});