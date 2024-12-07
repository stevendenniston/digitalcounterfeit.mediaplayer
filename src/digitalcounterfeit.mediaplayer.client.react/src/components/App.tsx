import { Container } from "@mui/material";
import ArtistList from "./ArtistList";
import Menu from "./Menu";
import Player from "./Player";

export default function App() {
  return (
    <>
      <Container sx={{ display: "flex", flexDirection: "column"}}>
        <Menu />
        <ArtistList />
        <Player />
      </Container>
    </>
  );
}
