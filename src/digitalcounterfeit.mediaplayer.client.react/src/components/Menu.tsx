import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";

export default function Menu() {
  const [isLoggedIn, login] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Audio Player
          </Typography>
          <IconButton color="inherit" onClick={() => login(!isLoggedIn)}>
            <Icon className="material-icons-round">
              {isLoggedIn ? "face" : "account_circle"}
            </Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
