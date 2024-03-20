/**
 * 滚动列表组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.ListScroll', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('滚动列表', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    self.defaultDraw();

    /* =========== 滚动方向-start =========== */
    gui.columnWidths = ['60+0.1', '120+0.2'];
    var dropDownList;

    /** 滚动方向 */
    var DireScroll = {
        /** 向上/左 */
        UP_OR_LEFT: -1,
        /** 向下/右 */
        DOWN_OR_RIGHT: 1,
    }

    gui.line([
        gui.text('滚动方向'),
        dropDownList = gui.dropDownList({
            items: [
                { label: '向上/左', value: DireScroll.UP_OR_LEFT },
                { label: '向下/右', value: DireScroll.DOWN_OR_RIGHT },
            ],
            value: target.direScroll
        })
    ]);
    // 值变化回调函数
    dropDownList.onValueChanged = function (newValue) {
        target.direScroll = newValue;
    };
    /* =========== 滚动方向-end =========== */

    /* =========== 布局类型-start =========== */
    gui.columnWidths = ['60+0.1', '120+0.2'];
    var dropDownList;

    /** 布局类型 */
    var ListLayout = {
        /** 水平 */
        HORIZONTAL: 0,
        /** 垂直 */
        VERTICAL: 1,
    }

    gui.line([
        gui.text('布局类型'),
        dropDownList = gui.dropDownList({
            items: [
                { label: '水平', value: ListLayout.HORIZONTAL },
                { label: '垂直', value: ListLayout.VERTICAL },
            ],
            value: target.listLayout
        })
    ]);
    // 值变化回调函数
    dropDownList.onValueChanged = function (newValue) {
        target.listLayout = newValue;
    };
    /* =========== 布局类型-end =========== */

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
        target.awake();
    });

    // 滚动按钮
    gui.columnWidths = ["70+0.1"];
    gui.line([
        playBtn = gui.button('滚动'),
    ]);
    // 注册点击事件
    playBtn.on('click', function () {
        target.play();
    });

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});