/**
 * 状态组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('State', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('状态组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    var states = target.states;
    if (states && states.length) {
        var stateArr = [];
        for (var i = 0; i < states.length; i++) {
            stateArr.push(i + '');
        }

        if (stateArr && stateArr.length > 0) {
            target.serializableFields.currState = qc.Serializer.AUTO;

            var currState = target.currState;

            // 文本输入框
            gui.columnWidths = ['60+0.1', '80+0.1', '20+0.1'];
            var input;
            gui.line([
                gui.text('当前状态'),
                input = gui.stringInput({ value: currState }),
                playBtn = gui.button('确定'),
            ]);
            target.input = input;
            // 值变化回调函数
            input.onValueChanged = function (newValue) {
                if (target.dropDownList.items.indexOf(target.input.value) !== -1) {
                    target.changeState(newValue);
                    target.dropDownList.value = newValue;
                }
            };

            // 注册点击事件
            playBtn.on('click', function () {
                // target.refreshSerializer();
                var value = target.input.value;
                if (target.dropDownList.items.indexOf(value) === -1) {
                    value = target.dropDownList.value;
                    target.input.value = value;
                }
                target.changeState(value);
                target.dropDownList.value = target.input.value;
            });

            // 下拉列表
            gui.columnWidths = ['60+0.1', '100+0.2'];
            var dropDownList;
            gui.line([
                gui.text('选择状态'),
                dropDownList = gui.dropDownList({
                    // items指定列表项
                    items: stateArr,
                    // value指定默认值
                    value: currState
                })
            ]);
            target.dropDownList = dropDownList;
            // 值变化回调函数
            dropDownList.onValueChanged = function (newValue) {
                target.changeState(newValue);
                target.input.value = newValue;
            };
        }
    }

    // 默认的绘制方法
    self.defaultDraw();

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});