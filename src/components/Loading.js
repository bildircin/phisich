import React from 'react'
import { Box, Typography, CardMedia } from '@mui/material';


function Loading() {
    return (
        <Box position='fixed' width='100%' height='100vh' top='0px' right='0px' display='flex' justifyContent='center'
            alignItems='center'
            sx={{ bgcolor: 'white', zIndex: '800' }}>

            <Box width='85%' align='center' height='75vh' sx={{ p: { xs: 3, md: 5 }, bgcolor: 'white' }}>

                <Typography sx={{ color: 'secondary.main', fontSize: 30, fontWeight: 'bold', pt: 5 }}>Loading</Typography>

                <CardMedia
                    align='center'
                    component="img"
                    src="./loading.gif" sx={{ width: '350px', mt: 5 }}>

                </CardMedia>
            </Box>
        </Box>
    )
}

export default Loading