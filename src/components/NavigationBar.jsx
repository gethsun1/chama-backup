import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "connectkit";

const NavigationBar = () => {
  const { address, isConnected } = useAccount();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Create Chama", path: "/create-chama" },
    { title: "Join Chama", path: "/join-chama" },
    { title: "Dashboard", path: "/dashboard" },
  ];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Chama DApp
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{
                  width: 250,
                  bgcolor: "background.paper",
                  height: "100%",
                }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {navLinks.map((link, index) => (
                    <ListItem
                      button
                      key={index}
                      component={Link}
                      to={link.path}
                      sx={{
                        py: 2,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemText
                        primary={link.title}
                        primaryTypographyProps={{
                          fontWeight: "medium",
                          color: "text.primary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          navLinks.map((link, index) => (
            <Button
              key={index}
              component={Link}
              to={link.path}
              sx={{ 
                color: "white", 
                textTransform: "none",
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {link.title}
            </Button>
          ))
        )}

        <Box sx={{ 
          ml: 2,
          '& button': {
            borderRadius: '8px !important',
            padding: '8px 16px !important',
            border: '2px solid white !important',
            backgroundColor: 'black !important',
            color: 'white !important',
            '&:hover': {
              backgroundColor: '#333 !important'
            }
          }
        }}>
          <ConnectButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
