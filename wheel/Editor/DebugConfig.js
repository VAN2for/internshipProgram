/**
 * 开发调试配置 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.DebugConfig', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('开发调试配置', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 默认的绘制方法
    self.defaultDraw();

    if (qc.gameObj.useLanguages) {
        // 已启用多语言系统
        // 获取多语言配置key
        var res = target.getRes();
        var langArr = [''];
        if (res && res.languages) {
            langArr = langArr.concat(Object.keys(res.languages))
        }

        if (langArr && langArr.length > 0) {
            target.serializableFields.langKey = qc.Serializer.AUTO

            var key = target.debugLang// || keyArr[0]; // value指定了默认值

            // 文本输入框
            gui.columnWidths = ['60+0.1', '80+0.1', '20+0.1'];
            var input;
            gui.line([
                gui.text('输入调试语言'),
                input = gui.stringInput({ value: key }),
                playBtn = gui.button('确定'),
            ]);
            target.input = input;
            // 值变化回调函数
            input.onValueChanged = function (newValue) {
                if (target.dropDownList.items.indexOf(target.input.value) !== -1) {
                    target.updateLang(newValue);
                    target.dropDownList.value = newValue;
                }
            };

            // 注册点击事件
            playBtn.on('click', function () {
                var value = target.input.value;
                if (target.dropDownList.items.indexOf(value) === -1) {
                    value = target.language();
                    target.input.value = value;
                }
                target.updateLang(value, true, true);
                target.dropDownList.value = value;
            });

            // 下拉列表
            gui.columnWidths = ['60+0.1', '100+0.2'];
            var dropDownList;
            gui.line([
                gui.text('选择调试语言'),
                dropDownList = gui.dropDownList({
                    // items指定列表项
                    items: langArr,
                    // value指定默认值
                    value: key
                })
            ]);
            target.dropDownList = dropDownList;
            // 值变化回调函数
            dropDownList.onValueChanged = function (newValue) {
                target.updateLang(newValue, true);
                target.input.value = newValue;
            };
        }
    }

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});