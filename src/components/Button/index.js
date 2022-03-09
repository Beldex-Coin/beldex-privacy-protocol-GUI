import React from 'react';
import { Button } from "@mui/material";
import PropTypes from 'prop-types';


const StyledButton = (props) => {
  const {
    label,
    fullWidth,
    onClick,
    disabled,
    loading,
    variant,
    sxObj
  } = props;
  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      sx= {{ ...sxObj, minWidth: '200px', color: 'black', background: 'linear-gradient(to right, #64dd17 , #49a112)'}}
      disabled={disabled || loading}
      onClick={onClick}>
      {label}
    </Button>
  )
}

StyledButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  secondary: PropTypes.bool,
};

export default StyledButton;