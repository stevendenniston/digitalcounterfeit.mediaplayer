export interface AudioPlayerState {
    playlist: string[];
    currentTrackIndex: number;
    currentTrack: string | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}

type Subscriber = (state: AudioPlayerState) => void;

class AudioPlayerService {
    private audio: HTMLAudioElement;
    private playlist: string[] = [];
    private currentTrackIndex: number = -1;
    private isPlaying: boolean = false;
    private subscribers: Set<Subscriber> = new Set();

    constructor() {
        this.audio = new Audio();
        this.audio.addEventListener("ended", this.next);
        this.audio.addEventListener("timeupdate", this.notify);
        this.audio.addEventListener("play", () => {
            this.isPlaying = true;
            this.notify();
        });
        this.audio.addEventListener("pause", () => {
            this.isPlaying = false;
            this.notify();
        });
    }


    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    };


    private notify = (): void => {
        const state = this.getState();
        this.subscribers.forEach(cb => cb(state));
    };


    getState = (): AudioPlayerState => {

        return {
            playlist: this.playlist,
            currentTrackIndex: this.currentTrackIndex,
            currentTrack: this.playlist[this.currentTrackIndex] ?? null,
            isPlaying: this.isPlaying,
            currentTime: this.audio.currentTime,
            duration: this.audio.duration || 0
        };
    };


    setPlaylist = (playlist: string[]): void => {
        this.playlist = playlist;
        this.currentTrackIndex = playlist.length > 0 ? 0 : -1;

        if (this.currentTrackIndex !== -1) {
            this.audio.src = playlist[0];
        }

        this.notify();
    };


    play = async (index?: number): Promise<void> => {
        if (index !== undefined) {
            if (index < 0 || index >= this.playlist.length) 
                return;

            this.currentTrackIndex = index;
            this.audio.src = this.playlist[index];
        }

        await this.audio.play();
    };


    pause = async (): Promise<void> => {
        this.audio.pause();
    };


    seek = (time: number): void => {
        this.audio.currentTime = time;
        this.notify();
    };


    next = (): void => {
        if (this.currentTrackIndex < this.playlist.length - 1) {
            this.currentTrackIndex++;
            this.audio.src = this.playlist[this.currentTrackIndex];
            this.play();
        }
    };


    previous = (): void => {
        if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
            this.audio.src = this.playlist[this.currentTrackIndex];
            this.play();
        }
    };
}

const audioPlayerService = new AudioPlayerService();

export default audioPlayerService;