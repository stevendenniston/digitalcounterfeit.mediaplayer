import { Album } from "./album";
import { Artist } from "./artist";

export class AudioTrack {
    id: string;
    artist: Artist;
    album: Album;
    name: string;
    number: number;
    discNumber: number;
}
