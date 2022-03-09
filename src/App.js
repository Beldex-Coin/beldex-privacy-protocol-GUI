import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lightGreen, common, grey, red, green, amber } from '@mui/material/colors';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import store from './store';
import { Layout } from './components';
import { UserContext } from './userContext';
import './App.scss';
const persistor = persistStore(store);
const ColorModeContext = React.createContext({ toggleColorMode: () => { } });
// { user: {}, setUser: () => { } }
const getDesignTokens = (mode) => ({
  // disabledButton: {
  //   backgroundColor: 'red'
  // },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          padding: '15px 90px',
          boxShadow: 'none',
          backgroundImage: 'none'
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          transform: 'rotate(90deg) !important',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'capitalize',
          borderRadius: '10px',
          "&.Mui-disabled": {
            color: "rgba(255, 255, 255, 0.65)",
            boxShadow: "none",
            backgroundColor: "rgba(255, 255, 255, .62)"
          }
        },
      },
    },
  },
  palette: {
    mode,
    primary: {
      main: lightGreen['A700'],
      background: '#22222e',
      dark: green[900],
      light: grey[700],
      contrastText: common.white,
    },
    secondary: {
      main: common.white,
      contrastText: common.white,
    },
    info: {
      main: '#125fef',
    },
    error: {
      main: red['A400'],
      contrastText: common.white,
    },
    grey: {
      main: common.white,
      contrastText: common.white,
    },
    ...(mode === 'dark' && {
      background: {
        default: '#13131a',
        paper: '#13131a',
        secondary: '#17171f',
        primary: '#14141b',
        card: '#1d1d29'
      },
    }),
    text: {
      ...(mode === 'light'
        ? {
          primary: grey[900],
          secondary: grey[800],
          disabled: grey[500]

        }
        : {
          primary: green[600],
          secondary: grey[100],
          light: grey[100],
          warning: amber[500],
          info: '#125fef',
          subTitle: grey[500],
          disabled: grey[100]
        }),
    },
    // action: {
    //   disabledBackground: 'rgba(255, 255, 255, .62)',
    //   disabled: 'rgba(255, 255, 255, .62)'
    // }
  },

  typography: {
    htmlFontSize: 16,
    fontFamily:"poppins",
    // fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    color: grey[100],
    h1: {
      fontWeight: 400,
      fontSize: "45px",
      // lineHeight: 1.167,
      letterSpacing: "-0.01562em",
      color: grey[100],
    },
    h2: {
      fontWeight: 300,
      fontSize: "40px",
      lineHeight: 1,
      letterSpacing: "-0.01562em",
      color: grey[100],
    }
  }
});


export default function App(props) {
  const [mode, setMode] = React.useState('dark');
  const [user, setUser] = React.useState({});
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const setUserDetails = (userData) => setUser(userData);
  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserContext.Provider value={{user, setUserDetails}}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <Layout {...props} />
            {/* <Button variant="text" onClick={colorMode.toggleColorMode} >Text</Button> */}

          </ThemeProvider>
        </ColorModeContext.Provider>
        </UserContext.Provider>
      </PersistGate>
    </Provider>
  );
}