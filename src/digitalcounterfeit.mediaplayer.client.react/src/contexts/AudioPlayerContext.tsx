import react from "react";
import audioPlayerService, {type AudioPlayerState} from "../services/AudioPlayerService";


export interface AudioPlayerContextType extends AudioPlayerState {
    setPlaylist: (playlist: string[]) => void;
    play: (index?: number) => Promise<void>;
    pause: () => Promise<void>;
    seek: (time: number) => void;
    next: () => void;
    previous: () => void;
}

const AudioPlayerContext =
    react.createContext<AudioPlayerContextType | undefined>(undefined);

interface Props {
    children: react.ReactNode;
}

export const AudioPlayerProvider = ({ children }: Props) => {

    const [state, setState] =
        react.useState<AudioPlayerState>(audioPlayerService.getState());

    react.useEffect(() => {
        const unsubscribe =
            audioPlayerService.subscribe(setState);

        return unsubscribe;
    }, []);

    const value: AudioPlayerContextType = {
        ...state,
        setPlaylist: audioPlayerService.setPlaylist,
        play: audioPlayerService.play,
        pause: audioPlayerService.pause,
        seek: audioPlayerService.seek,
        next: audioPlayerService.next,
        previous: audioPlayerService.previous
    };

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
};


export const useAudioPlayer =
    (): AudioPlayerContextType => {
        const context = react.useContext(AudioPlayerContext);

        if (!context) {
            throw new Error(
                "useAudioPlayer must be used inside AudioPlayerProvider"
            );
        }

        return context;
    };