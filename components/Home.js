import { useState, useEffect } from 'react';
import { useAuth } from "hooks/useAuth";
import { Card, CardContent, CardActionArea, Box, Container, ToggleButton, ToggleButtonGroup, Pagination, Stack, InputLabel, MenuItem, FormControl, Select, CircularProgress, Backdrop, Typography, bull, Button } from '@mui/material';
import { useSecao } from 'hooks/useSecao';

const Home = () => {

    const { setSecao } = useSecao();

    return <Container sx={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'flex-start', padding: '2em',backgroundImage: "url('/img/levinas.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center right'}}>        

        <Box sx={{minHeight: '43rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignContent: 'flex-start'}}>
            <Card sx={{ maxWidth: 275, margin: '1rem', color: '#fff', backgroundColor: 'rgba(0,0,0,0)', border: '#fff solid 1px' }}>
                <CardActionArea onClick={()=>setSecao('livros')}>
                <CardContent>
                    <Typography sx={{ fontSize: 24 }} gutterBottom>
                    Livros
                    </Typography>
                    <Typography variant="body2">
                    Obras publicadas por Lévinas e sobre ele, encontrados em serviços como Google Books.
                    </Typography>
                </CardContent>                
                </CardActionArea>
            </Card>
            <Card sx={{ maxWidth: 275, margin: '1rem', color: '#fff', backgroundColor: 'rgba(0,0,0,0)', border: '#fff solid 1px' }}>
                <CardActionArea onClick={()=>setSecao('textos')}>
                <CardContent>
                    <Typography sx={{ fontSize: 24 }} gutterBottom>
                    Textos
                    </Typography>
                    <Typography variant="body2">
                    Textos publicados por Lévinas e sobre ele, coletados de serviços como Jstor.org.
                    </Typography>
                </CardContent>
                </CardActionArea>    
            </Card>
        </Box>
        
    </Container>

}

export default Home;