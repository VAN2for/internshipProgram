namespace ps {
    /**
     * A*寻路地图组件
     * @author VaMP
     */
    export class AStarComponent extends ps.Behaviour {
        rows: number = 10;
        cols: number = 10;
        data: string;
        editMode = true;
        isDrawAll = true;
        get cellWidth() {
            return this.gameObject.width / this.rows;
        }
        get cellHeight() {
            return this.gameObject.height / this.cols;
        }
        map: AStarMap;
        /** 本次要绘画的值 */
        private drawV: number;
        /** 序列化 */
        private serializableFields: Object = {
            rows: qc.Serializer.NUMBER,
            cols: qc.Serializer.NUMBER,
            data: qc.Serializer.STRING,
            editMode: qc.Serializer.BOOLEAN,
            isDrawAll: qc.Serializer.BOOLEAN,
        }
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }
        awake() {
            this.gameObject.alpha = 0.3;
            this.map = new AStarMap(this.rows, this.cols, 0);
            if (this.data != undefined && this.data != null && this.data != "") {
                this.map.load(this.data);
            }
            if (!this.editMode) return;
            this.gameObject.interactive = true;
            //绘图
            this.drawAll();
            //键盘事件
            this.game.input.onKeyUp.add((e: number) => {
                if (e === 83) this.map.save();
            })
            window["map"] = this;
        }
        /**
         * 获取路径，返回值为路径点的集合，无法寻路则返回空数组
         * @param startX 
         * @param startY 
         * @param endX 
         * @param endY 
         */
        getPath(startX: number, startY: number, endX: number, endY: number) {
            let path = this.map.searchRoad(startX, startY, endX, endY);
            if (this.editMode) this.drawPath(path);
            return path;
        }

        private onDown(e: qc.DragEvent) {
            let [row, col] = this.calRowCol(e);
            let v = this.map.get(row, col);
            if (v === undefined) return;
            this.drawV = v === 1 ? 0 : 1;
            //
            this.setAndDraw(row, col);
        }
        private onDrag(e: qc.DragEvent) {
            let [row, col] = this.calRowCol(e);
            this.setAndDraw(row, col);
        }
        /** 根据事件计算点击的格子索引 */
        private calRowCol(e: qc.DragEvent) {
            let pointer = e.source as qc.Pointer;
            let p = this.gameObject.toGlobal(new qc.Point(0, 0));
            let row = Math.floor((pointer.x - p.x) / this.cellWidth / ps.ScrFix.scale);
            let cow = Math.floor((pointer.y - p.y) / this.cellHeight / ps.ScrFix.scale);
            return [row, cow];
        }
        /** 设置参数并且绘制出来 */
        setAndDraw(row: number, col: number) {
            let ov = this.map.get(row, col);
            if (ov === undefined) return;
            if (this.drawV === ov) return;
            this.map.set(row, col, this.drawV);
            if (this.isDrawAll) this.drawAll();
            else this.drawOne(row, col, this.drawV);
            console.log(row, col);
        }
        /**
        * 画出地图
        */
        drawAll() {
            var graphics = this.gameObject as qc.Graphics;
            graphics.clear();
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    let v = this.map.get(i, j);
                    this.drawOne(i, j, v);
                }
            }
        }
        drawPath(arr: { x: number, y: number }[]) {
            arr.forEach(pos => {
                this.drawOne(pos.x, pos.y, 2)
            });
        }
        drawOne(row: number, col: number, v: number) {
            var graphics = this.gameObject as qc.Graphics;
            //
            let c0 = 0x33ff00;
            let c1 = 0xFF3300;
            let c2 = 0x0033ff;
            let color: number;
            switch (v) {
                case 0: color = c0; break;
                case 1: color = c1; break;
                case 2: color = c2; break;
            }
            graphics.beginFill(color);
            graphics.drawRect(row * this.cellWidth, col * this.cellHeight, this.cellWidth - 1, this.cellHeight - 1);
            graphics.endFill();
        }

    }
    qc.registerBehaviour('ps.AStarComponent', AStarComponent);
    AStarComponent["__menu"] = 'Custom/AStarComponent';
}
/**
帧回调（preUpdate、update、postUpdate）
如果实现了这几个函数，系统会自动每帧进行调度（当挂载的Node节点处于可见、并且本脚本的enable=true时）
初始化（awake）
如果实现了awake函数，系统会在Node节点构建完毕（反序列化完成后）自动调度
脚本可用/不可用（onEnable、onDisable）
当脚本的enable从false->true时，会自动调用onEnable函数；反之调用onDisable函数
ps:在awake结束时,如果当前脚本的enable为true，会自动调用onEnable函数
交互回调（onClick、onUp、onDown、onDrag、onDragStart、onDragEnd）
当挂载的Node具备交互时，一旦捕获相应的输入事件，这些函数会自动被调用
脚本析构（onDestroy）
当脚本被移除时，会自动调用onDestroy函数，用户可以定义必要的资源回收代码
//PlaySmart新增回调(继承ps.Behaviour)
pl状态回调(onInit、onStart、onEnding、onRetry、onResize)
如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
*/