import MenuItemList from './MenuItemList';
import { Divider, Drawer, Toolbar } from "@mui/material";

interface IMenuDrawerProps {
    open: boolean,
    drawerWidth: number
}

export default function MenuDrawer({open, drawerWidth}: IMenuDrawerProps) {

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <Toolbar />
            <MenuItemList itemList={[{ title: 'Music Library', path: 'music-library' }]} />
            <Divider />            
        </Drawer>
    );
}