import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { CssBaseline, Container, Box, Typography, SvgIcon, MenuItem, Menu } from '@mui/material';
import { CurrencyCard, Header, CustomizedSnackbars, AuthenticationDialog } from '../../components';
import ClientBeldexMAT from '../../client/client_beldexmat';
import config from '../../config';
import { UserContext } from '../../userContext';
import BeldexMAT from '../../contract-artifacts/BeldexMAT.json';
import * as actionTypes from "../../common/actionTypes";
import BgImage from '../../icons/background.jpg';
import BN from 'bn.js'
// const utils = {};
import crypto from 'crypto';
let web3Obj = {};
let contract = {};
let user = {};
const currencyList = [
  { currency: "BNB", subTitle: "Transfer BNB to wBNB" },
  { currency: "DAI", subTitle: "Transfer DAI to pDAI" },
  { currency: "USDT", subTitle: "Transfer USDT to wUSDT" },
  { currency: "BDX", subTitle: "Transfer BDX to wBDX" },
];

const headerLinks = [
  { id: 0, text: "Swap" },
  { id: 1, text: "Bridge" },
  { id: 2, text: "Tutorial" },
  { id: 3, text: "Q&A" },
  { id: 4, text: "Info" },

]
const Home = () => {
  const storeAddr = useSelector((state) => state.walletReducer);
  const userData = useContext(UserContext);
  const [walletAddress, setWalletAddress] = useState(storeAddr.walletAddress);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorElWallet, setAnchorElWallet] = React.useState(null);

  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setWalletAddress(storeAddr.walletAddress);
    web3Obj = new Web3(window.ethereum);
    if (storeAddr.walletName === "Meta Mask") {
      web3Obj = new Web3(window.ethereum);
    } else if (storeAddr.walletName === "BSC") {
      web3Obj = new Web3(window.BinanceChain);
    }
    contract = new web3Obj.eth.Contract(BeldexMAT.abi, config.deployed.BeldexMAT);
    user = new ClientBeldexMAT(web3Obj, contract, storeAddr.walletAddress);
    userData.setUserDetails(user);
  }, [storeAddr])

  const handleDrawerToggle = (event) => {
    setAnchorElWallet(event.currentTarget);
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClose = async (selectedWallet) => {
    if (selectedWallet === "BSC") {
      const account = await window.BinanceChain.request({ method: 'eth_requestAccounts' });
      if (account) connectToBinance(selectedWallet);
    } else if (selectedWallet === "Meta Mask") {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (account) connectToMetaMask(selectedWallet);
    }
  }

  const connectToBinance = async (selectedWallet) => {
    web3Obj = new Web3(window.BinanceChain);
    try {
      await window.BinanceChain.enable();
      if (web3Obj) {
        const accounts = await window.BinanceChain.request({ method: 'eth_accounts' });
        const address = accounts[0] || null;
        contract = new web3Obj.eth.Contract(BeldexMAT.abi, config.deployed.BeldexMAT);
        user = new ClientBeldexMAT(web3Obj, contract, address);
        userData.setUserDetails(user);
        setWalletAddressStore({
          walletAddress: address,
          walletName: selectedWallet,

        });
        window.BinanceChain.on('accountsChanged', async accounts => {
          const address = accounts[0] || null;
          user = new ClientBeldexMAT(web3Obj, contract, address);
          userData.setUserDetails(user);

          setWalletAddressStore({
            walletAddress: address,
            walletName: selectedWallet,
          });
        });
      }
    } catch (error) {
      return false;
    }
  }

  const setWalletAddressStore = (obj) => {
    setWalletAddress(obj.walletAddress);
    dispatch({
      type: actionTypes.SETWALLETADDR,
      payload: obj
    });
  }

  const connectToMetaMask = async (selectedWallet) => {
    web3Obj = new Web3(window.ethereum);
    try {
      window.ethereum.enable();
      if (web3Obj) {
        let address = setInterval(() => {
          web3Obj.eth.getCoinbase((err, res) => {
            if (res) {

              contract = new web3Obj.eth.Contract(BeldexMAT.abi, config.deployed.BeldexMAT);
              clearInterval(address);
              user = new ClientBeldexMAT(web3Obj, contract, res);
              userData.setUserDetails(user);

              setWalletAddressStore({
                walletAddress: res,
                walletName: selectedWallet,
              });
              window.ethereum.on('accountsChanged', async (accounts) => {
                const address = accounts[0] || null;
                user = new ClientBeldexMAT(web3Obj, contract, address);
                userData.setUserDetails(user);

                setWalletAddressStore({
                  walletAddress: address,
                  walletName: selectedWallet,

                });
              });
            }
          });
        }, 500);
      }
    } catch (error) {
      return false;
    }
  }


  const snackbarHandleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  }

  const swapMarket = (selectedMarket) => {
    if (selectedMarket === "BNB") {
      openUserAuthModal();
      // navigate('/dashboard');
    } else {
      setSnackbar({ open: true, severity: 'info', message: 'Coming Soon!!!' });
    }
  }

  const handleDialogClose = () => {
    setOpenAuthModal(false);

  }
  const openUserAuthModal = () => {
    if (walletAddress) {
      setOpenAuthModal(true);
    } else {
      setSnackbar({ open: true, severity: 'warning', message: 'Please connect to wallet and then proceed.' });
    }
  }

  const handleCloseMenu = (event, headerLink) => {
    if (headerLink.text === "Swap") {
      openUserAuthModal();
    }
    setAnchorElWallet(null);
  };

  const downloadScret = (text) => {
    const anchor = document.createElement('a')
    anchor.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('This private key is for the access of RAZE-pETH account.It cannot be used to access any other Raze account.' + '\n' + text))
    anchor.setAttribute('download', `raze_secret_key_${Date.now()}`)
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  const loading = (showLoading) => {
    dispatch({
      type: actionTypes.SHOWLOADING,
      payload: showLoading
    });
  };

  const handleRegister = async (key = btoa(new BN(crypto.randomBytes(32), 16).toString())) => {
    try {
      loading(true);
      await user.init();
      await user.register(key);
      await user.checkRegistered();
      await downloadScret(key);
      loading(false);
    } catch (e) {
      setSnackbar({ open: true, severity: 'error', message: e.message });
      loading(false);
    }
  }

  const handleLogin = async (key) => {
    try {
      loading(true);
      await user.init();
      const loginRes = await user.login(key);
      userData.setUserDetails(user);
      if (loginRes !== -1) {
        dispatch({
          type: actionTypes.LOGINKEY,
          payload: key
        });
        navigate('/dashboard');
      }
      loading(false);
    } catch (e) {
      setSnackbar({ open: true, severity: 'error', message: e.message });
      loading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', background: `url(${BgImage})`, backgroundSize: 'cover', minHeight: '100vh' }}>
      <Box sx={{ background: 'rgba(19, 19, 26, 0.75)', width: '100%' }}>
        <CssBaseline />
        <Header showNav={true} walletAddress={walletAddress} handleMenuClose={handleMenuClose} handleDrawerToggle={handleDrawerToggle} openUserAuthModal={openUserAuthModal} />
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElWallet}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{
            vertical: 'top', horizontal: 'left',
          }}
          open={Boolean(anchorElWallet)}
          onClose={handleCloseMenu}
        >
          {headerLinks.map((headerLink, index) => (
            <MenuItem key={headerLink.text}
              onClick={(event) => handleCloseMenu(event, headerLink)}
            >
              <Typography sx={{ pl: '20px' }} color="text.light" textAlign="center">{headerLink.text}</Typography>
            </MenuItem>
          ))}
        </Menu>
        <Container disableGutters sx={{ mt: 22, px: 12 }} maxWidth="xl">
          <Box className="firstBox">
            <Typography variant="body1" gutterBottom component="div" color="text.light" >
              Choose which cryptoCurrency you want to
            </Typography>
            <Typography sx={{ fontSize: 60, fontWeight: 900, m: 0 }} gutterBottom component="div" color="text.light">
              Privately transfer via
            </Typography>
            <Typography sx={{ fontSize: 60, fontWeight: 900, m: 0 }} gutterBottom component="div" color="text.light">
              Beldex network
            </Typography>
          </Box>
          <Box sx={{ py: 3, width: '230px' }}>
            <Box sx={{ display: 'flex', border: 'solid 1px #2c8ce5', padding: 0, borderRadius: '20px', height: '50px' }}>
              <Typography color="text.light" sx={{ textTransform: 'uppercase', fontSize: '15px', fontWeight: 600, padding: '10px 15px', lineHeight: 2 }} >Check Tutorial</Typography>
              <Box sx={{ background: 'linear-gradient(120deg, rgb(23, 91, 161), rgb(49, 152, 249))', height: '50px', width: '60px', borderRadius: '0 20px 20px 0', position: 'relative', left: 17 }}>
                <SvgIcon viewBox="0 0 512 512" sx={{ fontSize: '40px', position: 'relative', left: '10px', fill: 'black', top: '5px' }}>
                  <path d="M184.7,413.1l2.1-1.8l156.5-136c5.3-4.6,8.6-11.5,8.6-19.2c0-7.7-3.4-14.6-8.6-19.2L187.1,101l-2.6-2.3  C182,97,179,96,175.8,96c-8.7,0-15.8,7.4-15.8,16.6h0v286.8h0c0,9.2,7.1,16.6,15.8,16.6C179.1,416,182.2,414.9,184.7,413.1z" />
                </SvgIcon>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: { xs: 'space-evenly', sm: 'space-around' }, flexWrap: 'wrap', position: 'absolute', left: 50, right: 50, pb: '40px' }}>

            {currencyList.map((list, index) =>
              <CurrencyCard key={index} currency={list.currency} subTitle={list.subTitle} swapMarket={swapMarket} />
            )}

          </Box>
        </Container>
      </Box>
      <CustomizedSnackbars open={snackbar.open} handleClose={snackbarHandleClose} severity={snackbar.severity} message={snackbar.message} />
      <AuthenticationDialog handleLogin={handleLogin} handleRegister={handleRegister} open={openAuthModal} onClose={handleDialogClose} />
    </Box>
  )
}

export default Home;