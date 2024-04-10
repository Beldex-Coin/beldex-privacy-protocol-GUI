import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IconButton, DialogTitle, DialogContentText, Dialog, DialogContent, Typography, Link } from '@mui/material';
import { withStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import { StyledButton, TextInput, CustomizedSnackbars } from '../../components';

const componentStyle = theme => {
  return ({
    root: {
      background: '#18182199'
    },
    dialogPaperRoot: {
      width: '60%',
      background: '#17171f',
      borderRadius: '20px',
      border: 'solid 1px #1d1d1f',
      boxShadow: '0px 0px 6px 1px #484747',
      padding: '10px 60px 60px',
      [theme.breakpoints.down('md')]: {
        width: '80%',
      },
    },
    dialogTitle: {
      textAlign: 'center',
      padding: '25px 0',
      fontSize: '28px',
      color: theme.palette.common.white,
    },
    closeIcon: {
      background: theme.palette.common.white,
      color: theme.palette.common.black,
      position: 'absolute',
      right: 30,
      top: 15,
    },
    contentText: {
      textAlign: 'justify',
      lineHeight: 1.2,
      color: theme.palette.text.subTitle,
      paddingBottom: '20px',
    }
  })
};


const AuthenticationDialog = (props) => {
  const { onClose, open, classes, handleRegister, handleLogin, isRegisterView } = props;
  const [privateKey, setPrivateKey] = useState('');
  const [ownKey, setOwnKey] = useState(undefined);
  const [registerView, setRegisterView] = useState(isRegisterView);
  const [pickOwn, setPickOwn] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setRegisterView(isRegisterView)
  }, [isRegisterView])

  const showRegister = () => {
    setRegisterView(true)
  }
  const handlePrivateKeyChange = (e) => {
    setPrivateKey(e.target.value)
  }

  const handlePickOwnKeyChange = (e) => {
    setOwnKey(e.target.value)
  }
  const snackbarHandleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  }

  const handleClose = async () => {
    await onClose('');
    // if(!isRegisterView){
    //   setRegisterView(false)
    // }
    setOwnKey(undefined);
    setPrivateKey('');
    setPickOwn(false);
    setRegisterView(isRegisterView)
  };

  const handleSubmit = () => {
    if (navigator.onLine) {
      if (registerView) {
        setRegisterView(false)
        setPrivateKey('');
      } else {
        if (privateKey) {
          handleLogin(privateKey)
        } else {
          setSnackbar({ open: true, severity: 'warning', message: 'Input field should not be empty' });
        }
      }
    } else {
      setSnackbar({ open: true, severity: 'error', message: 'Please check your internet connectivity.' });
    }
  }

  const handlePrivateKeyGen = async () => {
    if (navigator.onLine) {
      if (pickOwn) {
        if (ownKey) {
          handleRegister(ownKey);
        } else {
          setSnackbar({ open: true, severity: 'warning', message: 'Input field should not be empty' });
        }
      } else if (!pickOwn) {
        await handleRegister();
      }
    } else {
      setSnackbar({ open: true, severity: 'error', message: 'Please check your internet connectivity.' });
    }
  }

  const handlePickOwnKey = () => {
    setPickOwn(true)
    setOwnKey(undefined)
  }

  return (
    <Fragment>
      <Dialog onClose={handleClose} open={open}
        classes={{
          root: classes.root, paper: classes.dialogPaperRoot
        }}>

        <DialogTitle classes={{ root: classes.dialogTitle }}>
          {!pickOwn && (registerView ? 'Register' : 'Login into your Account')}
          {pickOwn && 'Enter your Private Key'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            classes={{ root: classes.closeIcon }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {/*  */}
        <DialogContent>
          {!pickOwn && registerView && <DialogContentText classes={{ root: classes.contentText }} color="text.secondary">
            Please use our key generator or a key that is random as your wallet private key for the beldex private key. Copy it to a piece of paper and keep it in a safe place. Never share your private key with others. This private key is for the access of beldex - BDX account. It cannot be used to access any other beldex account.
          </DialogContentText>}
          {!pickOwn && !registerView && <TextInput type="text" id="privateKey" placeholder="Enter Your Private Key" maxIcon={false} name="privateKey" value={privateKey} onChange={handlePrivateKeyChange} sxObj={{ pb: 0 }} />}

          {pickOwn && <TextInput type="text" id="ownKey" placeholder="Enter Your Private Key" maxIcon={false} name="ownKey" value={ownKey} onChange={handlePickOwnKeyChange} sxObj={{ pb: 4 }} />}

          {!pickOwn && !registerView && <Typography sx={{ pt: 2, pb: 3, fontSize: 14 }} align="right" color="text.subTitle">Don't have an account?
            <Link component="button" sx={{ pl: '5px', fontSize: '14px' }} variant="body2" onClick={showRegister} underline="none">Register</Link>
          </Typography>}

          {!pickOwn && registerView && <Fragment>
            <StyledButton sxObj={{ marginTop: '0px', height: '55px', fontSize: '18px', fontWeight: 600 }} onClick={handlePrivateKeyGen} label="Private Key Generator" fullWidth={true} color="primary" variant="contained" />
            <Typography color="text.secondary" align="center" sx={{ p: 1, m: 0 }}>Or</Typography>
            <StyledButton sxObj={{ marginTop: '0px', height: '55px', fontSize: '18px', fontWeight: 600 }} onClick={handlePickOwnKey} label="Pick Your Own Key" fullWidth={true} color="primary" variant="contained" />
            <Typography color="text.secondary" align="center" sx={{ p: 1, m: 0 }}>Or</Typography>
          </Fragment>}
          {!pickOwn && <StyledButton sxObj={{ marginTop: '0px', height: '55px', fontSize: '18px', fontWeight: 600 }} onClick={handleSubmit} label="Login" fullWidth={true} color="primary" variant="contained" />}

          {pickOwn && <StyledButton sxObj={{ marginTop: '0px', height: '55px', fontSize: '18px', fontWeight: 600 }} onClick={handlePrivateKeyGen} label="Register" fullWidth={true} color="primary" variant="contained" />}
        </DialogContent>
      </Dialog>
      <CustomizedSnackbars open={snackbar.open} handleClose={snackbarHandleClose} severity={snackbar.severity} message={snackbar.message} />
    </Fragment>
  );
}

AuthenticationDialog.defaultProps = {
  isRegisterView: false
}

AuthenticationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withStyles(componentStyle, { withTheme: true })(AuthenticationDialog)