/** 打砖块玩法模板 砖块组件 编辑器扩展 */
G.extend.inspector("ps.Brick", function () {
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
        gui.text('打砖块玩法砖块组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ["30+0.1", "120+0.3"];

    gui.line([
        gui.text("控制器节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "BrickControlNode",
            }
        ),
    ]);

    gui.line([
        gui.text("图片节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "imageNode",
            }
        ),
    ]);

    gui.line([
        gui.text("文本节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "textNode",
            }
        ),
    ]);

    gui.line([
        gui.text('碰撞区域及形状'),
        gui.buttonGroup([
            {
                text: '圆形',
                value: 'Circle'
            },
            {
                text: '矩形',
                value: 'Bounds'
            },
            {
                text: '实际像素',
                value: 'Edge'
            },
            {
                text: '实际宽高矩形',
                value: 'WidthHeight'
            },
        ], { bind: 'type', value: 'Bounds' })
    ]);

    gui.line([
        gui.text('种类'),
        gui.stringInput(
            {
                bind: 'specie'
            }
        )
    ])

    gui.line([
        gui.text('生命值'),
        gui.intInput(
            {
                value: 1,
                min: 1,
                bind: 'hitPoint'
            }
        )
    ])

    gui.columnWidths = ["120+0.1", "120+0.3"];

    gui.line([
        gui.text("被撞击时播放音乐节点"),
        gui.objectInput(
            {
                objectType: "node",
                target,
                bind: "contactAudio",
            }
        ),
    ]);

    gui.line([
        gui.text('生命值key(动态参数中的key)'),
        gui.stringInput(
            {
                bind: 'hitPointKey'
            }
        )
    ])

    gui.line([
        gui.text('是否根据宽高及行列设置节点位置'),
        gui.checkBox({ bind: 'resetXYFlag' })
    ])

    gui.columnWidths = ["120+0.1", "30+0.1", "60+0.5"];

    gui.line([
        gui.text("行列数"),
        gui.intInput({
            value: 1,
            min: 1,
            bind: "line",
        }),
        gui.intInput({
            value: 1,
            min: 1,
            bind: "column",
        }),
    ]);

    gui.columnWidths = ['70+0.1'];
    var button;
    gui.line([
        button = gui.button('刷新')
    ]);
    // 注册点击事件
    button.on('click', function (e) {
        target.awake();
    });

});
