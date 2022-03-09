import * as React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';

const linearColor = {
  success : ['#388e3c', '#0b830b', '#006400'],
  warning: ['#af924a', '#594719', '#544217'],
  info: ['#1042aa', '#113457', '#122c47']
}
export default function StyledCard(props) {
  const colorVal = linearColor[props.variant];

  return (
    <Box
      sx={{
        width: {xs: '100%', sm: 320, md: 300, lg: 335},
        height: 145,
        margin: '20px 0',
        backgroundColor: 'background.card',
        borderRadius: '20px',
        '&:hover': {
          backgroundColor: 'primary.background',
          opacity: [0.9, 0.8, 0.7],
        },
        // flexGrow: 1
      }}
    >
      <Card sx={{ display: 'flex', backgroundColor: 'transparent', 
        padding: {xs: '25px 20px',sm: '25px 20px',md: '25px 20px', lg: '25px 35px'}, height: 145 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            size={95}
            color={props.variant}
            thickness={2}
            variant="determinate"
            value={60}
            sx={{ zIndex: 1 }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              borderRadius: "50%",
              // background: "#1b1b24",
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg height="95" width="95">
              <defs> 
                <linearGradient id={props.variant} gradientTransform="rotate(65)">
                  <stop offset="0%" stopColor={colorVal[0]} />
                  <stop offset="70%" stopColor={colorVal[1]} />
                  <stop offset="100%" stopColor={colorVal[2]} />
                </linearGradient>
              </defs>
              <circle cx="47.5" cy="47.5" r="25" fill={`url(#${props.variant})`} />
              <text x="35%" y="50%" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif" stroke="#1b1b24" fill="#1b1b24" fontSize="55px" dy=".3em">B</text>
            </svg>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', textAlign: 'right' }}>
          <CardContent sx={{ p: '0 !important' }}>
            <Typography component="div" color="text.light" variant="subtitle1">
              {props.label}
            </Typography>
            <Typography component="div" variant="h2" sx={{ fontWeight: 'bold' }} >
              {props.unitValue} <Typography component="span" variant="h6" >Unit</Typography>
            </Typography>
            <Typography variant="subtitle2" color="text.subTitle" component="div">
              {/* BNB &asymp; (0.318BNB) */} {props.endLabel}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}
