var PlaySmartEditorData = qc.defineBehaviour('playsmart.editor.data', qc.Behaviour, function() {
 this.screenAdapter = {};
 this.screenAdapterSwitch = true;
 this.sceneData = {};
 this.sequenceFrameType = '';
 this.vpAst = {};
 this.vpAstLock = false
 this.gameConfig = {};
}, {
    screenAdapter: qc.Serializer.MAPPING,
    screenAdapterSwitch: qc.Serializer.BOOLEAN,
    sceneData: qc.Serializer.MAPPING,
    sequenceFrameType: qc.Serializer.STRING,
    vpAst: qc.Serializer.MAPPING,
    vpAstLock: qc.Serializer.BOOLEAN,
    gameConfig: qc.Serializer.MAPPING
});
