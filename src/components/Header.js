
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useDispatch, useSelector } from 'react-redux';
import { updateWallet } from '../app/connectWeb3'
import Loading from './Loading';
import CardMedia from '@mui/material/CardMedia';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useToggle } from '../hooks'
import Link from '@mui/material/Link';
import Grid from '@mui/system/Unstable_Grid';
import '../index.css'
import axios from 'axios'
import { useTheme } from "@emotion/react";






const colors = {
    boldFirstColor: "#FBBD17",
    boldSecondColor: "#FBBD17",
    cardBackground: "black"
}


const ResponsiveAppBar = ({ pageLoading }) => {

    function getFaviconEl() {
        return document.getElementById("favicon");
    }
    const theme = useTheme();
    const [headerLinks, setHeaderLinks] = useState([{
        "id": 0,
        "name": "",
        "link": "",
        "menu_place": ""
    }])

    const [isMenu, toggleMenu] = useToggle()

    const [siteSettings, setSiteSettings] = useState({
        activation_enable: 0,
        author: "",
        describtion: "",
        favicon_url: "",
        id: 1,
        keywords: "",
        logo_url: "",
        register_enable: "",
        title: "",
        url: ""
    });

    const dispatch = useDispatch();
    const { web3g, pending, error } = useSelector((state) => state.wallet)
    const addressShort = web3g.walletAddress.substring(0, 4) + '...' + web3g.walletAddress.substring(38, 42)

    useEffect(() => {
        const getThings = async () => {
            const settings = await axios.get('/api/settings');
            const links = await axios.get('/api/menu');
            setSiteSettings(settings.data[0]);
            setHeaderLinks(() => links.data.filter(e => e.menu_place == "header"));
            document.title = settings.data[0].title;
            document.describtion = settings.data[0].describtion;
            document.author = settings.data[0].author;
            document.keywords = settings.data[0].keywords;
            const favicon = getFaviconEl()
            favicon.href = settings.data[0].url + settings.data[0].favicon_url;
        }

        getThings();

    }, [])

    if (pageLoading) {
        return <Loading />
    }

    return (
        <>
            <Box width='100%' sx={{ boxShadow: 3, }}>
                <AppBar position="fixed" sx={{ bgcolor: "black", p: 1, }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    src={siteSettings.url + siteSettings.logo_url}
                                >
                                </CardMedia>
                            </Typography>

                            <Box sx={{ flexGrow: 2, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={toggleMenu}
                                    color="inherit"
                                >
                                    {isMenu ? <CloseIcon /> : <MenuIcon />}
                                </IconButton>

                            </Box>
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                <CardMedia
                                    component="img"

                                    src={siteSettings.url + siteSettings.logo_url} sx={{ width: "150px" }}>
                                </CardMedia>
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} justifyContent="flex-end">
                                {headerLinks.map(page => (
                                    <Grid item xs={12} key={page.link}>
                                        <Link underline="none" href={page.link} target="_blank" rel="noreferrer" sx={{ color: "#FBBD17", fontSize: 18, fontWeight: 'medium', cursor: "pointer", ml: 4 }}>{page.name}</Link>
                                    </Grid>

                                ))}
                            </Box>

                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} justifyContent="flex-end">
                                <Tooltip title="Your Wallet">
                                    <Button variant="contained" onClick={() => !web3g.connected && updateWallet({}, dispatch)} sx={{
                                        fontFamily: 'Monospace', fontWeight: 'bold', fontSize: 16, bgcolor: '#FBBD17', color: 'black', ':hover': {
                                            bgcolor: '#F0931F',
                                            color: 'black',
                                        }
                                    }} endIcon={<AccountBalanceWalletIcon />}>
                                        {pending ? 'Connecting' : web3g.connected ? addressShort : "Connect"}
                                    </Button>
                                </Tooltip>

                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

            </Box>
            {
                isMenu && (<Box position='fixed' width='100%' height='100vh' top='0px' right='0px' display='flex' justifyContent='center'
                    alignItems='center'
                    sx={{ bgcolor: colors.boldSecondColor, zIndex: '800' }}>

                    <Box align="center">
                        <Box>
                            <Grid container>

                                {headerLinks.map(page => (
                                    <Grid item xs={12} sx={{ mt: 5 }} key={page.name}>
                                        <Link underline="none" href={page.link} align="center" sx={{ color: "black", fontSize: 30, fontWeight: 'bold', pt: 5, cursor: "pointer", }}>{page.name}</Link>
                                    </Grid>

                                ))}
                                <Grid item xs={12}>
                                    <Button variant="contained" onClick={() => !web3g.connected && updateWallet({}, dispatch)} sx={{
                                        fontFamily: 'Monospace', fontWeight: 'bold', fontSize: 30, bgcolor: 'black', mt: 5, color: '#FBBD17', ':hover': {
                                            bgcolor: 'black',
                                            color: '#F0931F',
                                        }
                                    }} endIcon={<AccountBalanceWalletIcon />}>
                                        {pending ? 'Connecting' : web3g.connected ? addressShort : "Connect"}
                                    </Button>
                                </Grid>
                            </Grid>

                        </Box>
                    </Box>


                </Box>)
            }
        </>


    );
};
export default ResponsiveAppBar;
