import React, { useRef } from 'react';
import { Box, Typography, Popover } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const TextInput = (props) => {
  const { type, inputProps, formLabel, maxOnClick, placeholder, maxIcon, name, value, onChange, sxObj, publicHash } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const restrictMinus = e => {
    const inputKeyCode = e.keyCode ? e.keyCode : e.which;
    if (inputKeyCode != null && inputKeyCode === 45) e.preventDefault();
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
  }

  return (
    <Box>
      <FormControl sx={{ width: '100%', m: 0, pb: '40px', ...sxObj }} variant="outlined">
        <OutlinedInput
          placeholder={placeholder}
          type={type}
          sx={{ border: 'solid 1px #2f2f3e', borderRadius: '10px', padding: '15px', height: '60px', color: 'text.light', fontSize: 20, backgroundColor: '#1b1b25' }}
          name={name}
          value={value}
          inputProps={inputProps}
          onChange={onChange}
          onKeyPress={restrictMinus}
          endAdornment={maxIcon && <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={maxOnClick}
              sx={{
                right: '15px',
                padding: '5px 15px',
                borderRadius: '10px',
                fontSize: '15px',
                height: '30px',
                border: 'solid 1px #1d1d29',
                backgroundColor: '#22222e'
              }}
            >
              Max
            </IconButton>
          </InputAdornment>}
        />
        {formLabel && <FormHelperText variant="filled" sx={{ textAlign: 'right', color: "text.primary", fontSize: 16, height: '27px' }} margin="dense" onClick={handleClick}>{formLabel}</FormHelperText>}
      </FormControl>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ display: 'flex', width: '450px', height: '120px', justifyContent: 'space-between' }}>
          <Typography id="publicHash" sx={{ p: 2, wordBreak: 'break-all' }}>{publicHash}</Typography>
          <IconButton sx={{ width: '40px', height: '40px', margin: '40px 10px 0 0' }} onClick={copyContent}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Popover>
    </Box>
  )

}

export default TextInput;