namespace ps {
    /**
     * 
     * @author: hs.lin
     * @date: 2021/01/31 17:55:29
     */
    export abstract class AbstractGameViewAsset extends Behaviour {
        protected _model = GameModel.instance;
        protected _controller = GameController.instance;
    }
}