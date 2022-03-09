import React, { Fragment, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, CssBaseline, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import Web3 from 'web3';
import { withStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { UserContext } from '../../userContext';
import { Header, StyledButton, TextInput, CustomizedSnackbars } from '../../components';
import SidePanel from './SidePanel';
import LeftPanel from './LeftPanel';
import { ContentStyle } from './ContentStyle';
import * as actionTypes from "../../common/actionTypes";
import HorizontalDivider from './../../icons/HorizontalDivider';
import ClientBeldexMAT from '../../client/client_beldexmat';
import config from '../../config';
import BeldexMAT from '../../contract-artifacts/BeldexMAT.json';

const componentStyle = theme => {
  return ({
    toggleBtn: {
      fontWeight: '600',
      textTransform: 'capitalize',
      '&:hover': {
        background: '#125fef60'
      },
      '&.Mui-selected': {
        background: '#125fef',
        border: 'none',
        color: theme.palette.text.light,
        '&:hover': {
          background: '#125fef60'
        },
      }
    }
  })
};
const viewLabelArr = {
  mint: {
    subTitle: "Deposit BNB to wBNB",
    btnLabel: "Confirm Mint",
    helperText: "Unit BNB = 0.00 BNB"
  },
  transfer: {
    subTitle: "My Beldex Account Address",
    btnLabel: "Confirm Transfer",
    helperText: ""
  },
  redeem: {
    subTitle: "Redeem BNB to wBNB",
    btnLabel: "Confirm Redeem",
    helperText: "You will receive 0.00 BNB"
  },
}

const styledToggle = { minWidth: '100px', borderRadius: '8px !important', bgcolor: 'background.card' };
let web3Obj = {};
let contract = {};
let user = {};
const Dashboard = (props) => {
  const storeAddr = useSelector((state) => state.walletReducer)
  const loginKey = useSelector((state) => state.loginReducer)
  const userData = useContext(UserContext);
  if (Object.entries(userData.user).length !== 0) {
    user = userData.user;
  }
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(storeAddr.walletAddress);
  const [view, setView] = useState('mint');
  const [viewLabel, setViewLabel] = useState(viewLabelArr[view].subTitle);
  const [transValue, setValue] = useState('');
  const [address, setAddress] = useState('');
  const [walletBal, setWalletBal] = useState('');
  const [mintValue, setMintValue] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { classes } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    setValue('')
  }, [view]);

  // useEffect(() => {
  //   if (walletAddress) {
  //     setSnackbar({ open: true, severity: 'walletInfo', message: '' });
  //   }
  // }, []);


  useEffect(() => {

    const handlePageLoad = async event => {
      web3Obj = new Web3(window.ethereum);
      if (storeAddr.walletName === "Meta Mask") {
        web3Obj = new Web3(window.ethereum);
      } else if (storeAddr.walletName === "BSC") {
        web3Obj = new Web3(window.BinanceChain);
      }
      contract = new web3Obj.eth.Contract(BeldexMAT.abi, config.deployed.BeldexMAT);
      user = new ClientBeldexMAT(web3Obj, contract, storeAddr.walletAddress);
      await user.init();
      await user.login(loginKey.key);
      await getBalance(storeAddr.walletAddress);
    };

    window.addEventListener("load", handlePageLoad);

    if (storeAddr.walletAddress) {
      setWalletAddress(storeAddr.walletAddress);
      web3Obj = new Web3(window.ethereum);
      if (storeAddr.walletName === "Meta Mask") {
        web3Obj = new Web3(window.ethereum);
      } else if (storeAddr.walletName === "BSC") {
        web3Obj = new Web3(window.BinanceChain);
      }
      getBalance(storeAddr.walletAddress);
    }
    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, [storeAddr])


  const getBalance = async (address) => {
    const balance = await web3Obj.eth.getBalance(address, (err, wei) => { });
    if (user.account) {
      await user.account.update();
      console.log(user.account.available());
      console.log(user.account.pending());
      setMintValue(user.account.available() + user.account.pending());
    }
    setWalletBal(balance / 1e16);
  }

  const setWalletAddressStore = (obj) => {
    setWalletAddress(obj.walletAddress);
    dispatch({
      type: actionTypes.SETWALLETADDR,
      payload: obj
    });
  }

  const handleInputChange = (e) => {
    setValue(e.target.value)
  }

  const handleAddressChange = (e) => {
    setAddress(e.target.value)

  }

  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
      setViewLabel(viewLabelArr[nextView].subTitle)
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const snackbarHandleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  }

  const handleMaxOnClick = () => {
    setValue(mintValue);
  }

  const handleSubmit = () => {
    const baln = view === 'mint' ? walletBal : mintValue;
    if (transValue) {
      if (transValue <= 0) {
        setSnackbar({ open: true, severity: 'warning', message: 'Amount should be greater than 0' });
        return
      } else if (transValue > baln) {
        setSnackbar({ open: true, severity: 'warning', message: 'Entered amount is exceeding the balance.' });
      } else if (view === 'transfer' && address === '') {
        setSnackbar({ open: true, severity: 'warning', message: 'Entered Recipient Address.' });
      } else {
        makeTransaction(view);
      }
    }
    else {
      setSnackbar({ open: true, severity: 'warning', message: 'Input field should not be empty' });
    }
  }

  const makeTransaction = (view) => {
    switch (view) {
      case 'transfer':
        makeTransfer();
        break;
      case 'redeem':
        makeRedeem();
        break;
      case 'mint':
        makeMint();
        break;
      default: break;
    }
  }

  const makeRedeem = async () => {
    setBtnDisabled(true);
    try {
      setSnackbar({ open: true, severity: 'warning', message: '[Short window] Your redeem has been queued. Please wait' });
      await user.redeem(transValue);
      setSnackbar({ open: true, severity: 'success', message: `Redeem of ${transValue} Beldex BNB was successful` });
      getBalance(walletAddress);
    } catch (e) {
      setSnackbar({ open: true, severity: 'error', message: e.message });
    }
    setBtnDisabled(false);
  }

  const makeMint = async () => {
    setBtnDisabled(true);
    try {
      await user.mint(transValue);
      setSnackbar({ open: true, severity: 'success', message: `Mint of ${transValue} Beldex BNB was successful` });
      getBalance(walletAddress);
    } catch (e) {
      setSnackbar({ open: true, severity: 'error', message: e.message });
    }
    setBtnDisabled(false);
  }

  const makeTransfer = async () => {
    setBtnDisabled(true);
    try {
      await user.transfer(address, transValue);
      setSnackbar({ open: true, severity: 'success', message: `Transferred of ${transValue} Beldex BNB was successful` });
      getBalance(walletAddress);
    } catch (e) {
      setSnackbar({ open: true, severity: 'error', message: e.message });
    }
    setBtnDisabled(false);
  }

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
        web3Obj.eth.getBalance(address).then(data => {
          setWalletBal(data);
        });
        contract = new web3Obj.eth.Contract(BeldexMAT.abi, config.deployed.BeldexMAT);
        user = new ClientBeldexMAT(web3Obj, contract, address);

        setWalletAddressStore({
          walletAddress: address,
          walletName: selectedWallet
        });
        window.BinanceChain.on('accountsChanged', async accounts => {
          const address = accounts[0] || null;
          user = new ClientBeldexMAT(web3Obj, contract, address);
          setWalletAddressStore({
            walletAddress: address,
            walletName: selectedWallet
          });
        });
      }
    } catch (error) {
      return false;
    }
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
              web3Obj.eth.getBalance(res).then(data => {
                setWalletBal(data);
              });
              user = new ClientBeldexMAT(web3Obj, contract, res);
              setWalletAddressStore({
                walletAddress: res,
                walletName: selectedWallet
              });
              window.ethereum.on('accountsChanged', async (accounts) => {
                const address = accounts[0] || null;
                user = new ClientBeldexMAT(web3Obj, contract, res);
                setWalletAddressStore({
                  walletAddress: address,
                  walletName: selectedWallet
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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header showNav={false} walletAddress={walletAddress} handleMenuClose={handleMenuClose} handleDrawerToggle={handleDrawerToggle} />
      <SidePanel mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box sx={ContentStyle}>
        <LeftPanel balance={walletBal} mintValue={mintValue} />
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <ToggleButtonGroup exclusive sx={{ boxShadow: 'none', height: 30 }} value={view} onChange={handleChange}>
            <ToggleButton classes={{ root: classes.toggleBtn }} value="mint" sx={styledToggle}>Mint</ToggleButton>
            <HorizontalDivider />
            <ToggleButton classes={{ root: classes.toggleBtn }} value="transfer" sx={styledToggle}>Transfer</ToggleButton>
            <HorizontalDivider />
            <ToggleButton classes={{ root: classes.toggleBtn }} value="redeem" sx={styledToggle}>Redeem</ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ bgcolor: 'background.card', borderRadius: '20px', margin: '20px 5px', minHeight: '500px', p: '45px 45px 60px 45px' }}>
            <Typography variant="h5" sx={{ pb: '5px', fontWeight: 700 }} color="text.light" component="div">{view.toLowerCase().replace(/\w/, firstLetter => firstLetter.toUpperCase())}</Typography>
            <Typography component="div" sx={{ pb: '40px' }} color="text.light" variant="subtitle1">{viewLabel}</Typography>
            <TextInput type="number" value={transValue} placeholder="0 Unit" formLabel={viewLabelArr[view].helperText} onChange={handleInputChange} maxIcon={view !== "mint"} name="unit" inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }} maxOnClick={handleMaxOnClick} />
            {view === "transfer" &&
              <Fragment>
                <Typography component="div" sx={{ textAlign: 'left', pb: '5px' }} color="text.light" variant="subtitle1">Recipient Address</Typography>
                <TextInput type="text" id="address" placeholder="Please Enter Address" maxIcon={false} name="address" value={address} onChange={handleAddressChange} />
              </Fragment>}
            <StyledButton disabled={btnDisabled} sxObj={{ marginTop: view === "transfer" ? '0px' : '103px' }} onClick={handleSubmit} label={viewLabelArr[view].btnLabel} color="primary" variant="contained" />
          </Box>
        </Box>
      </Box>
      <CustomizedSnackbars open={snackbar.open} handleClose={snackbarHandleClose} severity={snackbar.severity} message={snackbar.message} />
    </Box>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.object
};

export default withStyles(componentStyle, { withTheme: true })(Dashboard);
