import { useState, useEffect } from 'react';
import { useAuth } from "hooks/useAuth";
import { useLivros } from 'hooks/useLivros';
import axios from 'axios';
import { Box, Container, ToggleButton, ToggleButtonGroup, Pagination, Stack, InputLabel, MenuItem, FormControl, Select, CircularProgress, Backdrop } from '@mui/material';
import Lista from './Lista';

const Livros = () => {

    const { user } = useAuth();
    const { status, capa, load, setLoad } = useLivros();
    const [livros, setLivros] = useState();
    const [livrosCount, setLivrosCount] = useState();        
    const [lang, setLang] = useState();
    const [autoria, setAutoria] = useState();
    const [page, setPage] = useState(1);
    const [filosofos,setFilosofos] = useState();
    const [filosofo,setFilosofo] = useState();

    useEffect(()=>{

        setLoad(true)
        const getLivros = async () => {
            const { data } = await axios.post('/api/livros', { action: 'getLivros', page: page, lang: lang, filo: autoria, token: user && user.token }).catch(e=>console.log(e))
            setLivros(data.dados)
            setLivrosCount(data.count)
            setLoad(false)
        }

        getLivros() 

    },[lang,page,filosofo,status,capa,autoria])

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
            {/*Filósofo: 
            <FormControl sx={{minWidth: '15rem',padding: '1rem'}}>
                <InputLabel id="demo-simple-select-label"></InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filosofo}
                    label="Age"
                    onChange={selFilosofo}
                    sx={{backgroundColor: "#fff"}}
                >
                    <MenuItem value={null}>Todos</MenuItem>
                    {filosofos && filosofos.map((i,index) => <MenuItem key={index} value={i.id}>{i.ultimo_nome} ({i.livros_filosofo_aggregate.aggregate.count})</MenuItem>) }
                </Select>
            </FormControl>*/} 
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
            Idioma:
            <ToggleButtonGroup
                color="primary"
                value={lang}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                sx={{backgroundColor: "#fff", margin: '1rem'}}
                >
                <ToggleButton value="pt">POR</ToggleButton>
                <ToggleButton value="fr">FRA</ToggleButton>
                <ToggleButton value="en">ING</ToggleButton>
                <ToggleButton value="es">ESP</ToggleButton>
                {/*<ToggleButton value="de">ALE</ToggleButton>*/}
            </ToggleButtonGroup>
        </Box>

        <Box sx={{minHeight: '43rem'}}>{<Lista livros={livros} user={user} />}</Box>
        
        <Stack spacing={2} sx={{backgroundColor: "#fff", color: "#fff", borderRadius: "0.4rem", padding: "0.5rem"}}>            
            <Pagination count={Math.round(livrosCount/9)} color="primary"  page={page} onChange={paginacao} />            
        </Stack>
        
    </Container>

}

export default Livros;