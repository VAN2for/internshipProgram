/**
 * 计时器组件 - 编辑器菜单拓展
 * @author JasonPang
 */
G.extend.inspector('ps.InstallBtn', function () {

    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    var dropDownList

    var InstallType = {
        None: 1 << 0, //不属于任何跳转
        Global: 1 << 1, //全局跳转
        Auto: 1 << 2, //自动跳转
        YouDao: 1 << 3, //诱导跳转
    }

    self.defaultDraw();

    gui.line([
        gui.text('跳转类型'),
        dropDownList = gui.dropDownList({
            items: [{
                label: '正常跳转',
                value: InstallType.None
            },{
                label: '全局跳转',
                value: InstallType.Global
            },{
                label: '自动跳转',
                value: InstallType.Auto
            },{
                label: '诱导跳转',
                value: InstallType.YouDao
            },
            ],
            value: target.installType
        })
    ]);
    dropDownList.onValueChanged = function (newValue) {
        target.installType = newValue
    }

})