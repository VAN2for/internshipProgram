/** 打砖块玩法模板 炮台组件 编辑器扩展 */
G.extend.inspector("ps.Fort", function () {
    var self = this,
        target = self.target;

    // 调用默认的绘制方法
    // self.defaultDraw();

    // 调用自己的绘制
    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.3', '120+0.1', '60+0.3'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('打砖块玩法炮台组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ["50+0.1", "120+0.3"];

    gui.line([
        gui.text("小球节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "bulletNode",
            }
        ),
    ]);

    gui.line([
        gui.text("小球数量文本节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "bulletNumNode",
            }
        ),
    ]);

    gui.line([
        gui.text("引导小球节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "guidebulletNode",
            }
        ),
    ]);

    gui.line([
        gui.text("触控节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "DragNode",
            }
        ),
    ]);

    gui.line([
        gui.text("碰撞回收节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "recycleNode",
            }
        ),
    ]);

    gui.line([
        gui.text("小球数量"),
        gui.intInput(
            {
                value: 1,
                min: 1,
                bind: 'bulletNumber'
            }
        )
    ])

    gui.line([
        gui.text("最小偏转角"),
        gui.intInput(
            {
                value: -75,
                min: -90,
                max: -1,
                bind: 'minRadian'
            }
        )
    ])

    gui.line([
        gui.text("最大偏转角"),
        gui.intInput(
            {
                value: 75,
                min: 1,
                max: 90,
                bind: 'maxRadian'
            }
        )
    ])

    gui.line([
        gui.text("小球发射速度(m/s)"),
        gui.numberInput(
            {
                value: 10,
                min: 0.1,
                bind: 'speedBase'
            }
        )
    ])

    gui.line([
        gui.text("引导小球反弹次数"),
        gui.intInput(
            {
                value: 1,
                min: 0,
                bind: 'reflectionNum'
            }
        )
    ])

    gui.line([
        gui.text('是否启用速度检查'),
        gui.checkBox({ bind: 'speedCheckFlag' })
    ])

    gui.columnWidths = ["130+0.1", "120+0.3"];

    gui.line([
        gui.text("小球数量key(动态参数中的key)"),
        gui.stringInput(
            {
                bind: 'bulletNumKey'
            }
        )
    ])

});
