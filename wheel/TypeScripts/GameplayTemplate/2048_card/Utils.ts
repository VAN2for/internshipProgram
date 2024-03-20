namespace ps.utils {
  // 播放声音
  export function playSound(soundName: string) {
    if (soundName) {
      const nodeAudio = UIRoot.getChild(soundName);
      if (nodeAudio && AudioTrigger?.playSound) {
        AudioTrigger.playSound(nodeAudio, true, false, 1);
      } else {
        Audio.playSound(soundName);
      }
    }
  }
  // 抛出异常
  export function debugAssert(cond: boolean, ...data: unknown[]) {
    if (ps.ENV === "DEBUG") {
      console.assert(cond, ...data);
    }
  }
  // 翻卡牌
  export function changeCard(open: qc.Node, close: qc.Node) {
    close.scaleX = 0;
    close.visible = true;
    open.scaleX = 1;
    close.visible = true;
    gsap.to(open, { scaleX: 0, duration: 0.1, ease: 'none' }).then(() => {
      open.visible = false;
      gsap.to(close, {
        scaleX: 1, duration: 0.1, ease: 'none'
      });
    });
  }
}