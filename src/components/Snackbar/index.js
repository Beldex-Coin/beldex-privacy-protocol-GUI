import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref}  {...props} />;
});

const Snackbars = (props) => {
  const walletObj = useSelector((state) => state.walletReducer);

  const { open, handleClose, severity, message } = props;
  return (
    <Snackbar anchorOrigin={severity === 'walletInfo' ? { vertical: 'top', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'left' }} open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert variant={severity === 'walletInfo' ? "standard" : "filled"} onClose={handleClose} severity={severity === 'walletInfo' ? 'success' : severity} sx={{ width: '100%' }}>
        {severity === 'walletInfo' ?
          <Fragment>
            <AlertTitle>Selected Wallet: <strong>{walletObj.walletName}</strong></AlertTitle>
            Address: <strong>{walletObj.walletAddress}</strong>
          </Fragment>
          : message}
      </Alert>
    </Snackbar>
  )
}

const CustomizedSnackbars = React.memo(Snackbars);

CustomizedSnackbars.propTypes = {
  open: PropTypes.bool,
  severity: PropTypes.string,
  message: PropTypes.string,
  handleClose: PropTypes.func,
}
export default CustomizedSnackbars;