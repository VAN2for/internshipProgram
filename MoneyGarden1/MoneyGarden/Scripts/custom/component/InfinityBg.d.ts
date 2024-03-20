declare namespace ps {
    /**
     * 无限循环背景，需配合Camera使用
     */
    class InfinityBg extends ps.Behaviour {
        /** 序列化 */
        private serializableFields;
        private cameraNode;
        private imgScale;
        private camera;
        private imgWidth;
        private imgHeight;
        awake(): void;
        update(): void;
    }
}
