/**
 * 滚动Banner组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.BannerScroll', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('滚动Banner组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    self.defaultDraw();

    // 滚动类型，下拉列表
    gui.columnWidths = ['60+0.1', '120+0.2'];
    var dropDownList;

    var BannerScrollType = {
        /** 一边消失，另一边出新的 */
        HIDE_SHOW: 1,
        /** 不消失，移往另一边 */
        MOVE_OTHER_SIDE: 2,
    }

    if (target.ScrollType == void 0) target.ScrollType = BannerScrollType.HIDE_SHOW;
    gui.line([
        gui.text('滚动类型'),
        dropDownList = gui.dropDownList({
            items: [
                { label: '一边消失，另一边出新的', value: BannerScrollType.HIDE_SHOW },
                { label: '不消失，移往另一边', value: BannerScrollType.MOVE_OTHER_SIDE },
            ],
            value: target.ScrollType
        })
    ]);

    // 值变化回调函数
    dropDownList.onValueChanged = function (newValue) {
        target.ScrollType = newValue;
    };

    // Banner标题方位
    gui.columnWidths = ['60+0.1', '120+0.2'];
    var dropDownList;

    gui.line([
        gui.text('标题方位'),
        dropDownList = gui.dropDownList({
            items: [
                { label: '上', value: 0 },
                { label: '下', value: 1 },
            ],
            value: target.TitleDire
        })
    ]);
    if (dropDownList.value == void 0) {
        dropDownList.value = 1;
    }
    target.TitleDire = dropDownList.value;

    // 值变化回调函数
    dropDownList.onValueChanged = function (newValue) {
        target.TitleDire = newValue;
    };

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

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});