declare namespace ps {
    /**
     * 多语言系统组件
     * @author JingBin
     */
    class Languages extends ps.Behaviour {
        /** 配置中的 key */
        langKey: string;
        /** 所有语言图片纹理 */
        private debugConfig;
        /** 序列化 */
        private serializableFields;
        constructor(gameObject: qc.Node);
        awake(): void;
        /**
         * 获取多语言配置
         * @returns {Object} 当前多语言配置
         */
        getRes(): Object;
        /**
         * 刷新
         * @param key 对应文案，配置中的key
         * @param hasLog 是否需要打印日志提示。在编辑、调试环境下默认为 true
         */
        refresh(key: string, hasLog?: boolean): void;
        /**
         * 刷新目标对象（文本控件、图片控件）
         * @param hasLog 是否需要打印日志提示。在编辑、调试环境下默认为 true
         */
        refreshTarget(hasLog?: boolean): void;
    }
}
