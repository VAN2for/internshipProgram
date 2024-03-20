/**
 * JSMpeg Player 描述文件
 * @file {jsmpegPlayer.d.ts}
 */
// can't publish to DefinitelyTyped beacuse the real jsmpeg is not on NPM
declare class Player {
    constructor(url: string, options: Omit<PlayerOptions, 'url'>);

    options: Omit<PlayerOptions, 'url'>;

    /** start playback */
    play(): void;

    /** pause playback */
    pause(): void;

    /** stop playback and seek to the beginning */
    stop(): void;

    /** advance playback by one video frame. This does not decode audio. Returns true on success, false when there's not enough data. */
    nextFrame(): void;

    /** stops playback, disconnects the source and cleans up WebGL and WebAudio state. The player can not be used afterwards. */
    destroy(): void;

    /** get or set the audio volume (0-1) */
    volume: number;

    /** get or set the current playback position in seconds */
    currentTime: number;

    /** read only, whether playback is paused */
    readonly paused: boolean;

    /** start loading video */
    startLoading(): void;

    /** start loading video */
    source: PlayerSource;

    demuxer: any;

    video: any;

    renderer: any;
}