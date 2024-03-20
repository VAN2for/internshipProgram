/**
 * 正向播放(保证与线上qc-core-debug执行的动画播放方法一致)
 */
const playEndSetNodeLayout = function (animation) {
  if (animation.class.indexOf('qc.TweenPosition') > -1 && ps.ENV !== 'EDITOR') {
    var layoutData2String = function (data) {
      const keys = Object.keys(data)
      let str = ''
      keys.forEach(function (key) {
        str += `${key}:${data[key]},`
      })
      return str.substr(0, str.length - 1)
    }

    const layoutScript = animation.gameObject.getScripts('ps.Layout')
      ? animation.gameObject.getScripts('ps.Layout')[0]
      : ''
    const resolutions = ['pdef', 'ldef']
    const verticalScript = animation.gameObject.getScripts(
      'ps.VerticalHorizontal',
    )
      ? animation.gameObject.getScripts('ps.VerticalHorizontal')[0]
      : ''
    if (layoutScript && verticalScript) {
      const tweenLayout = verticalScript['adapterData']['tweenPosition'][animation.uuid] ?
        verticalScript['adapterData']['tweenPosition'][animation.uuid][
          'tweenLayout'
        ] : ''
        if (tweenLayout) {
            resolutions.forEach(function(resolution){
                for (const key in tweenLayout[resolution]) {
                    if (['x', 'y', 'scaleX', 'scaleY'].indexOf(key) !== -1) {
                        layoutScript.layoutData[resolution][key] = tweenLayout[resolution][key]
                    }
                }
                layoutScript.layout[resolution] = layoutData2String(layoutScript.layoutData[resolution])
            })
        }

    }
  }
}

qc.Tween.prototype.playForward = function (reset) {
  var self = this
  // this.gameObject.getScript('ps.Layout') && this.gameObject.getScript('ps.Layout').refresh()

  // console.log(self.gameObject.name, '动画播放时是否已经实例化', self.gameObject.getScript('ps.VerticalHorizontal').inited)
  var arr = self.gameObject.getScripts(qc.TweenPosition)
  var index = arr.indexOf(self)
  if (index >= 1) {
    var m = new qc.Point(self.to.x - self.from.x, self.to.y - self.from.y)
    var last_tween = arr[index - 1]
    self.from = last_tween.to
    self.to = new qc.Point(self.from.x + m.x, self.from.y + m.y)
  }
  // 动画播放，根据重新设置节点layout位置
  playEndSetNodeLayout(self)
  if (reset) self.resetToBeginning()
  self.play(false)
}

/**
 * 设置节点里的属性,免疫layout的影响
 * param.prop 待修改的节点属性
 * param.value 修改值
 */
qc.Node.prototype.setPropertyIgnoreLayout = function (param) {
  if (typeof param.value !== 'undefined') {
    this[param.prop] = param.value;
  }
  var layout = this.getScript('ps.Layout');
  if (layout) {
    layout.ignoreProps = Object.values(layout.ignoreProps);
    layout.ignoreProps.push(param.prop);
  }
}
