import React from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout, reset } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Grid from '@mui/material/Grid';



const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));





function Sidebar() {




    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };




    const navigate = useNavigate()
    const dispatch = useDispatch()

    const clickLogout = () => {
        handleClose()
        dispatch(logout())
        navigate('/login')
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline  />
                <AppBar position="fixed" open={drawerOpen}>
                    <Box>
                        <Grid container>
                            <Grid item xs={6} md={6}>
                                <Toolbar>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Typography variant="h6" noWrap component="div">
                                        Admin
                                    </Typography>

                                </Toolbar>

                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box sx={{ position: 'absolute', top: 4, right: 10 }}>
                                    <Tooltip title="Menu">
                                        <IconButton
                                            onClick={handleClick}
                                            size="small"
                                            sx={{ ml: 2 }}
                                            aria-controls={open ? 'account-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            <Avatar >M</Avatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorEl}
                                        id="account-menu"
                                        open={open}
                                        onClose={handleClose}
                                        onClick={handleClose}
                                        PaperProps={{
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
                                                '&:before': {
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
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <MenuItem>
                                            <Avatar /> Profile
                                        </MenuItem>
                                        <Divider />

                                        <Link to="/admin/settings">
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <Settings fontSize="small" />
                                                </ListItemIcon>
                                                Settings
                                            </MenuItem>
                                        </Link>
                                        <MenuItem onClick={clickLogout}>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                </AppBar>

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
                    open={drawerOpen}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <div id="sidebar-menu">
                        {/* Left Menu Start */}
                        <ul className="metismenu list-unstyled" id="side-menu">
                            <li className="menu-title">Menu</li>
                            <li>
                                <p className="waves-effect"><Link to="/admin"><span><i className="feather-airplay" /></span>Dashboard</Link></p>
                            </li>
                            <li>
                                <p className="waves-effect"><Link to="/admin/users"><span><i className="feather-users" /></span>Users</Link></p>
                            </li>
                            <li>
                                <p className="waves-effect"><Link to="/admin/settings"><span><i className="dripicons-browser" /></span>Website</Link></p>
                            </li>
                            <li>
                                <p className="waves-effect"><Link to="/admin/socials"><span><i className="fa fa-share-square" /></span>Social</Link></p>
                            </li>
                            <li>
                                <p className="waves-effect"><Link to="/admin/email"><span><i className="fa fa-envelope" /></span>Email Settings</Link></p>
                            </li>
                            <li>
                                <p className="waves-effect"><Link to="/admin/gallery"><span><i className="fa fa-image" /></span>Image Gallery</Link></p>
                            </li>
                            <li>
                                <p className="waves-effect"><Link to="/admin/menus"><span><i className="fa fa-link" /></span>Menu Links</Link></p>
                            </li>
                            <li>
                                <p className="waves-effect"><Link to="/admin/add"><span><i className="fas fa-coins" /></span>Add Airdrop</Link></p>
                            </li>
                        </ul>
                    </div>

                </Drawer>
                <Main style={{ padding:5 }} open={drawerOpen}>
                    <DrawerHeader />
                </Main>
            </Box>
        </>
    )
}

export default Sidebar