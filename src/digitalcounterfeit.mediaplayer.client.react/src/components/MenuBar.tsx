import MenuIcon from "@mui/icons-material/Menu";
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

interface IMenuBarProps {
    handleDrawerToggle: React.MouseEventHandler<HTMLButtonElement>,
    handleProfileClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function MenuBar({handleDrawerToggle, handleProfileClick}: IMenuBarProps) {
    
    const navigate = useNavigate();
    const {user} = useAuth0();    

    return (
        <AppBar position="fixed" color="secondary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
                edge="start"                                        
                sx={{ mr: 2 }}>
                <MenuIcon fontSize='large'/>
            </IconButton>
            <Typography onClick={() => navigate('')} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                DigitalCounterfeit Media Player
            </Typography>
            <IconButton
                color="inherit"
                onClick={handleProfileClick}>
                <Avatar src={user?.picture} />
            </IconButton>
            </Toolbar>
        </AppBar>
    );
}