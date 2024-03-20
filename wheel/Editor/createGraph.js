/** 2048数字射击玩法模板 数字棋盘模板 */
G.extend.inspector('ps.createGraph', function () {
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
        gui.text('2048数字射击玩法控制组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ["110+0.1", "60+0.5"];
    /**
     * 绘制数组
     * @param {{title: string,attribute: string,min?: number,lenText?: string,bindAtr?:string}} config 配置项
     * @param {function} fcn 数组中单个项的绘制处理函数
     */
    const drawArray = function (config, fcn) {
        const { title, attribute, min = 0, lenText = '数组长度', bindAtr } = config;
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
        let len = arr.length;
        if (bindAtr && target[bindAtr]) len = target[bindAtr].length;
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

    // 节点类型调用
    drawArray({ title: '绑定数字节点', attribute: '_blockNodes', min: 1, lenText: '节点数量' },
        (i, value, titleLine) => {
            let objectInput;
            titleLine.add(
                gui.line([gui.text("目标节点" + i, {
                    align: "right",
                }),
                objectInput = gui.objectInput({
                    objectType: "node",
                    target,
                    targetField: '_blockNodes',
                    arrIndex: i
                })]));
            objectInput.setObjectValue(value)
        })

    gui.line([
        gui.text('获取节点数据'),
        gui.objectInput({
            objectType: "node",
            target,
            targetField: '_node',
        })
    ])
    gui.line([
        gui.text('行数'),
        gui.intInput({
            value: 8,
            min: 4,
            bind: "_row",
        }),
    ]);

    gui.line([
        gui.text('列数'),
        gui.intInput({
            value: 5,
            min: 3,
            bind: "_col",
        }),
    ]);
    var checkBox;
    gui.line([
        gui.text('随机数据'),
        checkBox = gui.checkBox({ selected: true, bind: "_button" })// 设置其选中
    ]);
});
