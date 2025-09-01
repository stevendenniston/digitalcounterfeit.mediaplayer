import { Box } from "@mui/material";
import { data } from "../../ArtistData";
import ArtistCard from "./ArtistCard";

const artistListStyle = {
  mt: 10,
  mb: 10,
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  maxWidth: "1880px",
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