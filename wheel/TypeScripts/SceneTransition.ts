namespace ps {

    export class SceneTransition {

        public static circleFullMask(game: qc.Game, gamePlay: qc.Node, nextScene: Function) {
            const gamePhaser = (game as any).phaser as Phaser.Game
            const gameObjectPhaser = (gamePlay as any).phaser as Phaser.Group
            let oX = gamePlay.width * .5 
            let oY = gamePlay.height * .5 
            const circle: Phaser.Graphics = gamePhaser.add.graphics(oX, oY, gameObjectPhaser)
            gameObjectPhaser.addChild(circle)
            let w = gamePlay.width  
            let h = gamePlay.height 
            let d = Math.ceil(Math.sqrt(w * w + h * h)) * 1.5
            let _d = d
            const animTime = 200
            const updateTime = 5
            circle.beginFill(0x000)
            circle.drawCircle(0, 0, d)
            circle.endFill()
            gameObjectPhaser.mask = circle
            let deltaD = Math.floor(updateTime / animTime * d)
            let scaleBig: boolean = false
            const loop = game.timer.loop(updateTime, () => {
                d -= deltaD
                circle.clear()
                circle.beginFill(0x000)
                circle.drawCircle(0, 0, d)
                circle.endFill()
                if (d < 0) {
                    scaleBig = true
                    deltaD = -deltaD
                    nextScene()
                }
                if (d > _d && scaleBig) {
                    gameObjectPhaser.mask = null
                    circle.clear()
                    game.timer.remove(loop)
                }
            })
        }

        public static rectSwipe(game: qc.Game, gamePlay: qc.Node, nextScene: Function, resUrl?: string) {
            const rectNode: qc.Node = game.add.node(gamePlay)
            const width: number = gamePlay.parent.width
            const height: number = gamePlay.parent.height
            rectNode.width = ps.ScrFix.width
            rectNode.height = ps.ScrFix.height
            const rect: qc.Graphics = new qc.Graphics(game, gamePlay)
            rect.beginFill(0x000)
            rect.drawRect(0, 0, width, height)
            rect.endFill()
            rectNode.addChild(rect)
            if (resUrl) {
                const img: qc.UIImage = game.add.image(rectNode)
                game.assets.load(resUrl, (data: qc.Texture) => {
                    img.texture = data
                    img.resetNativeSize()
                })
                rectNode.addChild(img)
                rect.visible = false
            }
            rectNode.y = height
            ps.Tween.to(rectNode, {
                y: 0
            }, 700).onComplete.addOnce(() => {
                nextScene()
                ps.Tween.to(rectNode, {
                    y: -height
                }, 700)
                rectNode.parent && rectNode.parent.removeChild(rectNode)
            })
        }

        public static circleFull(game: qc.Game, gamePlay: qc.Node, nextScene: Function) {
            const circle: qc.Graphics = new qc.Graphics(game, gamePlay)
            const d: number = Math.ceil(Math.sqrt(ps.ScrFix.width * ps.ScrFix.width + ps.ScrFix.height * ps.ScrFix.height))
            circle.x = ps.ScrFix.cx
            circle.y = ps.ScrFix.cy
            circle.beginFill(0x000)
            circle.drawCircle(0, 0, d)
            circle.endFill()
            circle.scaleX = circle.scaleY = 0
            ps.Tween.to(circle, {
                scaleX: 1,
                scaleY: 1
            }, 500).onComplete.addOnce(() => {
                nextScene()
                ps.Tween.to(circle, {
                    scaleX: 0,
                    scaleY: 0
                }, 500).onComplete.addOnce(() => {
                    circle.parent && circle.parent.removeChild(circle)
                })
            })
        }
    }
}