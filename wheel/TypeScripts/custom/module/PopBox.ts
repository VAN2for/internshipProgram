namespace ps {
    /**
     * 弹出得分工具(支持文字以及图片)
     *   ps.PopBox.popLabel(tar, "+1", 200, '#255931',-200);
     *   ps.PopBox.popImg(tar, this.progressSkin,-200)
     */
    export class PopBox {
        private target: qc.Node; //添加的目标
        private duration: number;
        /**
         * 添加对象
         * @param        target    目标对象
         * @param        duration      持续时长（毫秒）
         * @param        x       初始x
         * @param        y       初始y
         * @param        text    文字
         * @param        fontSize    文字大小
         * @param        color    文字颜色
         * @param        disY    所飘距离Y
        
         */
        static popLabel(
            target: qc.Node,
            text: string,
            fontSize: number,
            color: string,
            disY?: number,
            duration?: number,
            x?: number,
            y?: number
        ) {
            let sk = new PopBox();
            sk.popLabel(target, text, fontSize, color, disY, duration, x, y);
            return sk;
        }
        public popLabel(
            target: qc.Node,
            text: string,
            fontSize: number,
            color: string,
            disY?: number,
            duration?: number,
            x?: number,
            y?: number
        ) {
            if (disY === undefined) disY = -200;
            if (duration === undefined) duration = 500;
            if (x === undefined) x = target.width / 2;
            if (y === undefined) y = target.height / 2;
            x -= 200;
            this.target = target;
            this.duration = duration;
            var label = qc_game.add.text();
            label.width = 400;
            label.alignH = qc.UIText.CENTER;
            label.fontSize = fontSize;
            label.text = text;
            label.color = new qc.Color(color);
            label.x = x;
            label.y = y;
            label.strokeThickness = 6;
            label.stroke = new qc.Color("#000000");
            this.target.addChild(label);
            ps.Tween.to(
                label,
                { y: label.y + disY },
                this.duration,
                undefined,
                0
            ).onComplete.addOnce(() => {
                this.target.removeChild(label);
            });
        }
        /**
        * 添加对象
        * @param        target    目标对象
        * @param        duration      持续时长（毫秒）
        * @param        x       初始x
        * @param        y       初始y
        * @param        scale   图片大小
        * @param        skin    皮肤
        * @param        disY    所飘距离Y
       
        */
        static popImg(
            target: qc.Node,
            skin: qc.Texture,
            disY?: number,
            duration?: number,
            x?: number,
            y?: number,
            scale?: number
        ) {
            let sk = new PopBox();
            sk.popImg(target, skin, disY, duration, x, y, scale);
            return sk;
        }
        public popImg(
            target: qc.Node,
            skin: qc.Texture,
            disY?: number,
            duration?: number,
            x?: number,
            y?: number,
            scale?: number
        ) {
            if (disY === undefined) disY = -200;
            if (duration === undefined) duration = 500;
            if (x === undefined) x = 0;
            if (y === undefined) y = 0;
            if (scale === undefined) scale = 1;

            this.target = target;
            this.duration = duration;
            var img = qc_game.add.image();
            img.pivotX = 0.5;
            img.pivotX = 0.5;
            img.scaleX = scale;
            img.scaleY = scale;
            img.texture = skin;
            img.resetNativeSize();
            this.target.addChild(img);
            ps.Tween.to(img, { y: img.y + disY }, this.duration, undefined, 0).onComplete.addOnce(
                () => {
                    this.target.removeChild(img);
                }
            );
        }
    }
}
