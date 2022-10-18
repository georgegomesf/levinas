import { Box } from '@mui/material';
import Header from 'components/Header';
import Textos from '@components/Textos';
import Livros from 'components/Livros';
import Home from '@components/Home';
import { useSecao } from 'hooks/useSecao';

const Inicio = () => {

    const { secao, setSecao } = useSecao();

    return <><Header /><Box sx={{backgroundColor: secao ? '#fff' : '#000'}}>
        
        {
            !secao ? <Home /> :
            secao=="livros" ? <Livros /> :
            secao=="textos" && <Textos />
            }
    </Box></>

}

export default Inicio;