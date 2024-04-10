import React, { Fragment, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  CssBaseline,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Web3 from "web3";
import { withStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "../../userContext";
import {
  Header,
  StyledButton,
  TextInput,
  CustomizedSnackbars,
} from "../../components";
import LeftPanel from "./LeftPanel";
import { ContentStyle } from "./ContentStyle";
import * as actionTypes from "../../common/actionTypes";
import HorizontalDivider from "./../../icons/HorizontalDivider";
import ClientBeldexMAT from "../../client/client_beldexmat";
import config from "../../config";
import BeldexMAT from "../../contract-artifacts/BeldexMAT.json";
const componentStyle = (theme) => {
  return {
    toggleBtn: {
      fontWeight: "600",
      textTransform: "capitalize",
      "&:hover": {
        background: "#125fef60",
      },
      "&.Mui-selected": {
        background: "#125fef",
        border: "none",
        color: theme.palette.text.light,
        "&:hover": {
          background: "#125fef60",
        },
      },
    },
  };
};
const computeViewLabels = (swap) => {
  return {
    mint: {
      subTitle: `Deposit ${swap} to r${swap}`,
      btnLabel: "Confirm Mint",
      helperText: (val) =>
        `${val ? val : 0} r${swap} = ${val ? val : 0} ${swap}`,
    },
    transfer: {
      subTitle: `My ${swap} Account Address`,
      btnLabel: "Confirm Transfer",
      helperText: (val) => "",
    },
    redeem: {
      subTitle: `Redeem r${swap} to ${swap}`,
      btnLabel: "Confirm Redeem",
      helperText: (val = 0) => `You will receive ${val ? val : 0} ${swap}`,
    },
  };
};
const styledToggle = {
  minWidth: "100px",
  borderRadius: "8px !important",
  bgcolor: "background.card",
};
let web3Obj = {};
let contract = {};
let user = {};
const Dashboard = (props) => {
  const storeAddr = useSelector((state) => state.walletReducer);
  const loginKey = useSelector((state) => state.loginReducer);
  const swap = useSelector((state) => state.swapReducer.swap);
  const userData = useContext(UserContext);
  if (Object.entries(userData.user).length !== 0) {
    user = userData.user;
  }
  const viewLabelArr = React.useMemo(() => computeViewLabels(swap), [swap]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(storeAddr.walletAddress);
  const [view, setView] = useState("mint");
  const [viewLabel, setViewLabel] = useState(viewLabelArr[view].subTitle);
  const [transValue, setValue] = useState("");
  const [address, setAddress] = useState("");
  const [walletBal, setWalletBal] = useState("");
  const [mintValue, setMintValue] = useState("0");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { classes } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    setValue("");
  }, [view]);
  useEffect(() => {
    if (!loginKey.key ) {
      navigate("/");
    }
  }, [location.pathname]);
  useEffect(() => {
    const handlePageLoad = async (event) => {
      loading(true);
      web3Obj = new Web3(window.ethereum);
      if (storeAddr.walletName === "Meta Mask") {
        web3Obj = new Web3(window.ethereum);
      } else if (storeAddr.walletName === "BSC") {
        web3Obj = new Web3(window.BinanceChain);
      }
      contract = new web3Obj.eth.Contract(
        BeldexMAT.abi,
        config.deployed.BeldexMAT
      );
      console.log("storeAddr.walletAddress : ", storeAddr.walletAddress);
      user = new ClientBeldexMAT(web3Obj, contract, storeAddr.walletAddress);
      await user.init();
      await user.login(loginKey.key);
      await getBalance(storeAddr.walletAddress);
      loading(false);
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
  }, [storeAddr]);

  const getBalance = async (address) => {
    const balance = await web3Obj.eth.getBalance(address, (err, wei) => {});
    if (user.account) {
      await user.account.update();
      setMintValue((user.account.available() + user.account.pending()) / 100);
    }
    const currentBal = Math.floor((balance / 1e18) * 10000) / 10000;
    setWalletBal(currentBal);
  };

  const setWalletAddressStore = (obj) => {
    setWalletAddress(obj.walletAddress);
    dispatch({
      type: actionTypes.SETWALLETADDR,
      payload: obj,
    });
  };
  const countDecimals = (num) => {
    var str = num.toString();
    if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
      return str.split("-")[1] || 0;
    } else if (str.indexOf(".") !== -1) {
      return str.split(".")[1].length || 0;
    }
    return str.split("-")[1] || 0;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (countDecimals(value) <= 2) {
      if (value.length <= 40) {
        setValue(e.target.value);
      }
    } else {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Amount should accept the percise of 2 decimal only.",
      });
    }
  };

  const handleAddressChange = (e) => {
    // Regular expression to match only alphanumeric characters
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    if (alphanumericRegex.test(e.target.value) || e.target.value === "") {
      setAddress(e.target.value);
    }
  };

  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
      setViewLabel(viewLabelArr[nextView].subTitle);
      setAddress('')
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const snackbarHandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleMaxOnClick = () => {
    setValue(mintValue);
  };

  const handleSubmit = () => {
    const baln = view === "mint" ? walletBal : mintValue;
    if (transValue) {
      if (transValue <= 0) {
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Amount should be greater than 0",
        });
        return;
      } else if (transValue > baln) {
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Entered amount is exceeding the balance.",
        });
      } else if (view === "transfer" && address === "") {
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Entered Recipient Address.",
        });
      } else {
        if (navigator.onLine) {
          makeTransaction(view);
        } else {
          setSnackbar({
            open: true,
            severity: "error",
            message: "Please check your internet connectivity.",
          });
        }
      }
    } else {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Input field should not be empty",
      });
    }
  };

  const makeTransaction = (view) => {
    switch (view) {
      case "transfer":
        makeTransfer();
        break;
      case "redeem":
        makeRedeem();
        break;
      case "mint":
        makeMint();
        break;
      default:
        break;
    }
  };

  const loading = (showLoading) => {
    dispatch({
      type: actionTypes.SHOWLOADING,
      payload: showLoading,
    });
  };

  const makeRedeem = async () => {
    setBtnDisabled(true);
    try {
      loading(true);
      setSnackbar({
        open: true,
        severity: "warning",
        message: "[Short window] Your redeem has been queued. Please wait",
      });
      await user.redeem(transValue);
      await getBalance(walletAddress);
      setSnackbar({
        open: true,
        severity: "success",
        message: `Redeem of ${transValue}rMATIC to ${transValue} MATIC was successful`,
      });
      loading(false);
    } catch (e) {
      setSnackbar({
        open: true,
        severity: "error",
        message: e.message ? e.message : e,
      });
      loading(false);
    }
    setValue("");
    setBtnDisabled(false);
  };

  const makeMint = async () => {
    setBtnDisabled(true);
    try {
      loading(true);
      const mintRes = await user.mint(transValue);
      await getBalance(walletAddress);
      setSnackbar({
        open: true,
        severity: "success",
        message: `Mint of ${transValue} rMATIC was successful`,
      });
      loading(false);
      setView("transfer");
      setViewLabel(viewLabelArr["transfer"].subTitle);
    } catch (e) {
      setSnackbar({
        open: true,
        severity: "error",
        message: e.message ? e.message : e,
      });
      loading(false);
    }
    setValue("");
    setBtnDisabled(false);
  };

  const getErrMsg = (e) => {
    if (e.message) {
      if (e.message.includes("Transaction has been reverted by the EVM")) {
        return "Transaction has been reverted by the EVM.";
      } else {
        return e.message;
      }
    } else {
      return e;
    }
  };

  const makeTransfer = async () => {
    setBtnDisabled(true);
    try {
      loading(true);
      await user.transfer(address, transValue);
      await getBalance(walletAddress);
      setSnackbar({
        open: true,
        severity: "success",
        message: `Transferred of ${transValue} rMATIC was successful`,
      });
      setAddress("");
      loading(false);
    } catch (e) {
      setSnackbar({ open: true, severity: "error", message: getErrMsg(e) });
      loading(false);
    }
    setValue("");
    setBtnDisabled(false);
  };

  const handleWalletMenuClose = async (selectedWallet) => {
    if (selectedWallet === "BSC") {
      if (typeof window.BinanceChain !== "undefined") {
        const account = await window.BinanceChain.request({
          method: "eth_requestAccounts",
        });
        if (account) connectToBinance(selectedWallet);
      } else {
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Binance Chain not installed.",
        });
      }
    } else if (selectedWallet === "Meta Mask") {
      if (typeof window.ethereum !== "undefined") {
        try {
          const account = await window.ethereum?.request({
            method: "eth_requestAccounts",
          });
          if (account) connectToMetaMask(selectedWallet);
        } catch (err) {
          setSnackbar({
            open: true,
            severity: "error",
            message: err.message ? err.message : err,
          });
        }
      } else {
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Meta Mask not installed.",
        });
      }
    }
  };

  const connectToBinance = async (selectedWallet) => {
    web3Obj = new Web3(window.BinanceChain);
    try {
      await window.BinanceChain.enable();
      if (web3Obj) {
        const accounts = await window.BinanceChain.request({
          method: "eth_accounts",
        });
        const address = accounts[0] || null;
        await getBalance(address);
        contract = new web3Obj.eth.Contract(
          BeldexMAT.abi,
          config.deployed.BeldexMAT
        );
        user = new ClientBeldexMAT(web3Obj, contract, address);
        setWalletAddressStore({
          walletAddress: address,
          walletName: selectedWallet,
        });
        window.BinanceChain.on("accountsChanged", async (accounts) => {
          const address = accounts[0] || null;
          user = new ClientBeldexMAT(web3Obj, contract, address);
          setWalletAddressStore({
            walletAddress: address,
            walletName: selectedWallet,
          });
        });
      }
    } catch (error) {
      return false;
    }
  };

  const connectToMetaMask = async (selectedWallet) => {
    web3Obj = new Web3(window.ethereum);
    try {
      window.ethereum.enable();
      if (web3Obj) {
        let address = setInterval(() => {
          web3Obj.eth.getCoinbase(async (err, res) => {
            if (res) {
              contract = new web3Obj.eth.Contract(
                BeldexMAT.abi,
                config.deployed.BeldexMAT
              );
              clearInterval(address);
              await getBalance(res);
              user = new ClientBeldexMAT(web3Obj, contract, res);
              setWalletAddressStore({
                walletAddress: res,
                walletName: selectedWallet,
              });
              window.ethereum.on("accountsChanged", async (accounts) => {
                const address = accounts[0] || null;
                user = new ClientBeldexMAT(web3Obj, contract, res);
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
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header
        showNav={false}
        walletAddress={walletAddress}
        handleWalletMenuClose={handleWalletMenuClose}
        handleDrawerToggle={handleDrawerToggle}
        walletBal={walletBal}
        publicHash={user && user.account && user.account.publicKeyEncoded()}
      />
      <Box sx={ContentStyle}>
        <LeftPanel swap={swap} balance={walletBal} mintValue={mintValue} />
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <ToggleButtonGroup
            exclusive
            sx={{ boxShadow: "none", height: 30 }}
            value={view}
            onChange={handleChange}
          >
            <ToggleButton
              classes={{ root: classes.toggleBtn }}
              value="mint"
              sx={styledToggle}
            >
              Mint
            </ToggleButton>
            <HorizontalDivider />
            <ToggleButton
              classes={{ root: classes.toggleBtn }}
              value="transfer"
              sx={styledToggle}
            >
              Transfer
            </ToggleButton>
            <HorizontalDivider />
            <ToggleButton
              classes={{ root: classes.toggleBtn }}
              value="redeem"
              sx={styledToggle}
            >
              Redeem
            </ToggleButton>
          </ToggleButtonGroup>
          <Box
            sx={{
              bgcolor: "background.card",
              borderRadius: "20px",
              margin: "20px 5px",
              minHeight: "500px",
              p: "45px 45px 60px 45px",
            }}
          >
            <Typography
              variant="h5"
              sx={{ pb: "5px", fontWeight: 700 }}
              color="text.light"
              component="div"
            >
              {view
                .toLowerCase()
                .replace(/\w/, (firstLetter) => firstLetter.toUpperCase())}
            </Typography>
            <Typography
              component="div"
              sx={{ pb: "40px" }}
              color="text.light"
              variant="subtitle1"
            >
              {viewLabel}
            </Typography>
            {view === "transfer" && (
              <Fragment>
                <Typography
                  component="div"
                  sx={{ textAlign: "left", pb: "5px" }}
                  color="text.light"
                  variant="subtitle1"
                >
                  Recipient Address
                </Typography>
                <TextInput
                  type="text"
                  id="address"
                  placeholder="Please Enter Address"
                  maxIcon={false}
                  name="address"
                  value={address}
                  onChange={handleAddressChange}
                />
              </Fragment>
            )}
            <TextInput
              type="number"
              value={transValue}
              placeholder="0 rMATIC"
              formLabel={viewLabelArr[view].helperText(transValue)}
              onChange={handleInputChange}
              maxIcon={view !== "mint"}
              name="unit"
              inputProps={{
                min: 0.01,
                step: ".01",
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              maxOnClick={handleMaxOnClick}
              publicHash={
                user && user.account && user.account.publicKeyEncoded()
              }
            />
            <StyledButton
              disabled={btnDisabled}
              sxObj={{ marginTop: view === "transfer" ? "0px" : "103px" }}
              onClick={handleSubmit}
              label={viewLabelArr[view].btnLabel}
              color="primary"
              variant="contained"
            />
          </Box>
        </Box>
      </Box>
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={snackbarHandleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </Box>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(componentStyle, { withTheme: true })(Dashboard);
