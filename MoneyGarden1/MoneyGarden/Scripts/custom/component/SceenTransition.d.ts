declare namespace ps {
    class SceneTransition {
        static circleFullMask(game: qc.Game, gamePlay: qc.Node, nextScene: Function): void;
        static rectSwipe(game: qc.Game, gamePlay: qc.Node, nextScene: Function, resUrl?: string): void;
        static circleFull(game: qc.Game, gamePlay: qc.Node, nextScene: Function): void;
    }
}
