var ps;
(function (ps) {
    var SceneTransition = /** @class */ (function () {
        function SceneTransition() {
        }
        SceneTransition.circleFullMask = function (game, gamePlay, nextScene) {
            var gamePhaser = game.phaser;
            var gameObjectPhaser = gamePlay.phaser;
            var oX = gamePhaser.width * .5;
            var oY = gamePhaser.height * .5;
            var circle = gamePhaser.add.graphics(oX, oY, gameObjectPhaser);
            gameObjectPhaser.addChild(circle);
            var w = gamePlay.width;
            var h = gamePlay.height;
            var d = Math.ceil(Math.sqrt(w * w + h * h)) * 1.5;
            var _d = d;
            var animTime = 200;
            var updateTime = 5;
            circle.beginFill(0x000);
            circle.drawCircle(0, 0, d);
            circle.endFill();
            gameObjectPhaser.mask = circle;
            var deltaD = Math.floor(updateTime / animTime * d);
            var scaleBig = false;
            var loop = game.timer.loop(updateTime, function () {
                d -= deltaD;
                circle.clear();
                circle.beginFill(0x000);
                circle.drawCircle(0, 0, d);
                circle.endFill();
                if (d < 0) {
                    scaleBig = true;
                    deltaD = -deltaD;
                    nextScene();
                }
                if (d > _d && scaleBig) {
                    gameObjectPhaser.mask = null;
                    circle.clear();
                    game.timer.remove(loop);
                }
            });
        };
        SceneTransition.rectSwipe = function (game, gamePlay, nextScene, resUrl) {
            var rectNode = game.add.node(gamePlay);
            var width = gamePlay.parent.width;
            var height = gamePlay.parent.height;
            rectNode.width = ps.ScrFix.width;
            rectNode.height = ps.ScrFix.height;
            var rect = new qc.Graphics(game, gamePlay);
            rect.beginFill(0x000);
            rect.drawRect(0, 0, width, height);
            rect.endFill();
            rectNode.addChild(rect);
            if (resUrl) {
                var img_1 = game.add.image(rectNode);
                game.assets.load(resUrl, function (data) {
                    img_1.texture = data;
                    img_1.resetNativeSize();
                });
                rectNode.addChild(img_1);
                rect.visible = false;
            }
            rectNode.y = height;
            ps.Tween.to(rectNode, {
                y: 0
            }, 700).onComplete.addOnce(function () {
                nextScene();
                ps.Tween.to(rectNode, {
                    y: -height
                }, 700);
                rectNode.parent && rectNode.parent.removeChild(rectNode);
            });
        };
        SceneTransition.circleFull = function (game, gamePlay, nextScene) {
            var circle = new qc.Graphics(game, gamePlay);
            var d = Math.ceil(Math.sqrt(ps.ScrFix.width * ps.ScrFix.width + ps.ScrFix.height * ps.ScrFix.height));
            circle.x = ps.ScrFix.cx;
            circle.y = ps.ScrFix.cy;
            circle.beginFill(0x000);
            circle.drawCircle(0, 0, d);
            circle.endFill();
            circle.scaleX = circle.scaleY = 0;
            ps.Tween.to(circle, {
                scaleX: 1,
                scaleY: 1
            }, 500).onComplete.addOnce(function () {
                nextScene();
                ps.Tween.to(circle, {
                    scaleX: 0,
                    scaleY: 0
                }, 500).onComplete.addOnce(function () {
                    circle.parent && circle.parent.removeChild(circle);
                });
            });
        };
        return SceneTransition;
    }());
    ps.SceneTransition = SceneTransition;
})(ps || (ps = {}));
