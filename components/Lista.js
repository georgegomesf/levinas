import { useState, useEffect } from "react";
import axios from "axios";
import { storage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from '../services/firebase';
import { Box, Card, CardMedia, Typography, CardActionArea, Modal, Switch, IconButton, Input, Button, Avatar, LinearProgress, TextField, Backdrop, CircularProgress } from "@mui/material";
import { useLivros } from 'hooks/useLivros';
import { Edit, MenuBook } from "@mui/icons-material";
import Link from "next/link";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 300,
    bgcolor: 'rgba(0,0,0,0.9)',
    border: '2px solid #444',
    boxShadow: 24,
    p: 4,
    margin: '2rem',
    '@media (max-width: 600px)' : {
        position: 'absolute',
        top: '40%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
        minWidth: 100,
        bgcolor: 'rgba(0,0,0,0.9)',
        border: '0 solid #444',
        boxShadow: 24,
        p: 4,
        margin: '4rem 2rem',
        overflow:'scroll',
        display:'block',
        height:'100%'
    }
  };

const googleLivros = "https://www.google.com.br/books/edition/_/";
const jstor = "https://jstor.org/stable/";

const Lista = (props) => {

    const { livros, textos, user } = props;
    const { status, setStatus, capa, setCapa } = useLivros();
    const handleOpen = (id) => setOpen(id);
    const handleClose = () => setOpen();
    const [open, setOpen] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const [progress,setProgress] = useState(0);
    const onImageChange = (e) => {        
        setFile([e.target.files[0],e.target.name]);
    }
    const [file,setFile] = useState();
    const [thumbs,setThumbs] = useState();
    const [load,setLoad] = useState(true);

    useEffect(()=>{
                
        const getThumbs = async () => {          
          const { data } = await axios.post('/api/capas', { action: 'getImages', id: livros.map(i=>i.id), tipo: 'capas' }).catch(e=>console.log(e))          
          setThumbs(data)          
          setLoad(false)
        } 
        
        livros && getThumbs()
    
    },[livros])

    useEffect(()=>{
                
        const getThumbs = async () => {          
          const { data } = await axios.post('/api/capas', { action: 'getImages', id: textos.map(i=>i.filosofo.map(i=>i.filosofo_id)), tipo: 'autor' }).catch(e=>console.log(e))
          setThumbs(data)          
          setLoad(false)
        } 
        
        textos && getThumbs()
    
    },[textos])

    useEffect(()=>{
        if(!file) return;
        setProgress(1)
        const storageRef = ref(storage, `/capas/${file[1]}.jpeg`);
        const uploadTask = uploadBytesResumable(storageRef,file[0]);
        uploadTask.on("state_changed",(snapshot)=>{
            //setLoading(true)
            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setProgress(prog)
        },(e) => {
            console.log(e)
            //setLoading(false)
            }, ()=>{        
            getDownloadURL(uploadTask.snapshot.ref).then( async (url) => {
                   // await axios.post('/api/cadastro', { action: 'updateFoto', id: user?.id, uid: user?.uid, token: user?.token, foto: url  }).then(e=>{
                   //     handleSnack('Foto atualizada com sucesso!','green')
                   //     setLoading(false)
                   // }).catch(e=>console.log(e))
                   setCapa(url)
                   // setLoading(false)
                }    
            )} )
    },[file])

    const defStatus = async (changedStatus,tipo,id) => {        
        setStatus([changedStatus,id])
        await tipo=='livro' ?
            axios.post('/api/livros', { action: 'defStatus', id: id, event: changedStatus, token: user && user.token }).catch(e=>console.log(e)) :
            axios.post('/api/textos', { action: 'defStatus', id: id, event: changedStatus, token: user && user.token }).catch(e=>console.log(e))
    };    

    return <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'flex-start', padding: '2em', }}>
        <Backdrop
            sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={load}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
    {(livros) && livros.map((i,index) => <Box key={index} sx={{display: 'flex', flexDirection: 'row'}}>
        <Card key={index} sx={{ maxHeight: 160, maxWidth: 120, color: '#000', backgroundColor: 'rgba(255,255,255,0.2)', margin: '1em', alignItems: 'center' }}>
            <CardActionArea onClick={()=>handleOpen(i.id)}><CardMedia
            component="img"
            image={thumbs?.filter(f=>f.id==i.id)[0] ? thumbs.filter(f=>f.id==i.id).map(i=>`https://firebasestorage.googleapis.com/v0/b/filodoc-af03f.appspot.com/o/capas%2F${i.id}.jpeg?alt=media&token=${i.token}`) : `https://books.google.com/books/content?id=${i.id_google}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`}
            alt={i.id}
            sx={{objectFit: "contain"}} 
            /></CardActionArea>
        </Card>
        <Typography sx={{width: '12rem', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'flex-start', padding: '2rem 0 2rem 0' }}>
            <Typography sx={{fontSize: '1rem',color: "#000"}}>{i.titulo.length<68 ? i.titulo : i.titulo.slice(0,65) + '...'}</Typography>
            <Typography sx={{color: "#333", fontSize: '0.9rem'}}>{i.autor.length<28 ? i.autor : i.autor.slice(0,25) + '...'}</Typography>
            <em><Typography sx={{fontSize: '0.8rem', color: "#555"}}>{i.editora && (i.editora?.length<30 ? i.editora + ', ' : i.editora.slice(0,27) + '..., ')}{i.data_publicacao && `${i.data_publicacao.substring(0,4)}` }</Typography></em>
            {user?.isAdmin && <Switch
            checked={i.published_at ? true : false }
            onClick={()=>defStatus(i.published_at ? false : true,'livro',i.id)}
            inputProps={{ 'aria-label': 'controlled' }}
            />}
        </Typography>
    </Box>)}
    { textos && textos.map((i,index) => <Box key={index} sx={{display: 'flex', flexDirection: 'row'}}>
        <Card key={index} sx={{ height: 160, width: 120, color: '#000', backgroundColor: 'rgba(255,255,255,0.2)', margin: '1em', alignItems: 'center' }}>
            <CardActionArea onClick={()=>handleOpen(i.id)}><CardMedia
            component="img"
            image={thumbs?.filter(f=>f.id==i.filosofo.map(i=>i.filosofo_id))[0] ? thumbs.filter(f=>f.id==i.filosofo.map(i=>i.filosofo_id)).map(i=>`https://firebasestorage.googleapis.com/v0/b/filodoc-af03f.appspot.com/o/autor%2F${i.id}.jpeg?alt=media&token=${i.token}`) : `https://books.google.com/books/content?id=${i.id_google}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`}
            alt={i.id}
            sx={{objectFit: "contain"}} 
            /></CardActionArea>
        </Card>
        <Typography sx={{width: '12rem', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'flex-start', padding: '2rem 0 2rem 0' }}>
            <Typography sx={{fontSize: '1rem',color: "#000"}}>{i.titulo.length<68 ? i.titulo : i.titulo.slice(0,65) + '...'}</Typography>
            <Typography sx={{color: "#333", fontSize: '0.9rem'}}>{i.autor.length<28 ? i.autor : i.autor.slice(0,25) + '...'}</Typography>
            <em><Typography sx={{fontSize: '0.8rem', color: "#555"}}>{i.editora && (i.editora?.length<30 ? i.editora + ', ' : i.editora.slice(0,27) + '..., ')}{i.ano && `${i.ano}` }</Typography></em>
            {user?.isAdmin && <Switch
            checked={i.published_at ? true : false }
            onClick={()=>defStatus(i.published_at ? false : true,'texto',i.id)}
            inputProps={{ 'aria-label': 'controlled' }}
            />}
        </Typography>        
    </Box>)}
    <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{backgroundColor: "rgba(255,255,255,0.6)"}}
            >
            <Box sx={style}>
            { livros && livros.filter(f=>f.id==open).map((i,index) => <Box key={index} sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
                    <Box>
                    <Card key={index} sx={{ minWidth: 200, maxWidth: 200, height: 300, color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', margin: '1em'}}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={thumbs?.filter(f=>f.id==i.id)[0] ? thumbs.filter(f=>f.id==i.id).map(i=>`https://firebasestorage.googleapis.com/v0/b/filodoc-af03f.appspot.com/o/capas%2F${i.id}.jpeg?alt=media&token=${i.token}`) : `https://books.google.com/books/content?id=${i.id_google}&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api`}
                            alt={i.id}
                            sx={{objectFit: "contain"}} 
                            />
                    </Card>
                    {![0,100].includes(progress) ? <LinearProgress variant="determinate" value={progress} sx={{width: '100%', marginTop: 2}}/> : <label htmlFor="contained-button-file">
                        {user?.isAdmin && <><Input type="file" id="contained-button-file" name={i.id} accept="image/*" onChange={onImageChange} sx={{display:'none'}} />
                        <Button variant="contained" component="span">  
                        <Edit />
                        </Button></>}
                    </label>}
                    </Box>
                    <Typography sx={{minWidth: '10rem', maxWidth: '20rem', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'flex-start', padding: '0.6rem 0 0 0' }}>
                        <Typography sx={{fontSize: '1.6rem', color: "#fff", paddingRight: '0.7rem'}}>{i.titulo}</Typography>                       
                        <Typography sx={{fontSize: '1.2rem',color: "#aaa"}}>{i.subtitulo.length<73 ? i.subtitulo : i.subtitulo.slice(0,70) + '...'}</Typography>
                        <em><Typography sx={{fontSize: '1.2rem',color: "#aaa"}}>{i.autor.length<33 ? i.autor : i.autor.slice(0,30) + '...'}</Typography>
                        <Typography sx={{fontSize: '1rem', color: "#aaa", paddingTop: '0.5rem'}}>{i.editora && `${i.editora}, `}{i.data_publicacao && `${i.data_publicacao.substring(0,4)}` }</Typography></em>
                        <Typography sx={{fontSize: '1rem', color: "#aaa", paddingTop: '0.5rem'}}>{i.descricao.length<233 ? i.descricao : i.descricao.slice(0,230) + '...'}</Typography>
                        <Typography sx={{fontSize: '0.8rem', color: "#aaa", paddingTop: '0.5rem'}}>{i.paginas && `Páginas: ${i.paginas}` }</Typography>                        
                        <Link href={googleLivros + i.id_google} passHref><a target="_blank"><IconButton sx={{backgroundColor: "#fff", margin: "1rem 1rem 0rem 0", "&:hover": { backgroundColor: "#aaa" }}}><MenuBook /></IconButton></a></Link>
                    </Typography>                                        
                </Box>
                
                )}                
                { textos && textos.filter(f=>f.id==open).map((i,index) => <Box key={index} sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
                    <Card key={index} sx={{ minWidth: 200, maxWidth: 200, height: 300, color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', margin: '1em'}}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={thumbs?.filter(f=>f.id==i.filosofo.map(i=>i.filosofo_id))[0] ? thumbs.filter(f=>f.id==i.filosofo.map(i=>i.filosofo_id)).map(i=>`https://firebasestorage.googleapis.com/v0/b/filodoc-af03f.appspot.com/o/autor%2F${i.id}.jpeg?alt=media&token=${i.token}`) : `https://books.google.com/books/content?id=${i.id_google}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`}
                            alt={i.id}
                            sx={{objectFit: "contain"}} 
                            />
                    </Card>
                    <Typography sx={{minWidth: '10rem', maxWidth: '20rem', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'flex-start', padding: '0.6rem 0 0 0' }}>
                        <Typography sx={{fontSize: '1.6rem', color: "#fff"}}>{i.titulo.length<53 ? i.titulo : i.titulo.slice(0,50) + '...'}</Typography>
                        {/*<Typography sx={{fontSize: '1.2rem',color: "#aaa"}}>{i.subtitulo.length<73 ? i.subtitulo : i.subtitulo.slice(0,70) + '...'}</Typography>*/}
                        <Typography sx={{fontSize: '1.2rem',color: "#aaa"}}>{i.autor.length<33 ? i.autor : i.autor.slice(0,30) + '...'}</Typography>
                        <em><Typography sx={{fontSize: '1rem', color: "#aaa", paddingTop: '0.5rem'}}>{i.parte_de && `${i.parte_de}, `}{i.editora && `${i.editora}, `}{i.paginacao && `${i.paginacao}, `}{i.ano}</Typography></em>
                        {/*<Typography sx={{fontSize: '1rem', color: "#aaa", paddingTop: '0.5rem'}}>{i.descricao.length<233 ? i.descricao : i.descricao.slice(0,230) + '...'}</Typography>*/}                        
                    </Typography>
                    <Link href={jstor + i.jstor_id} passHref><a target="_blank"><IconButton sx={{backgroundColor: "#fff", margin: "1rem 1rem 0rem 0", "&:hover": { backgroundColor: "#aaa" }}}><MenuBook /></IconButton></a></Link>
                </Box>)}
            </Box>
        </Modal>
</Box>
}
export default Lista;