import Box from "@mui/material/Box";
import { styled } from '@mui/material';
import { useState } from 'react';
import MenuBar from "./MenuBar";
import ProfileMenu from "./ProfileMenu";
import MenuDrawer from "./MenuDrawer";
import Player from "./Player";
import { AudioPlayerProvider } from "../contexts/AudioPlayerContext";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
    }>(({ theme }) => ({
        flexGrow: 0,        
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: '64px',
    marginBottom: '64px',
    marginLeft: `-${drawerWidth}px`,
    variants: [
        {
            props: ({ open }) => open,
            style: {
                transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            },
        },
    ],
}));

export default function Layout(props: any) {    
    
    const [open, setOpen] = useState(true);
    const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);    

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setProfileAnchor(event.currentTarget);
    };

    return (
        <Box sx={{ display: 'flex', margin: 0 }}>
            <MenuBar handleDrawerToggle={handleDrawerToggle} handleProfileClick={handleProfileClick} />
            <ProfileMenu profileAnchor={profileAnchor} setProfileAnchor={setProfileAnchor} />
            <MenuDrawer open={open} drawerWidth={drawerWidth} />
            <AudioPlayerProvider>
                <Main 
                    open={open} 
                    sx={{ 
                        textAlign: 'left', 
                        width: open ? `calc(100% - ${drawerWidth}px)` : `100%`, 
                        height: 'calc(100vh - 128px)', overflowY: 'auto' }}
                >
                    {props.children}
                </Main>
                <Player />
            </AudioPlayerProvider>
        </Box>
    );
}