/** 2048数字射击玩法模板 发射数字模板 */
G.extend.inspector("ps.mergeNode", function () {
    var self = this,
        target = self.target
    var gui = qc.editor.gui

    // 标题分割线-start
    gui.columnWidths = ['60+0.3', '120+0.1', '60+0.3'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('2048数字射击玩法组件', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);

    gui.columnWidths = ["120+0.1", "30+0.1", "60+0.5"];

    gui.line([
        gui.text("游戏次数"),
        gui.intInput(
            {
                value: 3,
                min: 1,
                bind: "_gameCount",
            },
        ),
    ]);
    gui.line([
        gui.text("合并时间"),
        gui.intInput(
            {
                value: 50,
                min: 50,
                bind: "_mergeTime",
            },
        ),
    ]);
    gui.line([
        gui.text("下落时间"),
        gui.intInput(
            {
                value: 80,
                min: 80,
                bind: "_downTime",
            },
        ),
    ]);
    gui.line([
        gui.text("节点出现的时间"),
        gui.intInput(
            {
                value: 0,
                bind: "_nextTime",
            },
        ),
    ]);
    /**
    * 绘制数组
    * @param {{title: string,attribute: string[],min?: number,lenText?: string,bindAtr?:string}} config 配置项
    * @param {function} fcn 数组中单个项的绘制处理函数
    */
    const drawArray = function (config, fcn) {
        const { title, attribute, min = 0, lenText = '数组长度', bindAtr } = config
        let titleToolTip
        if ("object" == typeof title) {
            titleToolTip = title.toolTip
            title = title.title
        }
        /* 创建标题行 */
        const titleLine = gui.titleLine(title)
        titleLine.toolTip = titleToolTip
        let intInput
        titleLine.add(gui.line([
            gui.text(""),
            gui.text(lenText, {
                align: "right"
            }),
            intInput = gui.intInput({ min })
        ]))
        let arr = []
        if (typeof attribute === "string" && target[attribute]) {
            arr = target[attribute]
        } else {
            attribute.forEach(el => {
                arr.push(target[el])
            })
        }
        let len = arr[0].length
        if (bindAtr && target[bindAtr]) len = target[bindAtr].length
        intInput.value = len
        /** 监听修改，改变对应属性中的值 */
        intInput.onValueChanged = (newValue) => {
            if (Number.isFinite(newValue) && newValue >= min && newValue !== len) {
                len = newValue
                const newArr = []
                if (typeof attribute === "string") {
                    for (let i = 0; i < newValue; i++) {
                        newArr.push(i < len ? arr[i] : null)
                    }
                    target[attribute] = newArr
                } else {
                    arr.forEach(atrArr => {
                        const tmpArr = []
                        for (let i = 0; i < newValue; i++) {
                            tmpArr.push(i < len ? atrArr[i] : null)
                        }
                        newArr.push(tmpArr)
                    })
                    for (let i = 0; i < attribute.length; i++) {
                        target[attribute[i]] = newArr[i]
                    }
                }
            }
        }
        /** 调用每一行的绘制 */
        for (let i = 0; i < len; i++) {
            if (typeof attribute === 'string') {
                fcn(i, arr[i], titleLine)
            } else {
                const tmpArr = []
                for (let j = 0; j < attribute.length; j++) {
                    tmpArr.push(arr[j][i])
                }
                fcn(i, tmpArr, titleLine)
            }
        }
        /** 设置缓存检测 */
        if (self._cacheForDetection || (self._cacheForDetection = {})) {
            attribute.forEach((atr, i) => {
                self._cacheForDetection[atr] = arr[i].slice(0)
            })
        }
    }


    gui.columnWidths = ['15+0.1', '50+0.1', '15+0.1', '50+0.1', '20+0.1', "30+0.1"]
    // 节点类型调用
    drawArray({ title: '发射数字节点数量', attribute: ['_startPointX', '_startPointY', '_startPointValue'], min: 0, lenText: 'length' },
        (i, value, titleLine) => {
            titleLine.add(
                gui.line([
                    gui.text('x', { align: "right" }),
                    x = gui.numberInput({ value: value[0], precision: 2 }),
                    gui.text('y', { align: "right" }),
                    y = gui.numberInput({ value: value[1], precision: 2 }),
                    gui.text('value', { align: "right" }),
                    Val = gui.numberInput({ value: value[2] })
                ])
            )
            x.onValueChanged = (newValue) => {
                if (!Number.isFinite(newValue) || newValue === value) return
                target['_startPointX'][i] = newValue
                self._cacheForDetection['_startPointX'][i] = newValue
            }
            y.onValueChanged = (newValue) => {
                if (!Number.isFinite(newValue) || newValue === value) return
                target['_startPointY'][i] = newValue
                self._cacheForDetection['_startPointY'][i] = newValue
            }
            Val.onValueChanged = (newValue) => {
                if (!Number.isFinite(newValue) || newValue === value) return
                target['_startPointValue'][i] = newValue
                self._cacheForDetection['_startPointValue'][i] = newValue
            }
        })
})
