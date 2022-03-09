import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { AppBar, Avatar, Box, Toolbar, Tooltip, MenuItem, Container, IconButton, Button, Typography, Menu, Link } from '@mui/material';
import { withStyles } from '@mui/styles';
import MenuIcon from '@mui/icons-material/Menu';
import binance from '../../icons/binance.png';
import metamask from '../../icons/metamask.png';
import logo from '../../icons/logo.svg';

const componentStyle = theme => {
  return ({
    tabBtn: {
      borderRadius: '20px',
      border: 'solid 1px #125fef',
      fontWeight: 400,
      width: '160px',
      padding: '5px 10px',
      '&:hover': {
        background: 'transparent',
        border: 'solid 1px #125fef'
      }
    },
    menuSelected: {
      '&.Mui-selected': {
        background: '#4a4a4a'
      }
    },
    link: {
      marginRight: '40px', fontSize: '16px', fontFamily: 'poppins', fontWeight: 600
    }
  })
};

const settings = [{ id: 0, text: 'BSC', img: binance }, { id: 1, text: 'Meta Mask', img: metamask }];

const HeaderCom = (props) => {
  const walletName = useSelector((state) => state.walletReducer.walletName);
  const walletIndex = settings.findIndex(list => list.text === walletName);
  const [anchorElWallet, setAnchorElWallet] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(walletIndex);
  const { openUserAuthModal, showNav, classes, walletAddress, handleDrawerToggle, handleMenuClose } = props;
  
  let navigate = useNavigate();

  const handleOpenWalletMenu = (event) => {
    handleMenuClose('Meta Mask');

    // setAnchorElWallet(event.currentTarget);
  };

  const handleCloseWalletMenu = (event, setting) => {
    if(setting.text) {
      handleMenuClose(setting.text);
      setSelectedIndex(setting.id);
    }
    setAnchorElWallet(null);
  };

  const connectWallet = () => {
    // navigate('/dashboard')
    openUserAuthModal();
  }

  const addressTruncate = React.useMemo(() => addressTruncateFn(walletAddress), [walletAddress]);

  return (
    <AppBar sx={{ padding: { xs: '15px', sm: '15px 90px' } }} position="fixed">
      <Container maxWidth="false" disableGutters>
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon fontSize="large" sx={{ color: '#fff' }} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            color="text.secondary"
            
            sx={{ flexGrow: { xs: 1, md: showNav ? 0 : 1 }, mr: 2, display: { xs: 'flex' } }}
          >
            <img onClick={()=>navigate('/')} alt="" height="35px" width="auto" src={logo} />
          </Typography>
        { showNav && <Box sx={{ flexGrow: 1, mr: 2, display: { md: 'flex', xs: 'none' } }}>
            <Link color="text.light" onClick={connectWallet} component="button" underline="none" sx={{ ml: 2 }} classes={{root: classes.link}}>Swap</Link>
            <Link color="text.light" component="button" underline="none" classes={{root: classes.link}}>Bridge</Link>
            <Link color="text.light" component="button" underline="none" classes={{root: classes.link}}>Tutorial</Link>
            <Link color="text.light" component="button" underline="none" classes={{root: classes.link}}>Q&A</Link>
            <Link color="text.light" component="button" underline="none" classes={{root: classes.link}}>Info</Link>
          </Box>}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenWalletMenu}
                classes={{ root: classes.tabBtn }}
              // sx={{borderRadius: '20px', border: 'solid 1px #125fef', fontWeight: 400}}
              >
                <Typography sx={{
                  fontWeight: walletAddress ? '600' : '400',
                  overflow: 'hidden', whiteSpace: 'nowrap'
                }} color="text.light" textAlign="center"> {walletAddress ? addressTruncate : 'Connect Wallet'}</Typography>
              </Button>

            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElWallet}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElWallet)}
              onClose={handleCloseWalletMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem key={setting.text}
                  classes={{ root: classes.menuSelected }}
                  selected={index === selectedIndex}
                  onClick={(event) => handleCloseWalletMenu(event, setting)}>
                  <Avatar sx={{ width: 24, height: 24 }} src={setting.img} />
                  <Typography sx={{ pl: '20px' }} color="text.light" textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};


const addressTruncateFn = (str) => {
  if (str && str.length > 30) {
    return str.substr(0, 5) + '...' + str.substr(str.length - 5, str.length);
  }
  return str;
}
const Header = React.memo(withStyles(componentStyle, { withTheme: true })(HeaderCom));

export default Header;