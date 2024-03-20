namespace ps {
    /**
     * 
     * @author: hs.lin
     * @date: 2021/01/28 21:49:59
     */
    export class GameResBindings extends Behaviour {
        private _model = GameModel.instance;
        // public readonly carPrefab: qc.Prefab;
        // public readonly enemyPrefab: qc.Prefab;
        // public readonly bulletPrefab: qc.Prefab;
        // public readonly starPopupPrefab: qc.Prefab;
        // public readonly effSparkPrefab: qc.Prefab;
        // public readonly effTxtHpHurtPrefab: qc.Prefab;
        // public readonly layerNpcBullet: qc.Node;
        // public readonly layerMineBullet: qc.Node;
        // public readonly sparkTextures: qc.Texture[];

        /** 序列化 */
        private serializableFields = {
            // carPrefab: qc.Serializer.PREFAB,
            // enemyPrefab: qc.Serializer.PREFAB,
            // bulletPrefab: qc.Serializer.PREFAB,
            // starPopupPrefab: qc.Serializer.PREFAB,
            // layerNpcBullet: qc.Serializer.NODE,
            // layerMineBullet: qc.Serializer.NODE,
            // effTxtHpHurtPrefab: qc.Serializer.PREFAB,
            // effSparkPrefab: qc.Serializer.PREFAB,
            // sparkTextures: qc.Serializer.TEXTURES,
        };

        constructor($node: qc.Node) {
            super($node);
            this._model.resBindings = this;
        }
    }
    qc.registerBehaviour("ps.GameResBindings", GameResBindings);
    GameResBindings['__menu'] = 'Custom/GameResBindings';
}