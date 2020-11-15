import { AudioTrack } from "./audio-track";

export class Playlist {
    id: string;
    libraryId: string;
    name: string;
    trackList: AudioTrack[];
}
