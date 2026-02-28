import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import DisplayCard from "./DisplayCard";

type ArtistState = {
  artist: {id: string, name: string} | undefined;
  albumList: {id: string, name: string, imageUri: string}[];
  loadingStatus: "loading" | "success" | "error";
  error: string | undefined;
}

const albumListStyle = {
  margin: 5,  
  display: "flex",
  justifyContent: "left",
  flexWrap: "wrap",
};

export default function Artist() {

    const { artistId } = useParams();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();
    const [ artistState, setArtistState ] = useState<ArtistState>({
        artist: undefined,
        albumList: [],
        loadingStatus: "loading",
        error: undefined
      })

    useEffect(() => {
        async function fetchData() {
            try {
                const token = await getAccessTokenSilently();

                const artist = await axios.get(
                `${import.meta.env.APP_API_BASE_URL}/artist/?id=${artistId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const albumList = await axios.get(
                `${import.meta.env.APP_API_BASE_URL}/artist/album-list?artistId=${artistId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setArtistState({
                    artist: artist.data,
                    albumList: albumList.data,
                    loadingStatus: "success",
                    error: undefined
                });
                
            } catch (error) {
                setArtistState({
                    artist: undefined,
                    albumList: [],
                    loadingStatus: "error",
                    error: (error as Error).message
                });
            }
        }
    
        fetchData();
    }, []);

    if (artistState.loadingStatus === "error") {
        return <Typography>Error: {artistState.error}</Typography>;
    }

    if (artistState.loadingStatus === "loading") {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <DisplayCard name={artistState.artist?.name} />
            <Box sx={albumListStyle}>
                {artistState.albumList.map(function (album) {
                    return <DisplayCard 
                        key={album.id}  
                        name={album.name} 
                        imageUri={album.imageUri}
                        onClick={() => navigate(`/album/${album.id}`)} 
                    />;
                })}
            </Box>
        </>
    );
}


