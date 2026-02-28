import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import DisplayCard from "./DisplayCard";
import { useNavigate } from "react-router";

type ArtistListState = {
  artistList: {id: string, name: string}[];
  loadingStatus: "loading" | "success" | "error";
  error: string | undefined;
}

const artistListStyle = {
  margin: 2,
  marginBottom: 4,
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
};

export default function ArtistList() {

  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [ artistListState, setArtistListState ] = useState<ArtistListState>({
    artistList: [],
    loadingStatus: "loading",
    error: undefined
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getAccessTokenSilently();

        const library = await axios.get(
          `${import.meta.env.APP_API_BASE_URL}/library`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const artistList = await axios.get(
          `${import.meta.env.APP_API_BASE_URL}/library/artist-list?libraryId=${library.data.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setArtistListState({
          artistList: artistList.data,
          loadingStatus: "success",
          error: undefined
        });
      } catch (error) {
        setArtistListState({
          artistList: [],
          loadingStatus: "error",
          error: (error as Error).message
        });
      }
    }
    
    fetchData();
  }, []);

  if (artistListState.loadingStatus === "error") {
    return <Typography>Error: {artistListState.error}</Typography>;
  }

  if (artistListState.loadingStatus === "loading") {
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
    <Box sx={artistListStyle}>
      {artistListState.artistList.map(function (artist) {
        return <DisplayCard 
          key={artist.id} 
          name={artist.name} 
          onClick={() => navigate(`/artist/${artist.id}`)}
        />;
      })}
    </Box>    
  );
}