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
import ProgressBar from "./ProgressBar";

const marquee = keyframes`
    0%   { transform: translateX(0);     animation-timing-function: linear; }
    45%  { transform: translateX(-110%); animation-timing-function: steps(1); }
    55%  { transform: translateX(110%);  animation-timing-function: linear; }
    100% { transform: translateX(0); }
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
    animation: `${marquee} 16s linear infinite`,
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

const TimeDisplay = styled(Typography)({
    flexShrink: 0,
    fontVariantNumeric: "tabular-nums", // fixed-width digits prevent layout shift as time ticks
    whiteSpace: "nowrap",
    padding: "0 16px",
    opacity: 0.8,
});

function formatTime(seconds: number): string {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) 
      return "–:––";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

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

  const {
    play, pause, next, previous, seek,
    isPlaying, currentTrack, currentTime, duration,    
  } = useAudioPlayer();

  const titleRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLElement>(null);
  const timeDisplayRef = useRef<HTMLElement>(null);

  useOverflowClass(titleRef);
  useOverflowClass(subtitleRef);

  const writeTimeDisplay = (time: number) => {
      if (timeDisplayRef.current)
          timeDisplayRef.current.textContent = `${formatTime(duration)} / ${formatTime(time)}`;
  };

  useEffect(() => {
    writeTimeDisplay(currentTime);
  }, [currentTime, duration]);

  return (
    <AppBar 
      color="secondary" 
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, top: "auto", bottom: 0 }}>
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={seek}
        onDragTime={writeTimeDisplay}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          visibility: currentTrack ? "visible" : "hidden",
        }}
      />
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
        <TimeDisplay ref={timeDisplayRef} variant="body2" sx={{ visibility: currentTrack ? "visible" : "hidden" }} />        
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