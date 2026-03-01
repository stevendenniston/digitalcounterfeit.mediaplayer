
type Subscriber = (state: AudioPlayerState) => void;

export type UriResolver = (trackId: string) => Promise<string>;

export type AudioTrack = {
    id: string;
    name: string;
    artist: { name: string };
    album: { name: string };    
}

export interface AudioPlayerState {
    playlist: AudioTrack[];
    currentTrackIndex: number;
    currentTrack: AudioTrack | null;
    isPlaying: boolean;
    isResolving: boolean;
    currentTime: number;
    duration: number;
}

class AudioPlayerService {
    private audio: HTMLAudioElement;
    private playlist: AudioTrack[] = [];
    private currentTrackIndex: number = -1;
    private isPlaying: boolean = false;
    private isResolving: boolean = false;
    private subscribers: Set<Subscriber> = new Set();    
    private resolveUri: UriResolver | null = null;
    private uriCache: Map<string, { uri: string; cachedAt: number }> = new Map();
    private static readonly URI_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

    getState = (): AudioPlayerState => ({
        playlist: this.playlist,
        currentTrackIndex: this.currentTrackIndex,
        currentTrack: this.playlist[this.currentTrackIndex] ?? null,
        isPlaying: this.isPlaying,
        isResolving: this.isResolving,
        currentTime: this.audio.currentTime,
        duration: this.audio.duration || 0,
    });
    
    setPlaylist = (playlist: AudioTrack[], resolver: UriResolver): void => {
        this.audio.pause();
        this.isPlaying = false;
        this.uriCache.clear();

        this.playlist = playlist;
        this.resolveUri = resolver;
        this.currentTrackIndex = playlist.length > 0 ? 0 : -1;

        this.notify();
    };

    play = async (index?: number): Promise<void> => {
        const isResume = index === undefined;

        if (!isResume) {
            if (index < 0 || index >= this.playlist.length) 
                return;
            this.currentTrackIndex = index;
        }

        if (this.currentTrackIndex === -1) 
            return;

        if (!isResume) {
            const uri = await this.getUri(this.currentTrackIndex);
            if (!uri) 
                return;
            this.audio.src = uri;
        }

        try {
            await this.audio.play();
            this.prefetchNext();
        } catch (err) {
            console.warn("Playback failed:", err);
            this.isPlaying = false;
            this.notify();
        }
    };

    pause = async (): Promise<void> => {
        this.audio.pause();
    };

    seek = (time: number): void => {
        this.audio.currentTime = time;
        this.notify();
    };

    next = async (): Promise<void> => {
        if (this.currentTrackIndex < this.playlist.length - 1) {
            await this.play(this.currentTrackIndex + 1);
        }
    };

    previous = async (): Promise<void> => {
        if (this.currentTrackIndex > 0) {
            await this.play(this.currentTrackIndex - 1);
        }
    };

    destroy = (): void => {
        this.audio.removeEventListener("ended", this.next);
        this.audio.removeEventListener("timeupdate", this.notify);
        this.audio.pause();
        this.subscribers.clear();
    };
    

    private notify = (): void => {
        const state = this.getState();
        this.subscribers.forEach(cb => cb(state));
    };
    
    private getUri = async (index: number): Promise<string | null> => {
        const track = this.playlist[index];
        if (!track) return null;

        const cached = this.uriCache.get(track.id);
        const isFresh = cached && (Date.now() - cached.cachedAt) < AudioPlayerService.URI_TTL_MS;
        if (isFresh) return cached.uri;

        if (!this.resolveUri) {
            console.warn("AudioPlayerService: no URI resolver set");
            return null;
        }

        this.isResolving = true;
        this.notify();

        try {
            const uri = await this.resolveUri(track.id);
            this.uriCache.set(track.id, { uri, cachedAt: Date.now() });
            return uri;
        } catch (err) {
            console.error("AudioPlayerService: failed to resolve URI for track", track.id, err);
            return null;
        } finally {
            this.isResolving = false;
            this.notify();
        }
    };
    
    private prefetchNext = (): void => {
        const nextIndex = this.currentTrackIndex + 1;
        if (nextIndex >= this.playlist.length) 
            return;

        const nextTrack = this.playlist[nextIndex];
        if (!nextTrack) 
            return;

        const cached = this.uriCache.get(nextTrack.id);
        const isFresh = cached && (Date.now() - cached.cachedAt) < AudioPlayerService.URI_TTL_MS;
        if (isFresh) 
            return;
                
        this.getUri(nextIndex).catch(() => {});
    };
}

const audioPlayerService = new AudioPlayerService();

export default audioPlayerService;