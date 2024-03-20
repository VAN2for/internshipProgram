G.extend.inspector('ps.CardMap', function () {
  var self = this,
    target = self.target
  var gui = qc.editor.gui

  // 标题分割线-start
  gui.columnWidths = ['60+0.3', '120+0.1', '60+0.3']
  gui.line([
    gui.divider({ color: "#333333" }),
    gui.text('纸牌组件', { align: 'center' }),
    gui.divider({ color: "#333333" })
  ])

  gui.columnWidths = ['60+0.3', '120+0.1']
  gui.line([
    gui.text('纸牌对应的数值'),
    gui.intInput({ min: 2, bind: "cardNum" }),
  ])


  gui.columnWidths = ['180+0.3']
  gui.line([
    gui.text('若是暗牌设置背面与正面')
  ])

  gui.columnWidths = ['30+0.3', '150+0.1']
  gui.line([
    gui.text('正面'),
    gui.objectInput({ objectType: 'node', target, bind: 'front' })
  ])

  gui.line([
    gui.text('背面'),
    gui.objectInput({ objectType: 'node', target, bind: 'back' })
  ])
})