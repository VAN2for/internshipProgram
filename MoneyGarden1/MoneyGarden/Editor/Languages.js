/**
 * 多语言系统组件 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.Languages', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('多语言系统组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    if (qc.gameObj.useLanguages) {
        // 已启用多语言系统
        if (target.gameObject instanceof qc.UIText) {
            // 文本组件

            // 获取多语言配置key
            var res = target.getRes();
            var keyArr = [''];
            if (res) {
                var languages = res.languages;
                if (languages) {
                    for (var lang in languages) {
                        var langCfg = languages[lang];
                        if (langCfg) {
                            for (var key in langCfg) {
                                if (keyArr.indexOf(key) < 0) {
                                    keyArr.push(key);
                                }
                            }
                        }
                    }
                }
            }

            if (keyArr && keyArr.length > 0) {
                target.serializableFields.langKey = qc.Serializer.AUTO;

                var key = target.langKey// || keyArr[0]; // value指定了默认值

                // 文本输入框
                gui.columnWidths = ['60+0.1', '80+0.1', '20+0.1'];
                var input;
                gui.line([
                    gui.text('输入 key'),
                    input = gui.stringInput({ value: key }),
                    playBtn = gui.button('确定'),
                ]);
                target.input = input;
                // 值变化回调函数
                input.onValueChanged = function (newValue) {
                    if (target.dropDownList.items.indexOf(target.input.value) !== -1) {
                        target.refresh(newValue);
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
                    target.refreshTarget(true);
                    target.dropDownList.value = target.input.value;
                });

                // 下拉列表
                gui.columnWidths = ['60+0.1', '100+0.2'];
                var dropDownList;
                gui.line([
                    gui.text('选择 key'),
                    dropDownList = gui.dropDownList({
                        // items指定列表项
                        items: keyArr,
                        // value指定默认值
                        value: key
                    })
                ]);
                target.dropDownList = dropDownList;
                // 值变化回调函数
                dropDownList.onValueChanged = function (newValue) {
                    target.refresh(newValue);
                    target.input.value = newValue;
                };
            }
        } else if (target.gameObject instanceof qc.UIImage) {
            // 图片组件
            target.serializableFields.langKey = qc.Serializer.AUTO;

            // 确定按钮
            gui.columnWidths = ["160+0.1"];
            gui.line([
                playBtn = gui.button('确定'),
            ]);
            // 注册点击事件
            playBtn.on('click', function () {
                // target.refreshSerializer();
                target.refreshTarget(true);
            });
        }

        // 默认的绘制方法
        self.defaultDraw();
    } else {
        // 未启用多语言系统
        gui.columnWidths = ['120+0.1'];
        gui.line([
            gui.text('请前往：工程 -> 设置 (Ctrl+Shift+B) -> 启用多语言系统', { align: 'left' }),
        ]);
    }

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});