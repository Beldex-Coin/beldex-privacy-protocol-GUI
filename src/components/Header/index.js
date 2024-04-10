import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { AppBar, Avatar, Box, Toolbar, Tooltip, MenuItem, Container, IconButton, Button, Typography, Menu, Link, Popover } from '@mui/material';
import { withStyles } from '@mui/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import MenuIcon from '@mui/icons-material/Menu';
import binance from '../../icons/binance.png';
import metamask from '../../icons/metamask.png';
import logo from '../../icons/privacy-protocol-logo.svg';
import address from '../../icons/address.svg';
import close from '../../icons/Close.svg';
import arrow from '../../icons/arrow.svg';
import MaticLogo from '../../icons/polygon-matic-icon.png';
import * as actionTypes from "../../common/actionTypes";
import {
 
  CustomizedSnackbars,
} from "../../components";

const componentStyle = theme => {
  return ({
    tabBtn: {
      borderRadius: '10px',
      display: 'flex',
      fontWeight: 600,
      height: '45px',
      padding: '5px 10px',
      background: 'rgb(41, 41, 57)',
      border: 'solid 1px #3b3b3b',
      '&:hover': {
        border: 'solid 1px #3b3b3b'
      }
    },
    menuSelected: {
      '&.Mui-selected': {
        background: '#4a4a4a50'
      }
    },
    link: {
      marginRight: '40px', fontSize: '16px', fontFamily: 'poppins', fontWeight: 600
    },
    popoverPaper: {
      borderRadius: '10px',
      width: '350px'
    }
  })
};

const settings = [
  //{ id: 0, text: 'BSC', img: binance },
  { id: 0, text: 'Meta Mask', img: metamask }
];

const coinList = [
  { id: 0, text: 'Polygon Matic', img: MaticLogo }
];

