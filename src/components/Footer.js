import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Paper from '@mui/material/Paper';
import Grid from '@mui/system/Unstable_Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faTelegram, faReddit, faGithub, faMedium, faInstagram, faTumblr, faFacebook } from '@fortawesome/free-brands-svg-icons'
import axios from 'axios'

import '../index.css'



const colors = {
    boldFirstColor: "#FBBD17",
    boldSecondColor: "#FBBD17",
    cardBackground: "black"
}


const icons = [
    {
        name: faTwitter,
        link: "https://twitter.com"
    },
    {
        name: faTelegram,
        link: "https://telegram.com"
    },
    {
        name: faMedium,
        link: "https://medium.com"
    },
    {
        name: faReddit,
        link: "https://reddit.com.com"
    },
    {
        name: faGithub,
        link: "https://github.com"
    },
]

function Footer() {

    const [headerLinks, setHeaderLinks] = useState([{
        "id": 0,
        "name": "",
        "link": "",
        "menu_place": ""
    }])

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

    const [socials, setSocials] = useState([{
        id: 0,
        name: "",
        link: ""
    }])

    useEffect(() => {
        const getThings = async () => {
            const settings = await axios.get('/api/settings');
            const links = await axios.get('/api/menu');
            const socialsQuery = await axios.get('/api/socials')
            setSiteSettings(settings.data[0]);
            setHeaderLinks(() => links.data.filter(e => e.menu_place == "footer"));
            setSocials(socialsQuery.data);
            console.log("fa" + socialsQuery.data[0].name.charAt(0).toUpperCase() + socialsQuery.data[0].name.slice(1))
        }

        getThings();

    }, [])
    return (
        <div className='footer-content'>
            <Box width='100%' bottom="0px" sx={{ boxShadow: 3, bgcolor: "black", mt: 10 }}>
                <Container>

                    <Grid container>
                        <Grid item xs={12} md={3} align="center">
                            <Typography sx={{ mt: 5 }}>
                                <Typography href="/" component="a">
                                    <CardMedia
                                        sx={{ width: '250px' }}
                                        component="img"
                                        src={siteSettings.url + siteSettings.logo_url}>
                                    </CardMedia>
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} align="center">
                            <Typography sx={{ color: "white", fontSize: 25, fontWeight: 'bold', mt: 5 }}>Get more information about $ModelPhics by Joining our Community using any of the below buttons!</Typography>

                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={12} align="center" sx={{ m: 2 }}>
                            {socials.map(icon => (
                                <Paper key={icon.link + icon.name} sx={{
                                    display: "inline-flex",
                                    fontSize: "25px",
                                    borderRadius: 3,
                                    p: 0.5,
                                    border: "2px solid #FBBD17",
                                    bgcolor: "black",
                                    color: colors.boldFirstColor,
                                    cursor: "pointer",
                                    ':hover': {
                                        bgcolor: '#FBBD17',
                                        color: 'black',
                                    },
                                    ml: 1,
                                }} onClick={() => window.open(icon.link, "_blank")}>
                                    <i className={"fab fa-" + icon.name}></i>

                                </Paper>
                            ))}


                        </Grid>
                    </Grid>



                </Container>

                <Grid container width="100%" sx={{ bgcolor: "#2a2a2b" }}>
                    <Container>
                        <Grid container>
                            <Grid item xs={12} md={5}>
                                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                                    <Paper sx={{
                                        height: "5px",
                                        width: "5px",
                                        borderRadius: "50%",
                                        mt: 2,
                                        border: "2px solid #FBBD17",
                                        bgcolor: '#FBBD17',
                                        color: colors.boldFirstColor,
                                    }} ></Paper>
                                    {headerLinks.map(menu => (
                                        <>
                                            <Typography sx={{ color: "white", fontSize: { xs: 10, md: 18 }, fontWeight: 'bold', m: 1, cursor: "pointer" }} onClick={() => window.open(menu.link, "_blank")}>{menu.name}</Typography>
                                            <Paper sx={{
                                                height: "5px",
                                                width: "5px",
                                                borderRadius: "50%",
                                                mt: 2,
                                                border: "2px solid #FBBD17",
                                                bgcolor: '#FBBD17',
                                                color: colors.boldFirstColor,
                                            }} > </Paper></>
                                    ))}




                                </Box>
                            </Grid>
                            <Grid item xs={12} md={7} align="center">
                                <Typography sx={{ color: "white", fontSize: { xs: 10, md: 18 }, fontWeight: 'medium', m: 1, ml: 2 }}>2022 ModelPhics. Design & Developed by ModelPhicsCreative</Typography>

                            </Grid>
                        </Grid>
                    </Container>

                </Grid>


            </Box >
        </div >

    )
}

export default Footer