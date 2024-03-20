G.extend.inspector('ps.WaitMatchCard', function () {
  var self = this,
    target = self.target
  var gui = qc.editor.gui

  // 标题分割线-start
  gui.columnWidths = ['60+0.3', '120+0.1', '60+0.3']
  gui.line([
    gui.divider({ color: "#333333" }),
    gui.text('待匹配纸牌组件', { align: 'center' }),
    gui.divider({ color: "#333333" })
  ])

  gui.columnWidths = ['60+0.1', '100+0.1']
  gui.line([
    gui.text('纸牌堆节点'),
    gui.objectInput({ objectType: 'node', target, bind: 'cardHeap' })
  ])

  gui.columnWidths = ['80+0.1', '80+0.1']
  gui.line([
    gui.text('所有预设纸牌父节点'),
    gui.objectInput({ objectType: 'node', target, bind: 'cardType' })
  ])

  gui.line([
    gui.text('随机生成纸牌数量'),
    checkBox = gui.intInput({ value: 0, min: 0, bind: "randCardNum" })// 设置其选中
  ])

  gui.columnWidths = ['120+0.1', '40+0.1']
  gui.line([
    gui.text('触发合成重叠面积最小比例'),
    gui.numberInput({ value: 0.5, min: 0, max: 1, precision: 1, bind: "areaRate" })
  ])

  gui.columnWidths = ['80+0.1', '80+0.1']
  gui.line([
    gui.text('待拖拽纸牌是否明牌'),
    gui.checkBox({ selected: target.isLight, bind: "isLight" })// 设置其选中
  ])

  gui.line([
    gui.text('可拖拽纸牌位置')
  ])

  gui.columnWidths = ['10+0.1', '90+0.1', '10+0.1', '90+0.1']
  gui.line([
    gui.text('x', { align: 'center' }),
    gui.numberInput({ value: 0.5, precision: 2, bind: "guideCardLocationX" }),
    gui.text('y', { align: 'center' }),
    gui.numberInput({ value: 0.5, precision: 2, bind: "guideCardLocationY" }),
  ])

  gui.columnWidths = ['90+0.1', '70+0.1']

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
  drawArray({ title: '待拖拽纸牌参数配置', attribute: ['waitCardX', 'waitCardY', 'waitCardScale'], min: 0, lenText: 'length' },
    (i, value, titleLine) => {
      titleLine.add(
        gui.line([
          gui.text('x', { align: "right" }),
          xVal = gui.numberInput({ value: value[0], precision: 2 }),
          gui.text('y', { align: "right" }),
          yVal = gui.numberInput({ value: value[1], precision: 2 }),
          gui.text('scale', { align: "right" }),
          scaleVal = gui.numberInput({ value: value[2], min: 0, max: 1, precision: 2 })
        ])
      )
      xVal.onValueChanged = (newValue) => {
        if (!Number.isFinite(newValue) || newValue === value) return
        target['waitCardX'][i] = newValue
        self._cacheForDetection['waitCardX'][i] = newValue
      }
      yVal.onValueChanged = (newValue) => {
        if (!Number.isFinite(newValue) || newValue === value) return
        target['waitCardY'][i] = newValue
        self._cacheForDetection['waitCardY'][i] = newValue
      }
      scaleVal.onValueChanged = (newValue) => {
        if (!Number.isFinite(newValue) || newValue === value) return
        target['waitCardScale'][i] = newValue
        self._cacheForDetection['waitCardScale'][i] = newValue
      }
    })

  gui.columnWidths = ['90+0.1', '70+0.1']
  gui.line([
    gui.text('纸牌放下时播放的声音'),
    gui.stringInput({ objectType: 'node', target, bind: 'sm_down' })
  ])

  gui.line([
    gui.text('纸牌合成时播放的声音'),
    gui.stringInput({ objectType: 'node', target, bind: 'sm_collect' })
  ])

  gui.columnWidths = ['110+0.1', '50+0.1']
  gui.line([
    gui.text('纸牌匹配错误时播放的声音'),
    gui.stringInput({ objectType: 'node', target, bind: 'sm_wrong' })
  ])

  // 刷新按钮
  gui.columnWidths = ["70+0.1"]
  gui.line([
    playBtn = gui.button('刷新'),
  ])
  // 注册点击事件
  playBtn.on('click', function () {
    target.awake()
  })
})