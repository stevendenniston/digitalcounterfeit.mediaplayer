import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Icon, IconButton, List, ListItem, ListItemText, Stack } from "@mui/material";
import DisplayCard from "./DisplayCard";
import { useParams } from "react-router-dom";

type AlbumState = {
  album: {id: string, name: string, imageUri: string} | undefined;
  trackList: {id: string, name: string}[];
  loadingStatus: "loading" | "success" | "error";
  error: string | undefined;
}

export default function Album() {

    const { albumId } = useParams();    
    const { getAccessTokenSilently } = useAuth0();
    const [ albumState, setAlbumState ] = useState<AlbumState>({
        album: undefined,
        trackList: [],
        loadingStatus: "loading",
        error: undefined
      })

    useEffect(() => {
        async function fetchData() {
            try {
                const token = await getAccessTokenSilently();

                const album = await axios.get(
                `${import.meta.env.APP_API_BASE_URL}/album/?id=${albumId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const trackList = await axios.get(
                `${import.meta.env.APP_API_BASE_URL}/album/audio-track-list?albumId=${albumId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setAlbumState({
                    album: album.data,
                    trackList: trackList.data,
                    loadingStatus: "success",
                    error: undefined
                });
                
            } catch (error) {
                setAlbumState({
                    album: undefined,
                    trackList: [],
                    loadingStatus: "error",
                    error: (error as Error).message
                });
            }
        }
    
        fetchData();        
    }, []);

    return (
        <Stack spacing={2} sx={{ alignItems: 'center', margin: 2 }}>
            <Box sx={{ width: '100%', maxWidth: 1080 }}>
                <DisplayCard sx={{ width: 250, height: 250 }} imageUri={albumState.album?.imageUri} />
                <List dense={false} sx={{ width: '100%', alignSelf: 'center' }}>
                    {albumState.trackList.map((track) => {
                        return (
                            <ListItem key={track.id} sx={{ bgcolor: 'primary.main', marginBottom: 1, borderRadius: 2 }}>
                                <IconButton edge="start" aria-label="play">
                                    <Icon sx={{ transform: "scale(1.5)" }} className="material-icons-round">
                                        {"play_circle_outline"}
                                    </Icon> 
                                </IconButton>
                                <ListItemText
                                    primary={track.name}                                    
                                    sx={{ color: 'whitesmoke', marginLeft: 2 }}
                                    />
                                <ListItemText
                                    primary={"0:00"}
                                    slotProps={{
                                        primary: {
                                            align: 'right',
                                            color: 'whitesmoke'
                                        }
                                    }}
                                    />
                                <IconButton edge="end" aria-label="favorite">
                                    <Icon sx={{ transform: "scale(1)", color: "whitesmoke" }} className="material-icons-round">
                                        {"favorite_border"}
                                    </Icon> 
                                </IconButton>
                            </ListItem>);})}
                </List>
            </Box>
        </Stack>
    );
}


