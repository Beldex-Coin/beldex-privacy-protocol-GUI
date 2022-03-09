import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Avatar, List, ListItem, ListItemAvatar,ListItemText, DialogTitle, Dialog} from '@mui/material';
import binance from '../../icons/binance.png';
import metamask from '../../icons/metamask.png';

const wallets = [{ id: 0, text: 'BSC', img: binance }, { id: 1, text: 'Meta Mask', img: metamask }];

const CustomizedDialog = (props)  => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose('');
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{color: 'text.light'}}>Choose your Wallet</DialogTitle>
      <List sx={{ pt: 0 }}>
        {wallets.map((wallet) => (
          <ListItem button onClick={() => handleListItemClick(wallet)} key={wallet.id}>
            <ListItemAvatar>
              <Avatar src={wallet.img}/>
            </ListItemAvatar>
            <ListItemText sx={{color: 'text.light'}} primary={wallet.text} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

CustomizedDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default CustomizedDialog;
// export default function SimpleDialogDemo() {
//   const [openDialog, setOpenDialog] = React.useState(true);

//   const handleDialogClose = (value) => {
//     setOpenDialog(false);
//   };

//   return (
//       <CustomizedDialog
//         open={openDialog}
//         onClose={handleDialogClose}
//       />
//   );
// }
