/** 华容道玩法模板 碎片组件 编辑器扩展 */
G.extend.inspector("ps.KlotskiPuzzl", function () {
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
        gui.text('华容道玩法碎片组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ["120+0.1", "30+0.1", "60+0.5"];

    gui.line([
        gui.text("控制器节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "controlNode",
            },
            {
                colspan: 2,
            }
        ),
    ]);

    gui.line([
        gui.text("宽度"),
        gui.intInput(
            {
                value: 1,
                min: 1,
                bind: "width",
            },
            {
                colspan: 2,
            }
        ),
    ]);

    gui.line([
        gui.text("高度"),
        gui.intInput(
            {
                value: 1,
                min: 1,
                bind: "height",
            },
            {
                colspan: 2,
            }
        ),
    ]);

    gui.line([
        gui.text("起始XY坐标"),
        gui.intInput({
            value: 1,
            min: 1,
            bind: "startX",
        }),
        gui.intInput({
            value: 1,
            min: 1,
            bind: "startY",
        }),
    ]);

    gui.line([
        gui.text("目标XY坐标"),
        gui.intInput({
            value: 0,
            min: 0,
            bind: "targetX",
        }),
        gui.intInput({
            value: 0,
            min: 0,
            bind: "targetY",
        }),
    ]);

    gui.line([
        gui.text("正确时播放的音乐名称"),
        gui.stringInput(
            {
                bind: "goodAudioName",
            },
            {
                colspan: 2,
            }
        ),
    ]);

    gui.line([
        gui.text("无法移动时播放的音乐名称"),
        gui.stringInput(
            {
                bind: "waringAudioName",
                colspan: 2,
            },
            {
                colspan: 2,
            }
        ),
    ]);

    gui.line([
        gui.text("移动时播放的音乐名称"),
        gui.stringInput(
            {
                bind: "moveAudioName",
            },
            {
                colspan: 2,
            }
        ),
    ]);
});
