import { Box } from "@mui/material";
import { data } from "../../ArtistData";
import ArtistCard from "./ArtistCard";

const artistListStyle = {
  margin: 5,  
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",  
};

export default function ArtistList() {
  return (
    <Box sx={artistListStyle}>
      {data.map(function (artist) {
        return <ArtistCard key={artist.id} name={artist.name} />;
      })}
    </Box>
  );
}