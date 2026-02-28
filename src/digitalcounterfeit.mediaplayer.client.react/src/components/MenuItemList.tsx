import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

interface IMenuItem {
    title: string,
    path: string
}

export default function MenuItemList(props: {itemList: Array<IMenuItem>;}) {

    const navigate = useNavigate();

    return (
        <List>
            {props.itemList.map((item) => (
                <ListItem key={item.title} disablePadding>
                    <ListItemButton 
                        onClick={() => navigate(`${item.path}`)} 
                        selected={window.location.pathname.includes(item.path)}>
                        <ListItemText primary={item.title} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}