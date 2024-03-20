/**
 * 移动的粒子组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.MoveParticle', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('移动的粒子', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 发射空间
    var EmissionSpace = {
        START: 0, //起始目标处
        END: 1, //结束目标处
        WORLD: 2, //世界
    }

    gui.columnWidths = ['100+0.1', '120+0.2', '1+0.01', '5+0.1', '5+0.1'];
    gui.line([
        gui.text('发射空间：'),
        gui.buttonGroup([
            {
                text: '起始目标处',
                value: EmissionSpace.START
            },
            {
                text: '结束目标处',
                value: EmissionSpace.END
            },
            {
                text: '世界',
                value: EmissionSpace.WORLD
            }
        ], { bind: 'emissionSpace' }), //绑定属性
    ]);

    // 绘制默认控件
    self.defaultDraw();

    // 空行
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.empty({ colspan: 3 })
    ]);

    // 刷新按钮
    gui.columnWidths = ["70+0.1"];
    gui.line([
        playBtn = gui.button('刷新'),
    ]);
    // 注册点击事件
    playBtn.on('click', function () {
        target.refresh();
    });

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});