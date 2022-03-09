import React from 'react';
import { Box, Typography } from '@mui/material';
import { Card } from '../../components';

const LeftPanel = (props) => (
    <Box sx={{ marginRight: { md: '0', lg: '50px' } }}>
    <Typography variant="h5" color="text.light" component="div"> Balance</Typography>
    <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'block' }, flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
      <Card variant="success" unitValue={props.mintValue} label="Beldex BNB Balance" endLabel="Beldex BNB = 0.1 BNB" />
      <Card variant="warning" unitValue={Number(props.balance).toFixed(2)} label="BNB Balance" endLabel={`BNB = (${(props.balance /100).toFixed(4)} BNB)`} />
      <Card variant="info" unitValue={'1:100'} label="Beldex BNB Balance" endLabel="rBNB BNB" />
    </Box>
  </Box>
)

export default LeftPanel;