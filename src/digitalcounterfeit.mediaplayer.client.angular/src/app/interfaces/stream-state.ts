export interface StreamState {
    isPlaying: boolean;
    readableCurrentTime: string;
    readableDuration: string;
    duration: number | undefined;
    currentTime: number | undefined;
    canPlay: boolean;
    error: boolean;
    hasEnded: boolean;
}
