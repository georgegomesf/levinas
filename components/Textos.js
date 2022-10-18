import { useState, useEffect } from 'react';
import { useAuth } from "hooks/useAuth";
import { useTextos } from 'hooks/useTextos';
import axios from 'axios';
import { Box, Container, ToggleButton, ToggleButtonGroup, Pagination, Stack, InputLabel, MenuItem, FormControl, Select, CircularProgress, Backdrop } from '@mui/material';
import Lista from './Lista';

const Textos = () => {

    const { user } = useAuth();
    const { status,load,setLoad } = useTextos();
    const [textos, setTextos] = useState();
    const [textosCount, setTextosCount] = useState();        
    const [lang, setLang] = useState();
    const [autoria, setAutoria] = useState();
    const [page, setPage] = useState(1);
    const [filosofos,setFilosofos] = useState();
    const [filosofo,setFilosofo] = useState();    

    useEffect(()=>{

        setLoad(true)
        const getTextos = async () => {
            const { data } = await axios.post('/api/textos', { action: 'getTextos', page: page, lang: lang, filo: autoria, token: user && user.token }).catch(e=>console.log(e))
            setTextos(data.dados)
            setTextosCount(data.count)
            setLoad(false)
        }

        getTextos() 

    },[lang,page,filosofo,status,autoria])

    useEffect(()=>{

        const getFilosofos = async () => {
            const { data } = await axios.post('/api/filosofos', { action: 'getFilosofos' }).catch(e=>console.log(e))
            setFilosofos(data)
        }

        getFilosofos() 

    },[]) 

    const handleChange = (event, newAlignment) => {
        setLang(newAlignment);
        setPage(1)
    };

    const handleAutoria = (event, newAlignment) => {
        setAutoria(newAlignment);
        setPage(1)
    };

    const paginacao = (event, value) => {
        setPage(value);
      };

    const selFilosofo = (event) => {
        setFilosofo(event.target.value);
        setPage(1)
        setLang(null)
    };

    return <Container sx={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'flex-start', padding: '2em'}}>
        <Backdrop
            sx={{ color: '#000', backgroundColor: 'rgba(0,0,0,0.2)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={load}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
        <Box>
        Autoria:
            <ToggleButtonGroup
                color="primary"
                value={autoria}
                exclusive
                onChange={handleAutoria}
                aria-label="Platform"
                sx={{backgroundColor: "#fff", margin: '1rem'}}
                >
                <ToggleButton value={1}>Lévinas</ToggleButton>
                <ToggleButton value={0}>Outros</ToggleButton>
            </ToggleButtonGroup>
        </Box>
        
        <Box sx={{minHeight: '43rem'}}>{<Lista textos={textos} user={user} />}</Box>
        
        <Stack spacing={2} sx={{backgroundColor: "#fff", color: "#fff", borderRadius: "0.4rem", padding: "0.5rem"}}>            
            <Pagination count={Math.round(textosCount/9)} color="primary"  page={page} onChange={paginacao} />            
        </Stack>
        
    </Container>

}

export default Textos;