import { useAuth0 } from "@auth0/auth0-react";
import { Logout, Settings } from "@mui/icons-material";
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useNavigate } from 'react-router-dom';

interface IProfileMenuProps {
    profileAnchor: HTMLElement | null, 
    setProfileAnchor : React.Dispatch<React.SetStateAction<HTMLElement | null>>
}

export default function ProfileMenu({profileAnchor, setProfileAnchor}: IProfileMenuProps) {
    
    const navigate = useNavigate();
    const {user, logout} = useAuth0();    
    const open = Boolean(profileAnchor);

    const handleClose = () => {
        setProfileAnchor(null);
    };
    
    return(
        <Menu
            anchorEl={profileAnchor}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={() => navigate('user-profile')}>
                <Avatar src={user?.picture} /> Profile
            </MenuItem>
            <Divider />                
            <MenuItem onClick={() => navigate('user-settings')}>
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                Settings
            </MenuItem>
            <MenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>

    );
}