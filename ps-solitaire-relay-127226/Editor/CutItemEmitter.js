/**
 * 切水果触控底板 - 编辑器菜单拓展
 * @author weijia
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */




G.extend.inspector('ps.CutItemEmitter', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    /**
 * 
 * @param {{title: string,attribute: string,min?: number,lenText?: string,bindArr?:string}} config 配置项
 * @param {function} fcn 数组中单个项的绘制处理函数
 */
    const drawArray = function (config, fcn) {
        const { title, attribute, min = 0, lenText = '数组长度', bindArr } = config;
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
        let len;
        if (bindArr && target[bindArr]) {
            len = target[bindArr].length;
            const newArr = [];
            for (let i = 0; i < len; i++)
                newArr.push(i < len ? arr[i] : null);
            target[attribute] = newArr
        } else {
            titleLine.add(gui.line([
                gui.text(lenText, {
                    align: "right"
                }),
                intInput = gui.intInput({ min })
            ]));
            len = arr.length;
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
        }
        /** 调用每一行的绘制 */
        for (let i = 0; i < len; i++)
            fcn(i, arr[i], titleLine);
        /** 设置缓存检测 */
        if (self._cacheForDetection || (self._cacheForDetection = {}))
            self._cacheForDetection[attribute] = arr.slice(0);
    }

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('切水果发射器', { align: 'center' }),
        gui.divider({ color: "#333333" })

    ]);

    drawArray({ title: '生成物品数组', attribute: 'itemList', min: 0, lenText: 'Length' },
        (i, value, titleLine) => {
            let objectInput;
            titleLine.add(
                gui.line([gui.text(i + '', {
                    align: "right"
                }),
                objectInput = gui.objectInput({
                    objectType: "node",
                    target,
                    targetField: 'itemList',
                    arrIndex: i
                })]));
            objectInput.setObjectValue(value)
        })

    drawArray({ title: '物品权重数组', attribute: 'probabilitys', min: 0, lenText: 'Length', bindArr: 'itemList' },
        (i, value, titleLine) => {
            let f
            titleLine.add(
                gui.line([gui.text(i + '', {
                    align: "right"
                }),
                f = gui.intInput({
                    min: 0,
                    value: value,
                })]));
            f.onValueChanged = (newValue) => {
                if (!Number.isFinite(newValue) || newValue === value) return;
                target['probabilitys'][i] = newValue;
                self._cacheForDetection['probabilitys'] = target['probabilitys'].slice(0);
            }
        })

    gui.columnWidths = ['80+0.1', '40+0.1'];
    gui.line([
        gui.text("物品生成区域节点"),
        gui.objectInput({
            objectType: "node",
            target,
            bind: "cutArea"
        })
    ])

    gui.columnWidths = ['80+0.1', '60+0.1'];
    gui.line([
        gui.text("是否需要重复生成"),
        gui.checkBox({ bind: "needRepeat" })
    ])


    gui.columnWidths = ['100+0.1', '80+0.1'];
    gui.line([
        gui.text("物品生成频率"),
        gui.numberInput({
            value: 1000,
            bind: "frequency",
        }),
    ]);

    gui.columnWidths = ['100+0.1', '80+0.1'];
    gui.line([
        gui.text("生成物品X最小偏移"),
        gui.numberInput({
            value: 0,
            bind: "minOffsetX",
        }),
    ]);
    gui.line([
        gui.text("生成物品X最大偏移"),
        gui.numberInput({
            value: 0,
            bind: "maxOffsetX",
        }),
    ]);

    gui.columnWidths = ['100+0.1', '80+0.1'];
    gui.line([
        gui.text("生成物品Y最小偏移"),
        gui.numberInput({
            value: 0,
            bind: "minOffsetY",
        })
    ]);
    gui.line([
        gui.text("生成物品Y最大偏移"),
        gui.numberInput({
            value: 0,
            bind: "maxOffsetY",
        }),
    ]);

    // // 绘制默认控件
    // self.defaultDraw();

    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);



});