const HeaderCom = (props) => {
  const walletName = useSelector((state) => state.walletReducer.walletName);
  const walletIndex = settings.findIndex(list => list.text === walletName);
  const [anchorElWallet, setAnchorElWallet] = React.useState(null);
  const [anchorElCoinList, setAnchorElCoinList] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(walletIndex);
  const { showNav, classes, walletAddress, handleDrawerToggle, handleWalletMenuClose, handleCloseMenu, walletBal, publicHash } = props;
  const [sWalletAddress, setWalletAddress] = React.useState(walletAddress);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => { setWalletAddress(walletAddress) }, [walletAddress])
  const handleOpenWalletMenu = (event) => {
    setAnchorElWallet(event.currentTarget);
    handleWalletMenuClose(walletName);
  };

  const handleCloseWalletMenu = (event, setting) => {
    if (setting.text) {
      handleWalletMenuClose(setting.text);
      setSelectedIndex(setting.id);
    }
    setAnchorElWallet(null);
  };

  const handleCloseCoinListMenu = (event, setting) => {
    setAnchorElCoinList(null);
  };

  const addressTruncate = React.useMemo(() => addressTruncateFn(sWalletAddress), [sWalletAddress]);

  const disconnect = () => {
    dispatch({
      type: actionTypes.SETWALLETADDR,
      payload: {
        walletAddress: '',
        walletName: ''
      }
    });
    dispatch({
      type: actionTypes.LOGINKEY,
      payload: ''
    });
    if (location.pathname === '/dashboard') navigate('/')
  }


  const snackbarHandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const copyContent = async (e) => {
    await navigator.clipboard.writeText(publicHash);
    setSnackbar({
      open: true,
      severity: "success",
      message: "Copied to clipboard.",
    });
  }

  return (
    <AppBar sx={{ padding: { xs: '10px', sm: '10px 90px' } }} position="fixed">
      <Container maxWidth="false" disableGutters>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <img onClick={()=>navigate(0)} alt="" height="74px" width="auto" src={logo} />

          <Box sx={{ flexGrow: 0, display: 'flex', gap: '10px' }}>
            {location.pathname === '/dashboard' &&
              <Button variant="outlined" classes={{ root: classes.tabBtn }} color="secondary" onClick={handleClick}>
                <img alt="" width="20" src={address} />  <Typography sx={{ padding: '0 8px', fontWeight: 700, color: '#3EC744' }} component="span">Your Address</Typography>
                <img alt="" width="20" src={arrow} />
              </Button>}
            <Button variant="outlined" disabled classes={{ root: classes.tabBtn }}
              color="secondary" sx={{ width: '50px', '&.Mui-disabled': { background: 'rgb(41, 41, 57)' }, justifyContent: 'center' }}>
              <img alt="" width="20" src={MaticLogo} />
              {/* <ExpandMoreRoundedIcon/> */}
            </Button>
            <Tooltip title="Open settings">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenWalletMenu}
                classes={{ root: classes.tabBtn }}
                sx={{ border: sWalletAddress ? 'solid 1px rgb(80,175,75)' : 'solid 1px #3b3b3b9a', width: sWalletAddress ? '175px' : '140px', justifyContent: 'space-around' }}
              >
                {sWalletAddress && selectedIndex >= 0 && <Avatar sx={{ width: 24, height: 24 }} src={settings[selectedIndex].img} />}
                <Typography sx={{
                  fontWeight: 600,
                  overflow: 'hidden', whiteSpace: 'nowrap', color: sWalletAddress ? '#fff' : 'rgb(80,175,75)'
                }} textAlign="center">{sWalletAddress ? addressTruncate : 'Connect'}</Typography>
              </Button>

            </Tooltip>
            {sWalletAddress && selectedIndex >= 0 && <Popover
              id="menu-appbar"
              open={Boolean(anchorElWallet)}
              anchorEl={anchorElWallet}
              onClose={handleCloseWalletMenu}
              classes={{ paper: classes.popoverPaper }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}

            >
              <Box sx={{ padding: '20px', background: 'rgb(41,41,57)', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Avatar sx={{ width: 24, height: 24 }} src={settings[selectedIndex].img} />
                    <Typography sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      overflow: 'hidden', whiteSpace: 'nowrap', color: '#fff'
                    }} textAlign="center">{addressTruncate}</Typography>
                  </Box>
                  <Button variant="outlined" sx={{
                    color: 'rgb(152, 152, 177)', border: 'solid 1px rgb(58,58,80)', background: 'rgb(41,41,57)', borderRadius: '10px', '&:hover': {
                      border: 'solid 1px #fff', background: 'rgb(41,41,57)', color: '#fff'
                    }
                  }} onClick={disconnect}>Disconnect</Button>
                </Box>
                <Box>
                  <Typography color="primary" sx={{ fontWeight: 600, fontSize: '15px' }}>Balance</Typography>
                  <Typography component="div" color="text.light" sx={{ fontWeight: 900, fontSize: '28px', lineHeight: '1', paddingTop: '5px' }}>{`${walletBal} MATIC`}</Typography>
                </Box>
              </Box>

            </Popover>}
            {!Boolean(anchorElCoinList) && <Menu
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
            </Menu>}
            {Boolean(anchorElCoinList) && <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElCoinList}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElCoinList)}
              onClose={handleCloseCoinListMenu}
            >
              {coinList.map((setting, index) => (
                <MenuItem key={setting.text}
                  classes={{ root: classes.menuSelected }}
                  selected={index === selectedIndex}
                  onClick={(event) => handleCloseCoinListMenu(event, setting)}>
                  <Avatar sx={{ width: 24, height: 24 }} src={setting.img} />
                  <Typography sx={{ pl: '20px' }} color="text.light" textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
            </Menu>}
            <Popover
              id={id}
              open={open}
              sx={{ marginTop: 2, 
                '.MuiPopover-paper': { background: 'transparent', boxShadow: 'none', borderRadius: '0', position: 'absolute'} 
              }}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{background: 'transparent', width: '440px', padding: '15px'}}>
                <Box 
                sx={{display: 'flex', width: '30px', height: '30px', borderRadius: '15px', background: 'rgb(41, 41, 57)', border: 'solid 1px #5a5a5a', marginLeft: 'auto', justifyContent: 'center', flex: '1 1 0', position: 'absolute', right: '0px',  top: '0px', zIndex: '1301','&:hover': {
                  borderColor:'white',
                  cursor: 'pointer', // Show pointer cursor on hover
                },}} onClick={handleClose}
                >
                  <img alt="" width="15px" src={close} />
                </Box>
                <Box sx={{ 
                  // marginLeft: 'auto',
                  borderRadius: '20px', position: 'relative', bottom: '0', left: '15px', border: 'solid 1px #5a5a5a',
                  width: '400px', height: 'auto', background: 'rgb(41, 41, 57)', padding: '15px 20px' }}>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
                    <Typography color="text.light" id="publicHash" sx={{ p: 0, wordBreak: 'break-all', fontWeight: 600 }}>Copy your Public Hash</Typography>
                    <Button sx={{ height: '35px', fontSize: '14px' }} onClick={copyContent} variant="contained" endIcon={<ContentCopyIcon />}>
                      Copy
                    </Button>
                  </Box>

                  <Typography id="publicHash" sx={{ p: 0, wordBreak: 'break-all' }}>{publicHash}</Typography>
                  {/* <IconButton sx={{ width: '40px', height: '40px', margin: '40px 10px 0 0' }} onClick={copyContent}>
                  <ContentCopyIcon />
                </IconButton> */}
                </Box>
              </Box>
            </Popover>
          </Box>
        </Toolbar>
        <CustomizedSnackbars
        open={snackbar.open}
        handleClose={snackbarHandleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
      </Container>
    </AppBar>
  );
};


const addressTruncateFn = (str) => {
  if (str && str.length > 30) {
    return str.substr(0, 7) + '...' + str.substr(str.length - 5, str.length);
  }
  return str;
}
const Header = React.memo(withStyles(componentStyle, { withTheme: true })(HeaderCom));

export default Header;