import { useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Google } from '@mui/icons-material';
import { useSecao } from 'hooks/useSecao';

const Header = () => {

  const { user,signInWithGoogle,signOutGoogle } = useAuth(); 
  const { secao, setSecao } = useSecao();

  const pages = [
    {title:'Livros',path:'livros'},
    {title:'Textos',path:'textos'},
  ];
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (path) => {
    setSecao(path);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{backgroundColor: "rgba(0,0,0,0.6)"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>          
          <Typography
            variant="h6"
            noWrap            
            onClick={()=>setSecao(null)}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',              
              cursor: 'pointer'
            }}
          >
            Lévinas
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"              
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={()=>handleCloseNavMenu()}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((i,index) => (
                <MenuItem key={index} onClick={()=>handleCloseNavMenu(i.path)}>
                  <Typography textAlign="center">{i.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>          
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={()=>setSecao(null)}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Lévinas
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((i,index) => (
              <Button
                key={index}
                onClick={()=>handleCloseNavMenu(i.path)}
                sx={{ my: 2, color: 'white', display: 'block', backgroundColor: secao==i.path ? 'rgba(255,0,0,0.4)' : 'rgba(0,0,0,0)' }}
              >
                {i.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? <Tooltip title="Opções">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user.name} src={user.photo} />                
              </IconButton></Tooltip> : <Tooltip title="Entrar">
                <IconButton onClick={()=>signInWithGoogle()}><Google sx={{color: "#fff"}} /></IconButton>
                </Tooltip>}
            
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center"><Button onClick={signOutGoogle}>Sair</Button></Typography>
                </MenuItem>
              
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;