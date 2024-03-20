namespace ps {
  /**
   * 游戏状态控制,继承EventDispatcher，切换状态时会发送相应事件
   * @author VaMP
   */
  // @ts-ignore
  export class GameState extends ps.EventDispatcher {
    //状态
    private static readonly WAITING = 'waiting'
    private static readonly PLAYING = 'playing'
    private static readonly ENDED = 'ended'
    //事件
    static readonly READY = 'ready'
    static readonly GAMESTART = 'gameStart'
    static readonly START = 'start'
    static readonly END = 'end'
    static readonly RETRY = 'retry'
    static readonly SCENECHANGE = 'scenechange'
    /** 游戏状态 */
    protected _state: string
    /** 自动结束游戏定时器事件 */
    private autoEndTimerEvnet: qc.TimerEvent

    /** 游戏状态 */
    get state() {
      return this._state
    }

    get isWaiting() {
      return this.state === GameState.WAITING
    }

    get isPlaying() {
      return this.state === GameState.PLAYING
    }

    get isEnded() {
      return this.state === GameState.ENDED
    }

    /** 准备就绪 */
    ready() {
      this._state = GameState.WAITING
      this.dispatch(GameState.READY)
      return true
    }

    /** 开始 */
    start() {
      if (qici.config.editor) return
      if (!this.isWaiting) return
      this._state = GameState.PLAYING
      this.dispatch(GameState.START)
      //自动结束游戏定时器
      if (GAME_CFG['autoEndTime'] > 0) {
        this.autoEndTimerEvnet = qc_game.timer.add(
          GAME_CFG['autoEndTime'] * 1000,
          () => {
            ps.gameEnd(false)
          },
        )
      }
      return true
    }

    /** ending结果 */
    result: boolean = true

    /** 结束 */
    end(result: boolean = true) {
      if (this.isEnded) return
      this.result = result
      this._state = GameState.ENDED
      this.dispatch(GameState.END, result)
      //取消结束游戏定时器
      if (this.autoEndTimerEvnet) qc_game.timer.remove(this.autoEndTimerEvnet)
      return true
    }

    /** 重试 */
    retry() {
      this._state = GameState.WAITING
      this.dispatch(GameState.RETRY)
    }

    /** 重置为初始值（移除事件监听与状态 */
    reset() {
      this.removeAll()
      this._state = undefined
    }
  }
}
