/**
 * 切水果触控底板 - 编辑器菜单拓展
 * @author weijia
 * @argument 第一个参数为自定义的脚本组件类名
 * @argument 第二个参数为重载的绘制函数
 */
 G.extend.inspector('ps.CutItem', function () {
    var self = this,
        target = self.target;

    var gui = qc.editor.gui;

    // 标题分割线-start
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }),
        gui.text('切水果目标物品', { align: 'center' }),
        gui.divider({ color: "#333333" })
    ]);


    var CutFruitItemEffect = {
        NONE: 0, //无操作
        HIDE: 1, //隐藏
        DESTROY: 2, //销毁
    }
    gui.columnWidths = ['100+0.2', '80+0.1'];
    gui.line([
        gui.text('命中目标后对节点的操作：'),
        gui.buttonGroup([
            {
                text: '无操作',
                value: CutFruitItemEffect.NONE
            },
            {
                text: '隐藏',
                value: CutFruitItemEffect.HIDE
            },
            {
                text: '销毁',
                value: CutFruitItemEffect.DESTROY
            }
        ], { bind: '_touched'}), 
    ]);

    gui.columnWidths = ['80+0.1', '60+0.1'];
    gui.line([
        gui.text("命中时播放音效"),
        gui.stringInput({bind:"audioName"})
    ])

    gui.columnWidths = ['80+0.1', '60+0.1'];
    gui.line([
        gui.text("是否可重复触发"),
        gui.checkBox({bind:"canRepeat"})
    ])

    
    gui.line([
        gui.text("X轴最小发射速度"),
        gui.numberInput({
            value: 0,
            bind: "sendMinSpeedX",
        })
    ])
    
    gui.line([
        gui.text("X轴最大发射速度"),
        gui.numberInput({
            value: 0,
            bind: "sendMaxSpeedX",
        })
    ])

    gui.line([
        gui.text("Y轴发射速度"),
        gui.numberInput({
            value: 0,
            bind: "sendSpeedY",
        }),
    ]);

    gui.columnWidths = ['80+0.1', '60+0.1'];
    gui.line([
        gui.text("是否需要发射终点位置"),
        gui.checkBox({bind:"needDestination"})
    ])

    gui.line([
        gui.text("发射终点位置Y最小偏移"),
        gui.numberInput({
            value: 0,
            bind: "minTargetY",
            colspan:2
        })
    ]);
    
    gui.line([
        gui.text("发射终点位置Y最大偏移"),
        gui.numberInput({
            value: 0,
            bind: "maxTargetY",
            colspan:2
        }),
    ]);

    gui.columnWidths = ['100+0.2', '80+0.1'];
    gui.line([
        gui.text('到达终点后对节点的操作：'),
        gui.buttonGroup([
            {
                text: '无操作',
                value: CutFruitItemEffect.NONE
            },
            {
                text: '隐藏',
                value: CutFruitItemEffect.HIDE
            },
            {
                text: '销毁',
                value: CutFruitItemEffect.DESTROY
            }
        ], { bind: '_arrive' }), 
    ]);

    gui.columnWidths = ['120+0.2', '60+0.1'];
    gui.line([
        gui.text("到达发射终点位置后是否降落"),
        gui.checkBox({bind:"needDrop"})
    ])
    
    gui.columnWidths = ['100+0.2', '80+0.1'];
    gui.line([
        gui.text('到达降落终点对节点的操作：'),
        gui.buttonGroup([
            {
                text: '无操作',
                value: CutFruitItemEffect.NONE
            },
            {
                text: '隐藏',
                value: CutFruitItemEffect.HIDE
            },
            {
                text: '销毁',
                value: CutFruitItemEffect.DESTROY
            }
        ], { bind: '_drop'}), 
    ]);
   
    // 标题分割线-end
    gui.columnWidths = ['60+0.1', '60+0.1', '60+0.1'];
    gui.line([
        gui.divider({ color: "#333333" }, { colspan: 3 })
    ]);
});