/** 经营玩法模板 按路径移动组件 编辑器扩展 */
G.extend.inspector("ps.Walk", function () {
    var self = this,
        target = self.target;

    // 调用默认的绘制方法
    // self.defaultDraw();

    // 调用自己的绘制
    var gui = qc.editor.gui;
    gui.columnWidths = ["90+0.1", "60+0.5"];

    gui.line([
        gui.text("移动速度（像素/秒）"),
        gui.numberInput({
            min: 1,
            bind: "speed",
        }),
    ]);

    gui.line([
        gui.text("面朝前的npc节点"),
        gui.objectInput({
            objectType: "node",
            target: target,
            bind: "frontNpc",
        }),
    ]);

    gui.line([
        gui.text("面朝左的npc节点"),
        gui.objectInput({
            objectType: "node",
            target: target,
            bind: "leftNpc",
        }),
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

    drawArray({ title: '移动中每一段路的目标节点', attribute: 'paths', min: 1, lenText: '节点数量(含起始点)' },
        (i, value, titleLine) => {
            let objectInput;
            titleLine.add(
                gui.line([gui.text(i == 0 ? '起始点' : "目标节点" + i, {
                    align: "right"
                }),
                objectInput = gui.objectInput({
                    objectType: "node",
                    target,
                    targetField: 'paths',
                    arrIndex: i
                })]));
            objectInput.setObjectValue(value)
        })

    gui.columnWidths = ["130+0.1", "60+0.5"];
    drawArray({ title: 'npc移动到目标节点后的朝向', attribute: 'transfrom' },
        (i, value, titleLine) => {
            let buttonGroup;
            titleLine.add(
                gui.line([gui.text("到达目标节点" + (Number(i) + 1) + '后的朝向', {
                    align: "right"
                }),
                buttonGroup = gui.buttonGroup([
                    {
                        text: '朝左',
                        value: 'left'
                    },
                    {
                        text: '朝右',
                        value: 'right'
                    },
                    {
                        text: '朝前',
                        value: 'front'
                    },
                    {
                        text: '朝后',
                        value: 'back'
                    },
                    {
                        text: '无改变',
                        value: null
                    }
                ], { value: value }
                )
                ])
            );
            buttonGroup.onValueChanged = (newValue) => {
                target['transfrom'][i] = newValue;
                self._cacheForDetection['transfrom'] = target['transfrom'].slice(0);
            }
        })

    drawArray({ title: 'npc移动到目标节点后的父节点', attribute: 'Tiers', lenText: '节点数量' },
        (i, value, titleLine) => {
            let objectInput;
            titleLine.add(
                gui.line([gui.text("父节点" + (Number(i) + 1), {
                    align: "right"
                }),
                objectInput = gui.objectInput({
                    objectType: "node",
                    target,
                    targetField: 'Tiers',
                    arrIndex: i
                })]));
            objectInput.setObjectValue(value);
        })

    drawArray({ title: 'npc在新父节点下的插入顺序', attribute: 'tiersChildIndex' },
        (i, value, titleLine) => {
            var intInput;
            titleLine.add(
                gui.line([gui.text("节点index" + (Number(i) + 1), {
                    align: "right"
                }),
                intInput = gui.intInput({
                    min: 0,
                    value: value,
                })]));
            intInput.onValueChanged = (newValue) => {
                if (!Number.isFinite(newValue) || newValue === value) return;
                target['tiersChildIndex'][i] = newValue;
                self._cacheForDetection['tiersChildIndex'] = target['tiersChildIndex'].slice(0);
            }
        })

    drawArray({ title: '路径中的停止的标志(index)', attribute: 'stopTags' },
        (i, value, titleLine) => {
            var intInput;
            titleLine.add(
                gui.line([gui.text("停止索引" + (Number(i) + 1), {
                    align: "right"
                }),
                intInput = gui.intInput({
                    min: 0,
                    value: value,
                })]));
            intInput.onValueChanged = (newValue) => {
                if (!Number.isFinite(newValue) || newValue === value) return;
                target['stopTags'][i] = newValue;
                self._cacheForDetection['stopTags'] = target['stopTags'].slice(0);
            }
        })
});
