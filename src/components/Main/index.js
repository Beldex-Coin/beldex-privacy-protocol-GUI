import React, {useEffect} from "react";
import {   Routes  , Route, useLocation } from "react-router-dom";
import routes from './Routes';

const Main = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
      <Routes>
        {routes.map((route, i) =>
        <Route path={route.path} exact={route.exact} key={i} element={<route.component />} />
        )}
      </Routes>
  )
}

export default Main;