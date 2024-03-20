namespace ps {
  export enum AudioEvent {
    /** 音效开始 */
    AUDIO_PLAY_START = "audio_play_start",
    /** 音效结束 */
    AUDIO_PLAY_COMPLETE = "audio_play_complete",
  }
  type stageType = 'start' | 'game' | 'ending' | 'common';
  /**
   * 音效组件,用于挂在音效节点上
   */
  export class AudioNode extends Behaviour {
    private sourceAudioDuration = 0; // 原音效时长
    private sourceAudioUrl   = ''; // 原音效url
    private audioUrl   = ''; // 当前音效 URL
    private clipStartTime   = 0; // 上一次裁剪起始时间，单位毫秒
    private clipEndTime   = 0; // 上一次裁剪结束时间，单位毫秒
    private volume   = 100; // 音量
    private autoPlay   = false; // 自动播放
    private loopNumber   = 1; // [<= 0]:循环 [>0]:次数播放
    private loop   = true; // 循环播放
    private size   = 0;  // 文件大小

    private vpActionConfig = {
      vpReplaySound: {
        type: "object",
        properties: {
          loop: {
            "title": "是否循环",
            "component": "switch"
          },
          loopNumber: {
            "title": "播放次数",
            "component": "input-number"
          }
        },
        initData: {
          loop: false,
          loopNumber: 1
        },
        initFunc: function () {
        }
      },
      vpResumeSound: null,
      vpStopSound: {
        type: "object",
        properties: {
          isStop: {
            "title": "是否暂停当前场景全部音效",
            "component": "switch"
          }
        },
        initData: {
          isStop: true
        },
        initFunc: function () {
        }
      },
    }
    private vpAction = {
      vpReplaySound: {
        label: '从头播放音效',
        method: 'vpReplaySound',
        category: '音效',
        target: true,
        paramLabel: 'target'
      },
      vpResumeSound: {
        label: '继续播放音效',
        method: 'vpResumeSound',
        category: '音效',
        target: true,
        paramLabel: 'target'
      },
      vpStopSound: {
        label: '暂停播放音效',
        method: 'vpStopSound',
        category: '音效',
        target: true,
        paramLabel: 'target'
      },
    };

    constructor(gameObject: qc.Node) {
      super(gameObject);
    }
    /** 序列化 */
    private serializableFields: unknown = {
      sourceAudioDuration: qc.Serializer.NUMBER,
      sourceAudioUrl: qc.Serializer.STRING,
      audioUrl: qc.Serializer.STRING,
      clipStartTime: qc.Serializer.NUMBER,
      clipEndTime: qc.Serializer.NUMBER,
      volume: qc.Serializer.NUMBER,
      autoPlay: qc.Serializer.BOOLEAN,
      loopNumber: qc.Serializer.NUMBER,
      loop: qc.Serializer.BOOLEAN,
      size: qc.Serializer.NUMBER
    };

    /** 组件被激活后执行 */
    public awake() {
      // 编辑器环境下需要预加载音效
      if (ps.ENV !== 'RELEASE') {
        var audioName = this.getAudioName();
        var audioStage = this.getAudioStage();
        ps.Audio.playSound(audioName, audioStage, 'mp3');
        ps.Audio.stopSound(audioName, audioStage, 'mp3');
      }
      // 进入场景是否自动播放音效
      ps.mainState.add(ps.GameState.SCENECHANGE, (uuid) => {
        var curScene = this.getCurScene();
        if (curScene.uuid === uuid) {
          if (this.autoPlay) {
            setTimeout(() => {
              var audioName = this.getAudioName();
              var audioStage = this.getAudioStage();
              ps.Audio.playSound(audioName, audioStage, 'mp3', this.loopNumber, () => {
                main.gameEvent.dispatch(ps.AudioEvent.AUDIO_PLAY_COMPLETE, this.gameObject.uuid);
              }, this.gameObject.uuid);
            })
          }
        }
      }, this);
    }
    private setConfig (config) {
      Object.keys(config).forEach((key)=>{
        this[key] = config[key]
      })
    };
    /**
     * 从头播放音效
     * @param param {{ loop: boolean, loopNumber: number }}
     * @param param.loop 是否循环
     * @param param.loopNumber 播放次数
     */
    private vpReplaySound (param) {
      var uuid = this.gameObject.uuid;
      var audioName = this.getAudioName();
      var audioStage = this.getAudioStage();
      ps.Audio.stopSound(audioName, audioStage, 'mp3');
      // 优先查看是否循环，如果非循环播放，则查看播放次数
      var t = parseInt(param.loop ? 0 : param.loopNumber ? param.loopNumber : 1, 10);
      // 暂停后延迟20ms才播放，因为暂停的下一帧才会触发音效的onended，要等onended后才播放，所以要延迟
      setTimeout(() => {
        ps.Audio.playSound(audioName, audioStage, 'mp3', t, () => {
          main.gameEvent.dispatch(ps.AudioEvent.AUDIO_PLAY_COMPLETE, uuid);
        }, uuid);
      },20)
    }
    private vpResumeSound (param) {
      var audioName = this.getAudioName();
      var audioStage = this.getAudioStage();
      ps.Audio.resumeSound(audioName, audioStage, 'mp3');
    }
    private vpStopSound (param) {
      if (param && param.isStop) {
        var curScene = this.getCurScene();
        curScene.children.forEach((child) => {
          var audio = child.getScript('ps.AudioNode')
          if (audio) {
            var _audioName = audio.getAudioName();
            var _audioStage = audio.getAudioStage();
            ps.Audio.pauseSound(_audioName, _audioStage, 'mp3');
          }
        })
        return;
      }
      var audioName = this.getAudioName();
      var audioStage = this.getAudioStage();
      ps.Audio.pauseSound(audioName, audioStage, 'mp3');
    }
    private getAudioName () {
      return this.audioUrl.slice(this.audioUrl.lastIndexOf('/') + 1).replace('.mp3', '')
    }
    private getAudioStage () {
      return this.audioUrl.match(/resource\/(.*)\/audio\//)[1] as stageType
    }
    private getCurScene () {
      var curScene = this.gameObject;
      while(1) {
        if (curScene.parent.getScript('ps.VPGamePlay')) {
          break;
        }
        curScene = curScene.parent;
      }
      return curScene;
    }
  }
  qc.registerBehaviour('ps.AudioNode', AudioNode);
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
  pl状态回调(onInit、onStart、onEnding、onRetry)
  如果实现了这几个函数，会在pl进行到相应状态的时候进行回调
  */
}
