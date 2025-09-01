import { Card, CardMedia, Typography } from "@mui/material";

interface IArtistCardProps {
    name: string
}

const artistCardStyle = {
  display: "flex",
  flexFlow: "column-reverse",
  width: 180,
  height: 180,
  borderRadius: 1,
  p: "0px",
  m: "3px",
  backgroundColor: "primary.main",
  "&:hover": {
    cursor: "pointer",
    bgcolor: "primary.dark",
    WebkitBoxShadow: "0px 0px 3px 3px rgb(185, 183, 183)",
    boxShadow: "0px 0px 3px 3px rgb(185, 183, 183);",
  },
};

const artistNameStyle = {
  position: "absolute",
  width: 164,
  ml: "8px",
  mr: "8px",
  mb: "4px",
  color: "whitesmoke",
};

export default function ArtistCard({ name } : IArtistCardProps) {
  return (
    <Card sx={artistCardStyle}>
      <CardMedia component="img" height="100%" width="100%" />
      <Typography variant="subtitle2" sx={artistNameStyle}>
        {name}
      </Typography>
    </Card>
  );
}