import { Box } from '@mui/material';
import Header from 'components/Header';
import Textos from '@components/Textos';
import Livros from 'components/Livros';
import { useSecao } from 'hooks/useSecao';

const Home = () => {

    const { secao, setSecao } = useSecao();

    return <Box sx={{backgroundColor: "#fff"}}>
        <Header />
        {
            (!secao | secao=="livros") ? <Livros /> :
            secao=="textos" && <Textos />
            }
    </Box>

}

export default Home;