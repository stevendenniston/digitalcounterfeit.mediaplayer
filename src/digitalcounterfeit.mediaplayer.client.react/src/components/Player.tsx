import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import Icon from "@mui/material/Icon";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";

const StyledFab = styled(Fab)({
  zIndex: 1,
  top: -20,
  margin: 2,
});

const TrackInfoBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
});

const ControlBox = styled(Box)({
  display: "flex",
  flexGrow: 0.2,
  flexShrink: 0,
  justifyContent: "center",
  alignItems: "center",
});

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { play, pause, next, previous } = useAudioPlayer();

  return (
    <AppBar color="secondary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, top: "auto", bottom: 0 }}>
      <Toolbar>
        <TrackInfoBox>
          <Typography>Some Track</Typography>
          <Typography>Some Artist - Some Album</Typography>
        </TrackInfoBox>
        <ControlBox>
          <StyledFab size="small" color="primary" onClick={() => previous()}>
            <Icon className="material-icons-round">skip_previous</Icon>
          </StyledFab>
          <StyledFab 
            color="primary" 
            onClick={() => 
              isPlaying ? 
              pause().then(() => setIsPlaying(false)) : 
              play().then(() => setIsPlaying(true))}>
            <Icon sx={{ transform: "scale(1.5)" }} className="material-icons-round">
              {isPlaying ? "pause_circle_outline" : "play_circle_outline"}
            </Icon>
          </StyledFab>
          <StyledFab size="small" color="primary" onClick={() => next()}>
            <Icon className="material-icons-round">skip_next</Icon>
          </StyledFab>
        </ControlBox>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <IconButton color="inherit">
            <Icon className="material-icons-round">shuffle</Icon>
          </IconButton>
          <IconButton color="inherit">
            <Icon className="material-icons-round">repeat</Icon>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}