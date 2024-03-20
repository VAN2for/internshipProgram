/**
 * JSMpeg Player Source 描述文件
 * @file {jsmpegPlayerSource.d.ts}
 */
// can't publish to DefinitelyTyped beacuse the real jsmpeg is not on NPM
declare type PlayerSource = {
    completed: boolean;

    destination: any;

    established: boolean;

    onCompletedCallback(source: unknown): void;

    onEstablishedCallback(source: unknown): void;

    progress: number;

    request: XMLHttpRequest;

    streaming: boolean;

    /** WebSocket URL (starting in `ws://` or `wss://`) */
    url: string;

    connect: any;

    start: any;
};