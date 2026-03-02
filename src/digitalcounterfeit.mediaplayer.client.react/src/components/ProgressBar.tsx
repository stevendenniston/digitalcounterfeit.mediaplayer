import React from "react";
import { styled } from "@mui/material/styles";
import Box, { type BoxProps } from "@mui/material/Box";

const HitArea = styled(Box)({
    position: "relative",
    width: "100%",
    height: "16px",
    cursor: "pointer",
    "&:hover .progress-thumb": {
        opacity: 1,
        transform: "translateY(-50%) scale(1)",
    },
});

const Track = styled(Box)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    borderRadius: "2px",
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "visible",
});

const Fill = styled(Box)(({ theme }) => ({
    height: "100%",
    borderRadius: "2px",
    backgroundColor: theme.palette.primary.light,
    position: "relative",    
    transition: "width 0.05s linear",
    ".dragging &": {
        transition: "none",
    },
}));

const Thumb = styled(Box)(({ theme }) => ({
    position: "absolute",
    right: "-6px",
    top: "50%",
    transform: "translateY(-50%) scale(0)",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.light,
    opacity: 0,
    transition: "opacity 0.15s ease, transform 0.15s ease",
    pointerEvents: "none",    
    ".dragging &": {
        opacity: 1,
        transform: "translateY(-50%) scale(1)",
    },
}));

interface ProgressBarProps extends Omit<BoxProps, "onSeek"> {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    onDragTime?: (time: number) => void;
}

export default function ProgressBar({ currentTime, duration, onSeek, onDragTime, ...boxProps }: ProgressBarProps) {

    const hitAreaRef = React.useRef<HTMLDivElement>(null);
    const fillRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);    

    const ratioFromEvent = (e: React.PointerEvent): number => {
        const rect = hitAreaRef.current!.getBoundingClientRect();
        const clamped = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        return clamped / rect.width;
    };
    
    const setFillPercent = (percent: number) => {
        if (fillRef.current) fillRef.current.style.width = `${percent}%`;
    };    

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!duration) 
            return;
        e.currentTarget.setPointerCapture(e.pointerId);
        isDragging.current = true;
        hitAreaRef.current?.classList.add("dragging");
        const ratio = ratioFromEvent(e);
        setFillPercent(ratio * 100);
        onDragTime?.(ratio * duration);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) 
            return;
        const ratio = ratioFromEvent(e);
        setFillPercent(ratio * 100);
        onDragTime?.(ratio * duration);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging.current) 
            return;
        isDragging.current = false;
        hitAreaRef.current?.classList.remove("dragging");
        onSeek(ratioFromEvent(e) * duration);        
    };
    
    React.useEffect(() => {
        if (isDragging.current) 
            return;
        const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
        setFillPercent(percent);
    }, [currentTime, duration]);
    
    return (
        <HitArea
            ref={hitAreaRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            {...boxProps}
        >
            <Track>
                <Fill ref={fillRef} style={{ width: "0%" }}>
                    <Thumb className="progress-thumb" />
                </Fill>
            </Track>
        </HitArea>
    );
}