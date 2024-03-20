/**
 * 拼图玩法 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
 G.extend.inspector('ps.WaterFluid', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('液态流体', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    // self.defaultDraw();
    gui.columnWidths = ['70+0.1', '100+0.2'];
    gui.line([
        gui.text('水滴刚体节点'),
        gui.objectInput({ objectType: 'node', target, bind: 'waterDrop' })
    ]);

    gui.columnWidths = ['70+0.1', '100+0.2'];
    gui.line([
        gui.text('水滴资源Texture'),
        gui.objectInput({ objectType: 'texture', target, bind: 'waterDropTexture' })
    ]);


    gui.columnWidths = ['70+0.1', '100+0.2'];
    gui.line([
        gui.text('水（渲染图片）'),
        gui.objectInput({ objectType: 'node', target, bind: 'waterImg' })
    ]);

    gui.columnWidths = ['80+0.1', '5+0.1', '30+0.1', '5+0.1', '30+0.1'];
    gui.line([
        gui.text('水整体偏移值'),
        gui.text('X'),
        gui.intInput({ bind: 'diffX' }),
        gui.text('Y'),
        gui.intInput({ bind: 'diffY' }),
    ]);

    gui.columnWidths = ['80+0.1', '5+0.1', '30+0.1', '5+0.1', '30+0.1'];
    gui.line([
        gui.text('水滴间隔'),
        gui.text('X'),
        gui.intInput({ bind: 'intervalX' }),
        gui.text('Y'),
        gui.intInput({ bind: 'intervalY' }),
    ]);

    gui.columnWidths = ['80+0.1', '5+0.1', '30+0.1', '5+0.1', '30+0.1'];
    gui.line([
        gui.text('水滴数量'),
        gui.text('纵向'),
        gui.intInput({ bind: 'quantityRow' }),
        gui.text('横向'),
        gui.intInput({ bind: 'quantityCol' }),
    ]);

    gui.columnWidths = ['70+0.1', '100+0.2'];
    gui.line([
        gui.text('水滴颜色'),
        gui.colorPicker({ bind: 'warterColor' })
    ]);

    gui.columnWidths = ['70+0.1', '100+0.2'];
    gui.line([
        gui.text('水滴边缘颜色'),
        gui.colorPicker({ bind: 'warterEdgeColor' })
    ]);

    gui.columnWidths = ['70+0.1', '100+0.2'];
    gui.line([
        gui.text('水滴透明度'),
        gui.sliderInput({ bind: 'warterAlpha', min: 0, max: 100, }),
    ]);
    // // 标题分割线-end
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.divider({ color: "#333333" }, { colspan: 3 })
    // ]);
});