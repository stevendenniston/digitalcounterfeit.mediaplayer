import { styled, keyframes } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import Icon from "@mui/material/Icon";
import { Typography } from "@mui/material";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { useEffect, useRef } from "react";

const marquee = keyframes`
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100%); }
`;

const StyledFab = styled(Fab)({
  zIndex: 1,
  top: -20,
  margin: 2,
});

const TrackInfoBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  flexShrink: 1,
  minWidth: 0,
  overflow: "hidden",
});

const ScrollingText = styled(Typography)({
  whiteSpace: "nowrap",
  display: "inline-block",
  "&.overflowing": {
      animation: `${marquee} 12s linear infinite`,
      "&:hover": {
          animationPlayState: "paused",
      },
  },
});

const ControlBox = styled(Box)({
  display: "flex",
  flexGrow: 0.2,
  flexShrink: 0,
  justifyContent: "center",
  alignItems: "center",
});

function useOverflowClass(ref: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        function update() {
            if (!el) return;
            el.classList.toggle("overflowing", el.scrollWidth > el.parentElement!.clientWidth);
        }

        update();

        const observer = new ResizeObserver(update);
        observer.observe(el);
        if (el.parentElement) observer.observe(el.parentElement);

        return () => observer.disconnect();
    }, [ref]);
}

export default function Player() {

  const { play, pause, next, previous, isPlaying, currentTrack } = useAudioPlayer();

  const titleRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLElement>(null);
  useOverflowClass(titleRef);
  useOverflowClass(subtitleRef);

  return (
    <AppBar color="secondary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, top: "auto", bottom: 0 }}>
      <Toolbar>
        <TrackInfoBox sx={{ visibility: currentTrack ? "visible" : "hidden" }}>
          <Box sx={{ overflow: "hidden" }}>
            <ScrollingText ref={titleRef}>
              {currentTrack?.name}
            </ScrollingText>
          </Box>
          <Box sx={{ overflow: "hidden" }}>
            <ScrollingText ref={subtitleRef} variant="body2">
              {currentTrack?.artist.name} – {currentTrack?.album.name}
            </ScrollingText>
          </Box>
        </TrackInfoBox>
        <ControlBox>
          <StyledFab size="small" color="primary" onClick={() => previous()}>
            <Icon className="material-icons-round">skip_previous</Icon>
          </StyledFab>
          <StyledFab 
            color="primary" 
            onClick={() => isPlaying ? pause() : play()}>
            <Icon sx={{ transform: "scale(1.5)" }} className="material-icons-round">
              {isPlaying ? "pause_circle_outline" : "play_circle_outline"}
            </Icon>
          </StyledFab>
          <StyledFab size="small" color="primary" onClick={() => next()}>
            <Icon className="material-icons-round">skip_next</Icon>
          </StyledFab>
        </ControlBox>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <IconButton color="inherit" disabled title="Shuffle (not yet implemented)">
            <Icon className="material-icons-round">shuffle</Icon>
          </IconButton>
          <IconButton color="inherit" disabled title="Repeat (not yet implemented)">
            <Icon className="material-icons-round">repeat</Icon>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}