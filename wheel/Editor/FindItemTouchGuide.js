/**
 * 目标物品（触控）指引 - 编辑器菜单拓展
 * @author JingBin
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
G.extend.inspector('ps.FindItemTouchGuide', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('目标物品（触控）指引', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    // 绘制默认控件
    // self.defaultDraw();

    // 空行
    // gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    // gui.line([
    //     gui.empty({ colspan: 3 })
    // ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('统筹目标节点'),
        gui.objectInput({ objectType: 'node', target, bind: '_findItems' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('是否自动开始'),
        gui.checkBox({ bind: '_isAutoStart' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('首次显示延迟（秒）'),
        gui.numberInput({ bind: '_firstDelay' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('是否多次显示指引'),
        gui.checkBox({ bind: '_isShowReplay' })
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('后续显示延迟（秒）'),
        gui.numberInput({ bind: '_laterDelay' }),
    ]);

    /**
     * 绘制数组
     * @param {{title: string,attribute: string,min?: number,lenText?: string}} config 配置项
     * @param {function} fcn 数组中单个项的绘制处理函数
     */
    const drawArray = function (config, fcn) {
        const { title, attribute, min = 0, lenText = '数组长度' } = config;
        const arr = target[attribute] || [];
        let titleToolTip;
        if ("object" == typeof title) {
            titleToolTip = title.toolTip;
            title = title.title
        }
        /* 创建标题行 */
        const titleLine = gui.titleLine(title);
        titleLine.toolTip = titleToolTip;
        let intInput;
        titleLine.add(gui.line([
            gui.text(lenText, {
                align: "right"
            }),
            intInput = gui.intInput({ min })
        ]));
        let len = Math.max(arr.length, min);
        intInput.value = len;
        /** 监听修改，改变对应属性中的值 */
        intInput.onValueChanged = (newValue) => {
            if (Number.isFinite(newValue) && newValue >= min && newValue !== len) {
                const newArr = [];
                for (let i = 0; i < newValue; i++)
                    newArr.push(i < len ? arr[i] : null);
                target[attribute] = newArr
            }
        }
        /** 调用每一行的绘制 */
        for (let i = 0; i < len; i++)
            fcn(i, arr[i], titleLine);
        /** 设置缓存检测 */
        if (self._cacheForDetection || (self._cacheForDetection = {}))
            self._cacheForDetection[attribute] = arr.slice(0);
    }

    gui.columnWidths = ['60+0.1', '120+0.2'];

    drawArray({ title: '指引目标节点', attribute: '_targetNodes', lenText: '节点数量' },
        (i, value, titleLine) => {
            let objectInput;
            titleLine.add(
                gui.line([gui.text("节点" + (Number(i) + 1), {
                    align: "right"
                }),
                objectInput = gui.objectInput({
                    objectType: "node",
                    target,
                    targetField: '_targetNodes',
                    arrIndex: i
                })]));
            objectInput.setObjectValue(value);
        });

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('首次显示指引事件'),
        gui.stringInput({ bind: '_customEventFirstShow' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('后续显示指引事件'),
        gui.stringInput({ bind: '_customEventLaterShow' }),
    ]);

    gui.columnWidths = ['60+0.1', '120+0.2'];
    gui.line([
        gui.text('隐藏指引事件'),
        gui.stringInput({ bind: '_customEventHide' }),
    ]);

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});