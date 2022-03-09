import * as React from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import BlackBinance from '../../icons/black_binance.png'
import BinanceLogo from '../../icons/binancelogo.png'

const CurrencyCard = (props) => {

  const { currency, subTitle, swapMarket } = props;
  return (
    <Box onClick={() => swapMarket(currency)} sx={{
      width: 275,
      height: 165,
      margin: '10px',
      backgroundColor: '#1e1e2570',
      borderRadius: '20px',
      border: 'solid 1px #29292f',
      '&:hover': {
        backgroundColor: '#1e1e25',
        opacity:0.8,
      },
      // flexGrow: 1
    }}>
      <Card  sx={{ cursor: 'pointer', display: 'flex', backgroundColor: 'transparent', padding: '0px' }}>
          <CardMedia
            component="img"
            sx={{ height: '165px', position: 'relative', right: '50px' }}
            image={BlackBinance}
          />
          <CardMedia
            component="img"
            sx={{ width: '35px', height: '35px', position: 'relative', right: '150px', top: '65px' }}
            image={BinanceLogo}
          />
          <CardContent sx={{ width: 160, position: 'relative', minWidth: '160px', right: '85px', padding: '45px 20px 35px 15px', }}>
            <Typography sx={{ lineHeight: 1, pb: '15px', fontSize: 30, fontWeight: 900 }} component="div" color="text.light" > {currency}
            </Typography>
            <Typography sx={{ lineHeight: 1 }} component="div" color="text.light" variant="subtitle1" >
              {subTitle}
            </Typography>
          </CardContent>
      </Card>
    </Box>
  )
}

export default CurrencyCard;